import { Builder, By, promise, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

import metacache from './metacache';

promise.USE_PROMISE_MANAGER = false;

const BASE_URL = 'https://www.applyweb.com/eval';
const METADATA_ENDPOINT = '/new/reportbrowser/evaluatedCourses';

/**
 * Controls the driver requesting web data. Currently this is implemented as a
 * Selenium webdriver, but later this should be best implemented without the
 * chrome layer.
 */
class Driver {
  private username: string;
  private password: string;
  private driver: WebDriver;
  private hasInit = false;
  private hasAuth = false;

  public constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  /**
   * Initializes the selenium webdriver, and authenticates against NEU's SSO.
   */
  public async init(): Promise<void> {
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new Options().headless())
      .build();
    this.hasInit = true;

    await this.auth();
  }

  /**
   * Authenticates the webdriver against NEU's SSO so we can fetch data from the
   * TRACE website.
   */
  public async auth() {
    this.checkStatus();

    if (this.hasAuth) {
      console.warn('This webdriver has already been authorized!');
    }

    await this.driver.get('https://my.northeastern.edu');
    await this.driver.findElement(By.css('.inner-box a')).click();
    await this.driver.findElement(By.id('username')).sendKeys(this.username);
    await this.driver.findElement(By.id('password')).sendKeys(this.password);
    await this.driver.findElement(By.className('btn-submit')).click();
    await this.driver.get(`${BASE_URL}/shibboleth/neu/36892`);
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
    await this.driver.get(req);
    return JSON.parse(await this.driver.findElement(By.tagName('pre')).getText());
  }

  /**
   * Fetches the latest size of the remote database, and returns it as a number.
   */
  private async fetchLatestSize(): Promise<number> {
    return (await this.getMetaPage(1, 1)).total;
  }

  private checkStatus() {
    if (!this.hasInit) {
      throw Error(`Driver hasn't been initialized!`);
    }
  }

}

export default Driver;
