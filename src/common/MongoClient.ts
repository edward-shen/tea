import { MongoClient } from 'mongodb';

import Config from './Config';
import ExitCodes from './ExitCodes';

/**
 * Interface with the MongoDB server.
 */
class MongoDBClient {
  private client;
  private db;
  private _collection;

  public constructor(collection?: string) {
    this.client = new MongoClient(`mongodb://${Config.class_db.address}:${Config.class_db.port}`, {
      useNewUrlParser: true,
    });
    this.client.connect((err, client) => {
      if (err) {
        console.error('Could not connect to MongoDB; did you run yarn start:db?');
        process.exit(ExitCodes.MONGODB_NO_RESP);
      }

      this.db = client.db('tea');
      if (collection) {
        this.selectCollection(collection);
      }
    });
  }

  public get collection() {
    return this._collection;
  }

  public async size(): Promise<number> {
    return await this.collection.countDocuments();
  }

  public async put(doc): Promise<void> {
    await this.collection.insertOne(doc);
  }

  public async get(query, page = 0, rpp = 30) {
    return await this.collection
      .find(query)
      .skip(page * rpp)
      .limit(rpp)
      .toArray();
  }

  public close(): void {
    this.client.close();
  }

  private selectCollection(collection: string): void {
    this._collection = this.db.collection(collection);
  }
}

export default MongoDBClient;
