import { MongoClient } from "mongodb";
import { generateSlug } from "random-word-slugs";
import { Bracket } from "./model";

const connectionUri = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";

const DB_NAME = "svelte-demo";
const BRACKETS_COLLECTION = "brackets";
const BRACKET_LIMIT = 100;

export class Database {
  client: MongoClient;
  constructor(setupDb = true) {
    this.client = new MongoClient(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (setupDb) this.setupDb();
  }

  private async getDb() {
    // TODO: probably not necessary to check connection every time.
    if (!this.client.isConnected()) {
      const c = await this.client.connect();
      return c.db(DB_NAME);
    } else {
      return this.client.db(DB_NAME);
    }
  }

  async close() {
    return this.client.close();
  }

  async setupDb() {
    this.createIndexes();
  }

  async createIndexes() {
    const db = await this.getDb();
    return db
      .collection(BRACKETS_COLLECTION)
      .createIndex({ slug: 1 }, { unique: true });
  }

  async getCollection(collectionId: string) {
    const db = await this.getDb();
    return db.collection(collectionId);
  }

  // TODO: use user ID
  async getAllBrackets() {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    const results = await coll.find().toArray();
    const brackets = results.map((record) => new Bracket(record));
    return brackets;
  }

  async getBracketById(idStr: string) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    const query = {
      _id: idStr, // TODO: does this work to query ObjectId?
    };
    const result = await coll.findOne(query);
    const bracket = new Bracket(result);
    console.log("getBracket: ", bracket);
    return bracket;
  }

  async getBracketBySlug(slug: string) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    const result = await coll.findOne({ slug });
    const bracket = new Bracket(result);
    console.log("getBracketBySlug: ", bracket);
    return bracket;
  }

  async addBracket(bracket: Bracket) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    if (bracket.slug == undefined) {
      const slug = await this.makeUnusedSlug(BRACKETS_COLLECTION);
      bracket.slug = slug;
    }
    const result = await coll.insertOne(bracket);
    console.log("addBracket: ", result);
    return result;
  }

  async deleteBracket() {}

  async makeUnusedSlug(collectionId = BRACKETS_COLLECTION) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    while (true) {
      // we're clearly very confident we'll find an unused slug
      const slug = generateSlug();
      const result = await coll.findOne({ slug });
      if (result == null) return slug;
      console.warn(
        `Wow, ${slug} already exists in ${collectionId}. Trying again...`
      );
    }
  }
}

const db: Database = new Database();
export default db;
