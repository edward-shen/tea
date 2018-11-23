import { load } from 'cheerio';
import { XmlEntities } from 'html-entities';
import { CookieJar, defaults, jar } from 'request';
import CacheStatus from './cache/CacheStatus';

import metacache from './cache/MetaCache';

const BASE_URL = 'https://www.applyweb.com/eval';
const METADATA_ENDPOINT = '/new/reportbrowser/evaluatedCourses';

interface Response {
  err: any;
  resp: object;
  body: string;
}

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

  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.jar = jar();
    this.request = defaults({
      jar: this.jar,
      followAllRedirects: true,
      headers: {
        'User-Agent': `Your servers shouldn't return 401 on empty user-agents.`,
      },
    });
  }

  /**
   * Authenticates the webdriver against NEU's SSO so we can fetch data from the
   * TRACE website.
   */
  public async auth() {
    if (this.hasAuth) {
      console.warn('This webdriver has already been authorized!');
    }

    // Some variables that'll be used for authentication.
    let response;
    let postLocation;
    let $;

    // Get initial cookies for session authentication.
    response = await this.get({url: `${BASE_URL}/shibboleth/neu/36892`});

    // Login page
    $ = load(response.body);
    postLocation = $('form').attr('action');
    response = await this.post({
      url: `https://neuidmsso.neu.edu${postLocation}`,
      form: {
        ...this.getHiddenPostData(response.body),
        username: this.username,
        password: this.password,
      },
    });

    $ = load(response.body);
    postLocation = $('form').attr('action');
    this.jar.setCookie(`awBrowserCheck="true"`, 'https://www.applyweb.com/');
    response = await this.post({
      url: new XmlEntities().decode(postLocation),
      form: this.getHiddenPostData(response.body),
    });

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
    const resp = await this.get({url: req});
    return JSON.parse(resp.body);
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
    return (await this.get({
      url,
      encoding: null,
    })).body;
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
   * callback args as an object instead.
   *
   * @param options The options used to send to the request library.
   */
  private async get(options): Promise<Response> {
    return new Promise<Response>((resolve) => {
      this.request.get(options, (err, resp, body) => resolve({
        err, resp, body,
      }));
    });
  }

  /**
   * Simple async/await wrapper for the request post function. Returns the
   * callback args as an object instead.
   *
   * @param options The options used to send to the request library.
   */
  private async post(options): Promise<Response> {
    return new Promise<Response>((resolve) => {
      this.request.post(options, (err, resp, body) => resolve({
        err, resp, body,
      }));
    });
  }

  /**
   * Returns an request form compatible object containing hidden HTML post
   * fields, and tries to decode the field values from their HTTP entity form.
   *
   * @param html A string version of the HTML to get form data from.
   */
  private getHiddenPostData(html: string) {
    const retVal = Object.create(null);
    const $ = load(html);

    const formNames = [];
    $('input').each((_, e) => {
      formNames.push($(e).attr('name'));
    });

    const formFields = [];
    $('input').each((_, e) => {
      formFields.push($(e).attr('value'));
    });

    const decoder = new XmlEntities();
    for (let i = 0; i < formNames.length; i++) {
      retVal[formNames[i]] = decoder.decode(formFields[i]);
    }

    return retVal;
  }
}

export default Driver;
