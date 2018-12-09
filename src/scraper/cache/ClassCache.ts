import { MongoClient } from 'mongodb';

import Config from '../../common/Config';
import ExitCode from '../../common/ExitCodes';

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

  public async get(query) {
    return await this.collection.find(query);
  }

  public close() {
    this.client.close();
  }
}

export default new ClassCache();
