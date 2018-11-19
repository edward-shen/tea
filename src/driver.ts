import { Builder, By, promise, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import metacache from './metacache';

promise.USE_PROMISE_MANAGER = false;

const BASE_URL = 'https://www.applyweb.com/eval';
const METADATA_ENDPOINT = '/new/reportbrowser/evaluatedCourses';

class Driver {
  private username: string;
  private password: string;
  private driver: WebDriver;
  private hasInit: boolean = false;
  private hasAuth: boolean = false;


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

  public async updateCache(force: boolean = false) {
    this.checkStatus();

    const latest: number = await this.fetchLatestSize();
    const cacheSize: number = await metacache.size();

    console.log(cacheSize, latest);

    if (cacheSize > latest) {
      console.warn('Cache size (%s) is larger than latest (%s)', cacheSize, latest);
    } else if (cacheSize < latest) {
      console.log('cache is not up to date. Performing incremental update.');
      // Do stuff
    } else {
      console.log('cache has already been fully updated!');
    }
  }

  /**
   * Fetches the latest size of the remote database, and returns it as a number.
   */
  private async fetchLatestSize(): Promise<number> {
    await this.driver.get(`${BASE_URL}${METADATA_ENDPOINT}?excludeTA=false&page=1&rpp=1&termId=0`);
    const meta = JSON.parse(await this.driver.findElement(By.tagName('pre')).getText());

    return meta.total;
  }

  private checkStatus() {
    if (!this.hasInit) {
      throw Error(`Driver hasn't been initialized!`);
    }
  }

}

export default Driver;
