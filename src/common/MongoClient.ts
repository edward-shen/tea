import { MongoClient } from 'mongodb';

import Config from './Config';
import ExitCode from './ExitCodes';

/**
 * Interface with the MongoDB server.
 */
class ClassCache {
  private client;
  private db;
  private collection;

  public constructor() {
    this.client = new MongoClient(`mongodb://${Config.mongodb.address}:${Config.mongodb.port}`, {
      useNewUrlParser: true,
    });
    this.client.connect((err, client) => {
      if (err) {
        console.error('Could not connect to MongoDB; did you run yarn start:db?');
        process.exit(ExitCode.MONGODB_NO_RESP);
      }

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

  public async get(query, page = 0, rpp = 30) {
    return await this.collection
      .find(query)
      .skip(page * rpp)
      .limit(rpp)
      .toArray();
  }

  public close() {
    this.client.close();
  }
}

export default new ClassCache();
