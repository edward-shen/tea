import leveldown from 'leveldown';
import levelup from 'levelup';
import { resolve } from 'path';

/**
 * Interface with the leveldb.
 */
class ClassCache {
  private db;

  public constructor() {
    this.db = levelup(leveldown(resolve(__dirname, '../../cache/classdb')));
  }

  public async size() {
    let count = 0;
    let isDone = false;
    const iterator = this.db.iterator();

    while (!isDone) {
      await new Promise((resolve, reject) => {
        iterator.next((err, key, value) => {
          if (err) {
            reject();
          }

          if (key && value) {
            count += 1;
          } else {
            isDone = true;
          }

          resolve();
        });
      });
    }

    return count;
  }

  public async put(key: string, value) {
    await this.db.put(key, JSON.stringify(value));
  }

  public async get(key: string) {
    return JSON.parse((await this.db.get(key)).toString());
  }
}

export default new ClassCache();
