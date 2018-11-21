import { Builder, By, promise, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

import { get, post } from 'request';
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
  private cookies = {};

  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  /**
   * Authenticates the webdriver against NEU's SSO so we can fetch data from the
   * TRACE website.
   */
  public async auth(): Promise<void> {
    if (this.hasAuth) {
      console.warn('This webdriver has already been authorized!');
    }

    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new Options().headless())
      .build();

    // Request the login cookies
    get('https://my.northeastern.edu/c/portal/login', (_, resp, body) => {
      // We'll be given a No-JS version, which has a SAML post form.
      this.parseSetCookie(resp.headers['set-cookie']);
      const formFields = body.match(/(?<=\<input.*value=").*(?=")/g);

      // Post SAML request with cookies
      post({
        url: 'https://neuidmsso.neu.edu/idp/profile/SAML2/POST/SSO',
        headers: {
          cookie: this.cookies,
        },
        form: {
          RelayState: formFields[0],
          SAMLRequest: formFields[1],
        },
      }, (_, resp) => {
        // Will return a 302 redirect to url:
        // https://neuidmsso.neu.edu/idp/profile/SAML2/POST/SSO;jsessionid=xxxx?execution=e1s1
        this.parseSetCookie(resp.headers['set-cookie']);
        get({
          url: resp.headers.location,
          headers: {
            cookie: this.cookies,
          },
        }, (_, resp, body) => {
          console.log(body);
          // Now we're at the login form
          this.parseSetCookie(resp.headers['set-cookie']);
          const postLocation = body.match(/(?<=<form.*action=").*(?=")/g)[0];
          const hiddenPost = body.match(/(?<=<input type="hidden".*value=").*(?=")/g);
          // Post data, including hidden fields
          post({
            url: `https://neuidmsso.neu.edu${postLocation}`,
            headers: {
              cookies: this.cookies,
            },
            form: {
              username: this.username,
              password: this.password,
              lt: hiddenPost[0],
              execution: hiddenPost[1],
              _eventId: hiddenPost[2],
            },
          }, (_, resp) => {
            // Another fucking 302
            this.parseSetCookie(resp.headers['set-cookie']);
            get({
              url: resp.headers.location,
              headers: {
                cookie: this.cookies,
              },
            }, (_, resp, body) => {
              // console.log(resp.statusCode);
              // console.log(resp.headers);
              // console.log(body);
            });
          });
        });
      });
    });

    // await this.driver.get('https://my.northeastern.edu');
    // await this.driver.findElement(By.css('.inner-box a')).click();
    // await this.driver.findElement(By.id('username')).sendKeys(this.username);
    // await this.driver.findElement(By.id('password')).sendKeys(this.password);
    // await this.driver.findElement(By.className('btn-submit')).click();

    // console.log(await (await this.driver.findElement(By.css('html'))).getText());
    // await this.driver.get(`${BASE_URL}/shibboleth/neu/36892`);
    this.hasAuth = true;
  }

  /**
   * Checks and update the cache.
   * TODO: move to metacache.ts
   */
  public async checkCache() {
    this.checkStatus();

    const latest: number = await this.fetchLatestSize();
    const cacheSize: number = await metacache.size();

    if (cacheSize > latest) {
      console.warn('Cache size (%s) is larger than latest (%s)', cacheSize, latest);
    } else if (cacheSize < latest) {
      console.log('Cache is not up to date. Performing incremental update.');
      await metacache.updateCache(this, latest);
    } else {
      console.log('Cache has already been fully updated!');
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
    // await this.driver.get(req);
    // return JSON.parse(await this.driver.findElement(By.tagName('pre')).getText());
    return {total: 1, data: []}; // TODO: dummy
  }

  private parseSetCookie(str) {
    for (const cookie of str) {
      const relevant = cookie.slice(0, cookie.indexOf(';')).split('=');
      if (relevant[1] === '""') {
        delete this.cookies[relevant[0]];
      } else {
        this.cookies[relevant[0]] = relevant[1];
      }
    }
  }
  /**
   * Fetches the latest size of the remote database, and returns it as a number.
   */
  private async fetchLatestSize(): Promise<number> {
    return (await this.getMetaPage(1, 1)).total;
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

}

export default Driver;
