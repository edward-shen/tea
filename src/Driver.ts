import { load } from 'cheerio';
import { XmlEntities } from 'html-entities';
import { CookieJar, defaults, jar } from 'request';
import CacheStatus from './cache/CacheStatus';

import metacache from './cache/MetaCache';

const BASE_URL = 'https://www.applyweb.com/eval';
const METADATA_ENDPOINT = '/new/reportbrowser/evaluatedCourses';

// TODO: Handle read timeouts

/**
 * Controls the driver requesting web data. Currently this is implemented as a
 * Selenium webdriver, but later this should be best implemented without the
 * chrome layer.
 */
class Driver {
  private username: string;
  private password: string;
  private hasAuth = false;
  private jar: CookieJar;
  private request;

  /**
   * Creates a wrapper around the request library that stores the username and
   * password and has the ability to inject cookies. Also sets it up so that
   * the servers will be able to properly handle requests from the library.
   *
   * @param username The NEU username to use.
   * @param password The NEU password to use.
   */
  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.jar = jar();
    this.request = defaults({
      jar: this.jar,
      followAllRedirects: true,
      headers: {
        // This must be present for authentication to work.
        'User-Agent': `Your servers shouldn't return 401 on empty user-agents.`,
      },
    });
  }

  /**
   * Authenticates the webdriver against NEU's SSO so we can fetch data from the
   * TRACE website.
   */
  public async auth() {
    // Some variables that'll be used for authentication.
    let body;
    let postLocation;
    let $;

    // Get initial cookies for session authentication.
    body = await this.get({url: `${BASE_URL}/shibboleth/neu/36892`})[1];

    // Login page
    $ = load(body);
    postLocation = $('form').attr('action');
    body = await this.post({
      url: `https://neuidmsso.neu.edu${postLocation}`,
      form: {
        ...this.getHiddenPostData(body),
        username: this.username,
        password: this.password,
      },
    })[1];

    $ = load(body);
    postLocation = $('form').attr('action');
    // Injects cookie to bypass browser check.
    this.jar.setCookie(`awBrowserCheck="true"`, 'https://www.applyweb.com/');
    body = await this.post({
      url: new XmlEntities().decode(postLocation),
      form: this.getHiddenPostData(body),
    })[1];

    this.hasAuth = true;
  }

  /**
   * Returns the status of the cache.
   */
  public async checkCache(): Promise<CacheStatus> {
    this.checkStatus();

    const latest: number = await this.latestSize();
    const cacheSize: number = await metacache.size();

    if (cacheSize > latest) {
      console.warn('Cache size (%s) is larger than latest (%s)', cacheSize, latest);
      return CacheStatus.OVERFILLED;
    } else if (cacheSize < latest) {
      console.log('Cache is not up to date. Performing incremental update.');
      return CacheStatus.OUT_OF_DATE;
    } else {
      console.log('Cache has already been fully updated!');
      return CacheStatus.UP_TO_DATE;
    }
  }

  /**
   * Return the specified report page given the number of reports per pages.
   *
   * @param page The page number to fetch
   * @param rpp The number of reports of page. This is the offset.
   */
  public async getMetaPage(page: number, rpp: number) {
    this.checkStatus();

    const req = `${BASE_URL}${METADATA_ENDPOINT}?excludeTA=false&page=${page}&rpp=${rpp}&termId=0`;
    const [resp, body] = await this.get({url: req});

    // Might bug out if internet connection is bad...
    try {
      return JSON.parse(body);
    } catch (e) {
      console.log(resp.statusCode);
      console.log(resp.headers);
      console.log(body);
      throw Error(`Got error ${e} when parsing JSON!`);
    }
  }

  /**
   * Fetches the latest size of the remote database, and returns it as a number.
   */
  public async latestSize(): Promise<number> {
    return (await this.getMetaPage(1, 1)).total;
  }

  /**
   * Gets the PDF course data that correlate to the provided fields.
   * Returns the data in binary form.
   *
   * @param courseID The course number of the course to fetch.
   * @param instructorID The instructor ID of the course to fetch.
   * @param term The term of the course to fetch.
   */
  public async getPdf(courseID: number, instructorID: number, term: number) {
    return await this.getMetadata('pdf', courseID, instructorID, term);
  }

  /**
   * Gets the excel course data that correlate to the provided fields.
   * Returns the data in binary form.
   *
   * @param courseID The course number of the course to fetch.
   * @param instructorID The instructor ID of the course to fetch.
   * @param term The term of the course to fetch.
   */
  public async getExcel(courseID: number, instructorID: number, term: number) {
    return await this.getMetadata('excel', courseID, instructorID, term);
  }

  /**
   * Hits the specified endpoint with the specified query params and returns the
   * result as binary data.
   *
   * @param endpoint The endpoint to hit.
   * @param courseID The course number of the course to fetch.
   * @param instructorID The instructor ID of the course to fetch.
   * @param term The term of the course to fetch.
   */
  private async getMetadata(
    endpoint: string, courseID: number, instructorID: number, term: number) {
    this.checkStatus();

    const queryString = `r=2&c=${courseID}&i=${instructorID}&t=${term}&d=false`;
    const url = `${BASE_URL}/new/showreport/${endpoint}?${queryString}`;
    return (await this.get({ url, encoding: null }))[1];
  }

  /**
   * Checks whether or not the driver has been initialized yet. Throws an error
   * if the driver has not been initialize yet. This should be called within
   * the body of every function requiring the web driver.
   */
  private checkStatus(): void {
    if (!this.hasAuth) {
      throw Error(`Driver hasn't been authorized!`);
    }
  }

  /**
   * Simple async/await wrapper for the request get function. Returns the
   * callback args as an tuple instead.
   *
   * @param options The options used to send to the request library.
   */
  private get(options): Promise<[any, string]> {
    return this.requestOperation(this.request.get, options);
  }

  /**
   * Simple async/await wrapper for the request post function. Returns the
   * callback args as an tuple instead.
   *
   * @param options The options used to send to the request library.
   */
  private post(options): Promise<[any, string]> {
    return this.requestOperation(this.request.post, options);
  }

  /**
   * Consequence of the DRY principle. Returns a Promise for the HTTP response
   * and body, as a tuple.
   *
   * @param fn The request operation to call.
   * @param options The options to pass to the request function.
   */
  private requestOperation(fn, options): Promise<[any, string]> {
    return new Promise<[any, string]>((resolve, reject) => {
      fn(options, (err, resp, body) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve([resp, body]);
        }
      });
    });
  }

  /**
   * Returns an request form compatible object containing hidden HTML post
   * fields, and tries to decode the field values from their HTTP entity form.
   *
   * @param html A string version of the HTML to get form data from.
   */
  private getHiddenPostData(html: string) {
    const postData = {};

    const $ = load(html);
    const decoder = new XmlEntities();

    $('input').each((_, e) => {
      postData[$(e).attr('name')] = decoder.decode($(e).attr('value'));
    });

    return postData;
  }
}

export default Driver;
