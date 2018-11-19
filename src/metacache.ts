import { Database, OPEN_CREATE, OPEN_READWRITE } from 'sqlite3';
import { resolve } from 'path';

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

  public constructor() {
    this.db = new Database(resolve(__dirname, '../cache/meta.db'), OPEN_READWRITE | OPEN_CREATE);
    this.init();
  }

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
   * Attempts to initialize the tables inside the DB if they don't exist. If the
   * tables already exist, then this function does nothing.
   */
  private async init() {
    return new Promise((resolve) => {
      // Check if the table exists
      this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${TABLE_NAME}'`, (err, res) => {
        if (err) {
          throw Error(err.message);
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
          )`, (err, res) => {
            if (err) {
              throw Error(err);
            }
            this.hasInit = true;
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
