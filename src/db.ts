import { MongoClient } from "mongodb";
import { Bracket } from "./model";

const connectionUri =
  "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";

const DB_NAME = "svelte-demo";
const BRACKETS_COLLECTION = "brackets";
const BRACKET_LIMIT = 100;

export class Database {
  client: MongoClient;
  constructor() {
    this.client = new MongoClient(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  private async getDb() {
    if (!this.client.isConnected()) {
      const c = await this.client.connect();
      return c.db(DB_NAME);
    } else {
      return this.client.db(DB_NAME);
    }
  }

  async closeDb() {
    return this.client.close();
  }

  async createIndexes() {
    // TODO
  }

  // TODO: use user ID
  async getAllBrackets() {
    const db = await this.getDb();
    const coll = db.collection(BRACKETS_COLLECTION);
    const results = await coll.find().toArray();
    const brackets = results.map((record) => new Bracket(record));
    return brackets;
  }

  async getBracket(idStr: string) {
    const db = await this.getDb();
    const coll = db.collection(BRACKETS_COLLECTION);
    const query = {
      _id: idStr, // TODO: does this work to query ObjectId?
    };
    const result = await coll.findOne(query);
    const bracket = new Bracket(result);
    console.log("getBracket: ", bracket);
    return bracket;
  }

  async addBracket(bracket: Bracket) {
    const db = await this.getDb();
    const coll = db.collection(BRACKETS_COLLECTION);
    const result = await coll.insertOne(bracket);
    console.log("addBracket: ", result);
    return result;
  }

  async deleteBracket() {}
}

const db: Database = new Database();
export default db;

