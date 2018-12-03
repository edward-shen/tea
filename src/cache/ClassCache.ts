import { MongoClient } from 'mongodb';

/**
 * Interface with the leveldb.
 */
class ClassCache {
  private client;
  private db;
  private collection;

  public constructor() {
    // this.db = levelup(leveldown(`${DATABASE_LOCATION}/classdb`));
    this.client = new MongoClient('mongodb://localhost:27017');
    this.client.connect((_, client) => {
      this.db = client.db('tea');
      this.collection = this.db.collection('class');
    });
  }

  public async size() {
    return await this.collection.count();
  }

  public async put(doc) {
    await this.collection.insertOne(doc);
  }

  public async get(query) {
    return await this.collection.find(query);
  }
}

export default new ClassCache();
