import { MongoClient } from 'mongodb';

/**
 * Interface with the MongoDB server.
 */
class ClassCache {
  private client;
  private db;
  private collection;

  public constructor() {
    this.client = new MongoClient('mongodb://localhost:27017', {
      useNewUrlParser: true,
    });
    this.client.connect((_, client) => {
      this.db = client.db('tea');
      this.collection = this.db.collection('class');
    });
  }

  public async size() {
    return await this.collection.countDocuments();
  }

  public async put(doc) {
    await this.collection.insertOne(doc);
  }

  public async get(query) {
    return await this.collection.find(query);
  }

  public close() {
    this.client.close();
  }
}

export default new ClassCache();
