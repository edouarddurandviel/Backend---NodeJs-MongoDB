import { MongoClient, Db, Collection } from "mongodb";
import config from "../_config/mongoDb";

//const uri = config.uri || "mongodb://localhost:27017";
const dbName = config.db || "test";
const uri = "mongodb://root:edouard@localhost:27017/test?authSource=admin";

let client: MongoClient;
let db: Db;

export const connectToDatabase = async () => {
  if (db) return;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
};

export const closeDatabase = async () => {
  if (client) {
    await client.close();
  }
};

export const inCollection = async (collection: string) => {
  const list: Collection = await db.collection(collection);
  return list;
};

export const dbase = async () => {
  console.log(db);
  return db;
};
