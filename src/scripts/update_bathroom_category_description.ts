import "dotenv/config";
import { connectDatabase, getDatabase } from "../config/database.js";
import { ObjectId } from "mongodb";

async function updateBathroomCategoryDescription() {
  await connectDatabase();
  const db = getDatabase();

  const categoryId = new ObjectId("6ac4112c079b63ca2b27b041");
  const collection = db.collection("service_categories");

  // 1. Fetch current record
  const currentRecord = await collection.findOne({ _id: categoryId });
  if (!currentRecord) {
    throw new Error(`Category with ID ${categoryId} not found in service_categories.`);
  }

  console.log("Current Category Record:");
  console.log({
    _id: currentRecord._id.toString(),
    name: currentRecord.name,
    slug: currentRecord.slug,
    description: currentRecord.description,
  });

  const newDescription =
    "Transform your bathroom with quality waterproofing, modern tilework, bespoke vanities and functional fixtures designed for everyday comfort.";

  // 2. Update description
  const updateResult = await collection.updateOne(
    { _id: categoryId },
    {
      $set: {
        description: newDescription,
        updatedAt: new Date(),
      },
    }
  );

  console.log("\nUpdate result:", {
    matchedCount: updateResult.matchedCount,
    modifiedCount: updateResult.modifiedCount,
  });

  // 3. Verify all categories
  console.log("\n--- VERIFYING ALL SERVICE CATEGORIES ---");
  const allCategories = await collection.find().sort({ displayOrder: 1 }).toArray();
  allCategories.forEach((cat, idx) => {
    console.log(`\n${idx + 1}. [${cat.name}] (${cat.slug})`);
    console.log(`   Description: "${cat.description}"`);
  });

  process.exit(0);
}

updateBathroomCategoryDescription().catch((err) => {
  console.error("Error updating bathroom category description:", err);
  process.exit(1);
});
