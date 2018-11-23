import leveldown from 'leveldown';
import levelup from 'levelup';
import { resolve } from 'path';

class ClassCache {
  private db;

  public constructor() {
    this.db = levelup(leveldown(resolve(__dirname, '../../cache/classdb')));
  }

  public async put(key: string, value: JSON) {
    await this.db.put(key, JSON.stringify(value));
  }

  public async get(key: string) {
    return JSON.parse((await this.db.get(key)).toString());
  }
}

export default new ClassCache();
