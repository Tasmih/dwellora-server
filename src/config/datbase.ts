import { MongoClient, type Db } from "mongodb";
let client: MongoClient;
let database: Db;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;

  if (!uri || !databaseName) {
    throw new Error("MONGODB_URI and MONGODB_DB are required");
  }

  client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(databaseName);

    await db.command({ ping: 1 });

    database = db;

    console.log("MongoDB connected successfully");
  } catch (error) {
    await client.close();
    throw error;
  }
}

export function getDatabase(): Db {
  if (!database) {
    throw new Error("Database is not connected");
  }

  return database;
}