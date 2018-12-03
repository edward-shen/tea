import * as Deque from 'double-ended-queue';
import { existsSync, mkdirSync } from 'fs';
import { Database } from 'sqlite3';

import { DATABASE_LOCATION } from '../utils';

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
  private readonly TABLE = 'metadata';
  private db: Database;
  private hasInit = false;
  private awaitingInit: Deque<() => void> = new Deque();

  /**
   * Opens up the existing cache and begin startup checks for the database.
   */
  public constructor() {
    if (!existsSync(DATABASE_LOCATION)) {
      mkdirSync(DATABASE_LOCATION);
    }

    this.db = new Database(`${DATABASE_LOCATION}/meta.db`, () => this.init());
  }

  /**
   * Returns the size of the cache. If the database has not been initialized
   * yet, wait for the database to fully initialize. Then, query and return the
   * number of rows in the cache.
   */
  public async size(): Promise<number> {
    await this.finishInit();

    return new Promise<number>((ok) => {
      this.db.get(`SELECT COUNT(*) FROM ${this.TABLE}`, (err, res) => {
        if (err) {
          throw Error(`Could not query database! ${err}`);
        } else {
          ok(res['COUNT(*)']);
        }
      });
    });
  }

  /**
   * Returns the necessary metadata needed for class fetching and caching.
   */
  public async getReportData() {
    return await this.all(`SELECT * from ${this.TABLE}`);
  }

  /**
   * Waits for init to finish before returning. If the cache was already init,
   * then return immediately.
   */
  public async finishInit() {
    return new Promise((resolve) => {
      if (this.hasInit) {
        resolve();
      } else {
        this.awaitingInit.push(resolve);
      }
    });
  }

  /**
   * Select the values that we want to add to our data from all JSON fields per
   * report, and then insert them in parallel since this should be a write-only
   * database.
   *
   * @param json Array of JSON metadata to add to our database.
   */
  public async addToCache(json: Metadata[]) {
    this.db.parallelize(() => { // Kinda like a #pragma lmao
      for (const report of json) {
        const row = [
          report.id,
          report.instructorId,
          report.termId,
          report.subject,
          Number(report.number),
          report.termTitle,
          report.name,
          report.instructorFirstName,
          report.instructorLastName,
          report.termEndDate,
          report.enrollment,
          Number(report.sourceId),
          report.type,
          report.level,
        ];

        this.db.run(
          `INSERT INTO ${this.TABLE} VALUES (${'?, '.repeat(row.length).slice(0, -2)})`, row);
      }
    });
  }

  /**
   * Simple async/await wrapper for db.all() function.
   *
   * @param arg The SQL command to pass to the DB.
   */
  private async all(arg) {
    return new Promise((resolve) => {
      this.db.all(arg, (_, res) => {
        resolve(res);
      });
    });
  }

  /**
   * Attempts to initialize the tables inside the DB if they don't exist. If the
   * tables already exist, then this function does nothing.
   */
  private async init() {
    const resolveOk = (resolve) => {
      this.hasInit = true;
      while (!this.awaitingInit.isEmpty()) {
        this.awaitingInit.pop()();
      }
      resolve();
    };

    return new Promise((resolve) => {
      // Check if the table exists
      const query = `SELECT name FROM sqlite_master WHERE type='table' AND name='${this.TABLE}'`;
      this.db.get(query, (err, res) => {
        if (err) {
          throw Error(`init error: ${err.message}`);
        }

        if (res === undefined) {
          // Number field needs to be converted
          // source id needs to be a number
          this.db.run(`CREATE TABLE ${this.TABLE}(
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
            console.log('Metacache database not found. Created a new DB.');
            resolveOk(resolve);
          });
        } else {
          resolveOk(resolve);
        }
      });
    });
  }
}

export default new MetaCache();
