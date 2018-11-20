import { Database } from 'sqlite3';
import { resolve } from 'path';
import { Bar } from 'cli-progress';
import { existsSync, mkdirSync } from 'fs';

import Driver from './driver';

const TABLE_NAME = 'metadata';

/**
 * Keeps track of metadata, storing information in a SQLite database. This was
 * chosen because the less we hit NEU's/applyweb's servers, the less suspicious
 * we look.
 *
 * We store data in a SQLite database because we want something naturally
 * persistent and portable while being able to handle large amounts of data.
 * While a NoSQL database might also work, the structure of metadata best fits
 * a relational database.
 */
class MetaCache {
  private db: Database;
  private hasInit = false;

  /**
   * Opens up the existing cache and begin startup checks for the database.
   */
  public constructor() {
    const dir = resolve(__dirname, '../cache');

    if (!existsSync(dir)){
      mkdirSync(dir);
    }

    this.db = new Database(`${dir}/meta.db`, () => {
      this.init();
    });
  }


  /**
   * Returns the size of the cache. If the database has not been initialized
   * yet, wait for the database to fully initialize. Then, query and return the
   * number of rows in the cache.
   */
  public async size(): Promise<number> {
    if (!this.hasInit) {
      await this.init();
    }

    return new Promise<number>((resolve) => {
      this.db.get(`SELECT COUNT(*) FROM ${TABLE_NAME}`, (err, res) => {
        if (err) {
          throw Error(`Could not query database!${err}`);
        } else {
          resolve(res['COUNT(*)']);
        }
      });
    });
  }

  /**
   *
   * @param driver The driver to use to scrape the data from.
   * @param retrievedNum The number of records to fetch
   * @param start The report to start at.
   */
  public async updateCache(driver: Driver, retrievedNum: number) {
    if (!this.hasInit) {
      await this.init();
    }

    /**
     * TODO: So this code is under the assumption that we will always add $rpp
     * amounts every time, and that the database is consistent to every $rpp
     * reports. This might not be the case, so we need to delete entries until
     * we hit a multiple of $rpp, and then start fetching from there.
     * There isn't really a clean way to do this otherwise because of the
     * limitations of the API.
     */

    const start = await this.size();
    const toFetch: number = retrievedNum - start;
    const rpp: number = 100;
    let page: number = Math.floor(start / rpp) + 1;
    let runningSum: number = 0;

    const bar = new Bar();

    bar.start(Math.ceil(toFetch/ rpp), 0);

    while (runningSum < toFetch) {
      const jsonData: Metadata[] = (await driver.getMetaPage(page, rpp)).data;
      const numToParse: number = Math.min(toFetch - runningSum, rpp);
      jsonData.length = numToParse; // Trim the amount to get
      this.addToCache(jsonData); // Don't wait for database to finish updating.
      runningSum += numToParse;
      bar.increment();
    }

    bar.stop();
    this.db.close();
  }

  /**
   * Select the values that we want to add to our data from all JSON fields per
   * report, and then insert them in parallel since this should be a write-only
   * database.
   *
   * @param json Array of JSON metadata to add to our database.
   */
  private async addToCache(json: Metadata[]) {
    this.db.parallelize(() => { // Kinda like a #pragma lmao
      for (const report of json) {
        const row = {
          $id: report.id,
          $instructorId: report.instructorId,
          $termId: report.termId,
          $subject: report.subject,
          $number: Number(report.number),
          $termTitle: report.termTitle,
          $name: report.name,
          $instructorFirstName: report.instructorFirstName,
          $instructorLastName: report.instructorLastName,
          $termEndDate: report.termEndDate,
          $enrollment: report.enrollment,
          $sourceId: Number(report.sourceId),
          $type: report.type,
          $level: report.level
        };

        this.db.run(`INSERT INTO ${TABLE_NAME} VALUES (
          $id,
          $instructorId,
          $termId,
          $subject,
          $number,
          $termTitle,
          $name,
          $instructorFirstName,
          $instructorLastName,
          $termEndDate,
          $enrollment,
          $sourceId,
          $type,
          $level
        )`, row);
      }
    });
  }

  /**
   * Attempts to initialize the tables inside the DB if they don't exist. If the
   * tables already exist, then this function does nothing.
   */
  private async init() {
    return new Promise((resolve) => {
      // Check if the table exists
      this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${TABLE_NAME}'`, (err, res) => {
        if (err) {
          throw Error(`init error: ${err.message}`);
        }

        if (res === undefined) {
          // Number field needs to be converted
          // source id needs to be a number
          this.db.run(`CREATE TABLE ${TABLE_NAME}(
            id INTEGER,
            instructorId INTEGER,
            termId INTEGER,
            subject TEXT,
            number INTEGER,
            termTitle TEXT,
            name TEXT,
            instructorFirstName TEXT,
            instructorLastName TEXT,
            termEndDate INTEGER,
            enrollment INTEGER,
            sourceId INTEGER,
            type TEXT,
            level TEXT
          )`, (err, _) => {
            if (err) {
              throw Error(err);
            }
            this.hasInit = true;
            console.log('Metacache database not found, created a new db!');
            resolve();
          });
        } else {
          this.hasInit = true;
          resolve();
        }
      });
    });
  }
}

export default new MetaCache();
