import "dotenv/config";
import { connectDatabase, getDatabase } from "../config/database.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

async function syncServices() {
  await connectDatabase();
  const db = getDatabase();

  console.log("Connected to MongoDB database:", process.env.MONGODB_DB);

  // Read services.import.json
  const importJsonPath = path.resolve(process.cwd(), "src/seed/services.import.json");
  const rawServices = JSON.parse(fs.readFileSync(importJsonPath, "utf-8"));

  console.log(`Read ${rawServices.length} services from ${importJsonPath}`);

  // Prepare documents for MongoDB insertion
  const parsedServices = rawServices.map((item: any) => ({
    _id: new ObjectId(item._id.$oid),
    title: item.title,
    slug: item.slug,
    shortDescription: item.shortDescription,
    description: item.description,
    image: item.image,
    includedItems: item.includedItems || [],
    seo: item.seo,
    categoryId: new ObjectId(item.categoryId.$oid),
    status: item.status || "published",
    createdAt: new Date(item.createdAt.$date),
    updatedAt: new Date(item.updatedAt.$date),
  }));

  // Clean old services and insert the 21 services
  console.log("\nDeleting existing services from 'services' collection...");
  const deleteResult = await db.collection("services").deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} old documents from 'services' collection.`);

  console.log("\nInserting 21 verified services...");
  const insertResult = await db.collection("services").insertMany(parsedServices);
  console.log(`Successfully inserted ${insertResult.insertedCount} services.`);

  // Verify in database
  const count = await db.collection("services").countDocuments();
  console.log(`\nTotal services in MongoDB collection now: ${count}`);

  // Verify category distribution
  console.log("\n--- Category Distribution in DB ---");
  const categories = await db.collection("service_categories").find().toArray();
  for (const cat of categories) {
    const matchedServices = await db
      .collection("services")
      .find({ categoryId: cat._id, status: "published" })
      .toArray();

    console.log(`Category: "${cat.name}" (Slug: ${cat.slug}) -> ${matchedServices.length} services:`);
    matchedServices.forEach((s) => console.log(`   - ${s.title}`));
  }

  process.exit(0);
}

syncServices().catch((err) => {
  console.error("Error syncing services:", err);
  process.exit(1);
});
