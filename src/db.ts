import { MongoClient } from "mongodb";
import { generateSlug } from "random-word-slugs";
import { Bracket, Participant } from "./model";

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
    // TODO: smarter way to manage connection?
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

  async getCollection(collectionId: string) {
    const db = await this.getDb();
    return db.collection(collectionId);
  }

  async createIndexes() {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    await coll.createIndex({ slug: 1 }, { unique: true });
    await coll.createIndex({ userId: 1 });
    return;
  }

  async getUserBrackets(userId: string) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    const results = await coll.find({ userId }).toArray();
    const brackets = results.map((record) => new Bracket(record));
    return brackets;
  }

  async getBracketById(idStr: string) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    const query = {
      _id: idStr,
    };
    const result = await coll.findOne(query);
    if (result == null) {
      return null;
    }
    const bracket = new Bracket(result);
    // console.log("getBracket: ", bracket);
    return bracket;
  }

  async getUserBracketBySlug(userId: string, slug: string) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    const query = { slug, userId };
    const result = await coll.findOne(query);
    if (result == null) {
      console.warn("getUserBracketBySlug: bracket not found for query", query);
      return null;
    }
    const bracket = new Bracket(result);
    // console.log("getUserBracketBySlug: ", bracket);
    return bracket;
  }

  async addUserBracket(userId: string, bracket: Bracket) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    if (bracket.slug == undefined) {
      const slug = await this.makeUnusedSlug(BRACKETS_COLLECTION);
      bracket.slug = slug;
    }
    const result = await coll.insertOne(bracket);
    // console.log("addUserBracket: ", result);
    return result;
  }

  async updateUserBracket(
    userId: string,
    bracketSlug: string,
    updateDoc: Partial<Bracket>
  ) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    const bracket = await this.getUserBracketBySlug(userId, bracketSlug);
    if (bracket == null) {
      console.warn(`Tried to update nonexistent bracket: ${bracketSlug}`);
      return null;
    }
    if (updateDoc?.lastModifiedAt != undefined) {
      // We can't have lastModifiedAt in the update document if we want to set
      // it with $currentDate.
      delete updateDoc.lastModifiedAt;
    }
    const result = await coll.updateOne(
      { slug: bracketSlug },
      { $set: updateDoc, $currentDate: { lastModifiedAt: true } }
    );
    return result;
  }

  async deleteUserBracket(userId: string, slug: string) {
    const coll = await this.getCollection(BRACKETS_COLLECTION);
    const result = await coll.deleteOne({ slug, userId });
    return result;
  }

  /**
   * Generate a slug that hasn't already been used in a given collection.
   */
  async makeUnusedSlug(collectionId = BRACKETS_COLLECTION) {
    const coll = await this.getCollection(collectionId);
    // Just keep trying until we find an unused slug:
    while (true) {
      const slug = generateSlug();
      const result = await coll.findOne({ slug });
      if (result == null) {
        return slug;
      }
      console.warn(
        `Wow, ${slug} already exists in ${collectionId}. Trying again...`
      );
    }
  }

  /**
   * Add a list of participants to an existing bracket.
   */
  async addBracketParticipants(
    userId: string,
    bracketSlug: string,
    participants: Participant[]
  ) {
    const bracket = await this.getUserBracketBySlug(userId, bracketSlug);
    if (bracket == null) {
      console.warn(
        `Tried to add participants to nonexistent bracket: ${bracketSlug}`
      );
      return null;
    }

    bracket.participants = bracket.participants.concat(participants);
    const result = await this.updateUserBracket(userId, bracketSlug, {
      participants: bracket.participants,
    });
    return result;
  }
}

const db: Database = new Database();
export default db;
