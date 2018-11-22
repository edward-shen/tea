import { Builder, By, promise, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

import { defaults } from 'request';
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
  private request = defaults({jar: true, followAllRedirects: true});

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

    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new Options().headless())
      .build();

    // Some variables that'll be used for authentication.
    let response;
    let formFields;
    let postLocation;
    let hiddenPost;

    // Get initial cookies for session authentication.
    response = await this.get({url: 'https://my.northeastern.edu/c/portal/login'});

    // No-JS prompt
    formFields = response.body.match(/(?<=\<input.*value=").*(?=")/g);
    response = await this.post({
      url: 'https://neuidmsso.neu.edu/idp/profile/SAML2/POST/SSO',
      form: {
        RelayState: formFields[0],
        SAMLRequest: formFields[1],
      },
    });

    // Login page
    postLocation = response.body.match(/(?<=<form.*action=").*(?=" .*)/g)[0];
    hiddenPost = response.body.match(/(?<=<input type="hidden".*value=").*(?=")/g);
    response = await this.post({
      url: `https://neuidmsso.neu.edu${postLocation}`,
      form: {
        username: this.username,
        password: this.password,
        lt: hiddenPost[0],
        execution: hiddenPost[1],
        _eventId: hiddenPost[2],
      },
    });

    // Another No-JS prompt
    formFields = response.body.match(/(?<=\<input.*value=").*(?=")/g);
    response = await this.post({
      url: 'https://my.northeastern.edu/c/portal/saml/acs',
      form: {
        RelayState: formFields[0],
        SAMLResponse: formFields[1],
      },
    });

    // We are now authenticated against NEU.
    console.log('Driver is now authenticated against NEU!');

    // Authenticated against ApplyWeb.
    response = await this.get({url: `${BASE_URL}/shibboleth/neu/36892`});

    formFields = response.body.match(/(?<=\<input.*value=").*(?=")/g);
    // Because the first field is a cookie but when sending it
    // In the post we should replace the HTTP entity with what
    // it really is
    formFields[0] = formFields[0].replace(/&#x3a;/, ':');
    response = await this.post({
      url: `https://www.applyweb.com/eval/shibboleth/neu/Shibboleth.sso/SAML2/POST`,
      form: {
        RelayState: formFields[0],
        SAMLResponse: formFields[1],
      },
    });

    // At this point we're still getting a 401 user not found.
    console.log(response.body);

    // await this.driver.get('https://my.northeastern.edu');
    // await this.driver.findElement(By.css('.inner-box a')).click();
    // await this.driver.findElement(By.id('username')).sendKeys(this.username);
    // await this.driver.findElement(By.id('password')).sendKeys(this.password);
    // await this.driver.findElement(By.className('btn-submit')).click();Update pages.css

    // console.log(await (await this.driver.findElement(By.css('html'))).getText());
    // await this.driver.get(`${BASE_URL}/shibboleth/neu/36892`);
    // console.log(await (await this.driver.findElement(By.css('html'))).getText());
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

}

export default Driver;
