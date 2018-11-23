import { load } from 'cheerio';
import { XmlEntities } from 'html-entities';
import { defaults } from 'request';
import { Builder, By, promise, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

import metacache from './cache/metacache';

const BASE_URL = 'https://www.applyweb.com/eval';
const METADATA_ENDPOINT = '/new/reportbrowser/evaluatedCourses';

/**
 * Controls the driver requesting web data. Currently this is implemented as a
 * Selenium webdriver, but later this should be best implemented without the
 * chrome layer.
 */
class Driver {
  private driver;
  private username: string;
  private password: string;
  private hasAuth = false;
  private request = defaults({
    jar: true,
    followAllRedirects: true,
  });

  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
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
    response = await this.post({
      url: new XmlEntities().decode(postLocation),
      form: this.getHiddenPostData(response.body),
    });

    console.log(response.body);
    this.hasAuth = true;
  }

  /**
   * Returns the status of the cache.
   */
  public async checkCache() {
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
    await this.driver.get(req);
    return JSON.parse(await this.driver.findElement(By.tagName('pre')).getText());
    return {total: 1, data: []}; // TODO: dummy
  }

  /**
   * Fetches the latest size of the remote database, and returns it as a number.
   */
  public async latestSize(): Promise<number> {
    return (await this.getMetaPage(1, 1)).total;
  }

  public async getPdf(courseID: number, instruID: number, term: number) {
    const fetchCookies = {};
    const cookies = await this.driver.manage().getCookies();

    for (const cookie of cookies) {
        fetchCookies[cookie.name] = cookie.value;
    }

    console.log(fetchCookies);
    const next = `${BASE_URL}/new/showreport/pdf?r=2&c=${courseID}&i=${instruID}&t=${term}&d=false`;
    this.request({
      url: next,
      headers: {
        cookie: fetchCookies,
      },
    }, (_, resp, body) => {
      console.log(resp.headers);
      console.log(body);
    });
  }

  /**
   * Checks whether or not the driver has been initialized yet. Throws an error
   * if the driver has not been initialize yet. This should be called within
   * the body of every function requiring the web driver.
   */
  private checkStatus() {
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
  private async get(options) {
    return new Promise((resolve) => {
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
  private async post(options) {
    return new Promise((resolve) => {
      this.request.post(options, (err, resp, body) => resolve({
        err, resp, body,
      }));
    });
  }

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
