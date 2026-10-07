import { MongoClient, type Db } from "mongodb";
let client: MongoClient;
let database: Db;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;

  if (!uri || !databaseName) {
    throw new Error("MONGODB_URI and MONGODB_DB are required");
  }

  client = new MongoClient(uri, {
    maxPoolSize: 20,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();

    const db = client.db(databaseName);

    await db.command({ ping: 1 });

    database = db;

    console.log("MongoDB connected successfully");

    // Ensure production indexes for high performance
    Promise.all([
      db.collection("services").createIndex({ slug: 1 }),
      db.collection("services").createIndex({ status: 1, createdAt: -1 }),
      db.collection("services").createIndex({ categoryId: 1, status: 1 }),
      db.collection("projects").createIndex({ slug: 1 }),
      db.collection("projects").createIndex({ status: 1, createdAt: -1 }),
      db.collection("blogs").createIndex({ slug: 1 }),
      db.collection("blogs").createIndex({ status: 1, createdAt: -1 }),
      db.collection("categories").createIndex({ slug: 1 }),
      db.collection("admins").createIndex({ email: 1 }),
    ]).catch((err) => {
      console.warn("Index check note:", err?.message || err);
    });
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