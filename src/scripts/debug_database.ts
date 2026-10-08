import "dotenv/config";
import { connectDatabase, getDatabase } from "../config/database.js";
import fs from "fs";
import path from "path";

async function runDebug() {
  await connectDatabase();
  const db = getDatabase();

  console.log("\n--- COLLECTIONS IN DATABASE ---");
  const collections = await db.listCollections().toArray();
  console.log(collections.map((c) => c.name));

  const dbCategories = await db.collection("service_categories").find().toArray();
  console.log(`Found ${dbCategories.length} categories:`);
  dbCategories.forEach((c, i) => {
    console.log(
      `${i + 1}. _id: ${c._id.toString()} | name: "${c.name}" | slug: "${c.slug}" | status: "${c.status}"`
    );
  });

  // Check services
  console.log("\n--- SERVICES IN DATABASE ---");
  const dbServices = await db.collection("services").find().toArray();
  console.log(`Found ${dbServices.length} services in database:`);
  dbServices.forEach((s, i) => {
    console.log(
      `${i + 1}. _id: ${s._id?.toString()} | title: "${s.title}" | slug: "${s.slug}" | categoryId: ${s.categoryId?.toString()} | status: "${s.status}"`
    );
  });

  // Compare with services.import.json
  const importJsonPath = path.resolve(process.cwd(), "src/seed/services.import.json");
  const importServices = JSON.parse(fs.readFileSync(importJsonPath, "utf-8"));
  console.log(`\nImport JSON has ${importServices.length} services.`);

  const importTitles = new Set(importServices.map((s: any) => s.title));
  const oldOrExtraServices = dbServices.filter((s) => !importTitles.has(s.title));
  console.log(`\nOld / Extra / Mismatched services in DB (${oldOrExtraServices.length}):`);
  oldOrExtraServices.forEach((s, i) => {
    console.log(`${i + 1}. "${s.title}" (_id: ${s._id.toString()})`);
  });

  process.exit(0);
}

runDebug().catch((err) => {
  console.error(err);
  process.exit(1);
});
