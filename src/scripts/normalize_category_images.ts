import "dotenv/config";
import { connectDatabase, getDatabase } from "../config/database.js";
import { categoryCollection } from "../models/category.models.js";
import { getCategories } from "../controllers/category.controller.js";

async function normalizeCategoryImages() {
  await connectDatabase();
  const collection = categoryCollection();

  console.log("==================================================");
  console.log("NORMALIZING SERVICE CATEGORIES IMAGE URLS");
  console.log("==================================================\n");

  const categories = await collection.find().toArray();
  console.log(`Found total ${categories.length} categories in database.`);

  let updatedCount = 0;
  const updatedList: { name: string; slug: string; oldUrl: string; newUrl: string }[] = [];

  for (const cat of categories) {
    if (cat.image && cat.image.includes("i.ibb.co.com")) {
      const oldUrl = cat.image;
      const newUrl = cat.image.replace(/i\.ibb\.co\.com/gi, "i.ibb.co");

      await collection.updateOne(
        { _id: cat._id },
        {
          $set: {
            image: newUrl,
            updatedAt: new Date(),
          },
        }
      );

      updatedCount++;
      updatedList.push({
        name: cat.name,
        slug: cat.slug,
        oldUrl,
        newUrl,
      });
    }
  }

  console.log(`\nUpdated ${updatedCount} category image URL(s):`);
  updatedList.forEach((item, idx) => {
    console.log(`${idx + 1}. [${item.name}] (${item.slug})`);
    console.log(`   Old: ${item.oldUrl}`);
    console.log(`   New: ${item.newUrl}`);
  });

  console.log("\n==================================================");
  console.log("VERIFYING ALL CATEGORIES VIA GET /api/categories");
  console.log("==================================================\n");

  let apiResponse: any = null;
  const mockReq: any = {};
  const mockRes: any = {
    status: () => mockRes,
    json: (data: any) => {
      apiResponse = data;
      return mockRes;
    },
  };
  const mockNext = (err: any) => {
    console.error("API Error:", err);
  };

  await (getCategories as any)(mockReq, mockRes, mockNext);

  const verifiedCategories = apiResponse?.categories || [];
  let allNormalized = true;

  verifiedCategories.forEach((cat: any, i: number) => {
    const hasIbbCom = cat.image?.includes("i.ibb.co.com");
    const isIbb = cat.image?.startsWith("https://i.ibb.co/");
    if (hasIbbCom || !isIbb) {
      allNormalized = false;
    }
    console.log(`${i + 1}. ${cat.name} (${cat.slug}) -> ${cat.image} [${isIbb ? "VALID HTTPS://I.IBB.CO" : "INVALID"}]`);
  });

  console.log("\n==================================================");
  console.log(`ALL CATEGORY IMAGES NORMALIZED: ${allNormalized ? "SUCCESS" : "FAILED"}`);
  console.log("==================================================");

  process.exit(0);
}

normalizeCategoryImages().catch((err) => {
  console.error("Normalization script error:", err);
  process.exit(1);
});
