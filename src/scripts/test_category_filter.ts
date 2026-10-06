import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";

// Load JSON data
const jsonPath = path.resolve(process.cwd(), "src/seed/services.import.json");
const services = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

// 8 Categories definition
const categories = [
  {
    _id: new ObjectId("6ac3fcbe079b63ca2b27b03f"),
    name: "Full Home Renovation",
    slug: "full-home-renovation",
    status: "published",
    expectedCount: 2,
    expectedServices: ["Complete Home Renovation", "Interior Home Remodeling"],
  },
  {
    _id: new ObjectId("6ac40c35079b63ca2b27b040"),
    name: "Kitchen Renovation",
    slug: "kitchen-renovation",
    status: "published",
    expectedCount: 4,
    expectedServices: [
      "Kitchen Cabinet Renovation",
      "Kitchen Counter Renovation",
      "Kitchen Hood Renovation",
      "Full Kitchen Renovation",
    ],
  },
  {
    _id: new ObjectId("6ac4112c079b63ca2b27b041"),
    name: "Bathroom Renovation",
    slug: "bathroom-renovation",
    status: "published",
    expectedCount: 3,
    expectedServices: [
      "Bathroom Remodeling",
      "Shower Area Renovation",
      "Vanity Installation",
    ],
  },
  {
    _id: new ObjectId("6ac41d5675c98ae114364612"),
    name: "Custom Furniture",
    slug: "custom-furniture",
    status: "published",
    expectedCount: 3,
    expectedServices: [
      "Custom TV Unit Design",
      "Custom Dining Furniture",
      "Built-in Furniture Design",
    ],
  },
  {
    _id: new ObjectId("6ac41ed775c98ae114364613"),
    name: "Wardrobe & Cabinet",
    slug: "wardrobe-cabinet",
    status: "published",
    expectedCount: 2,
    expectedServices: [
      "Bedroom Wardrobe Design",
      "Storage Cabinet Installation",
    ],
  },
  {
    _id: new ObjectId("6ac41fec75c98ae114364614"),
    name: "Doors, Windows & Frames",
    slug: "doors-windows-frames",
    status: "published",
    expectedCount: 2,
    expectedServices: [
      "Wooden Door Installation",
      "Window Replacement Service",
    ],
  },
  {
    _id: new ObjectId("6ac4216775c98ae114364615"),
    name: "Wooden Flooring & Decking",
    slug: "wooden-flooring-decking",
    status: "published",
    expectedCount: 2,
    expectedServices: [
      "Wooden Flooring Installation",
      "Outdoor Decking Service",
    ],
  },
  {
    _id: new ObjectId("6ac4244d75c98ae114364616"),
    name: "Painting, Wall Finishing & Interior Design",
    slug: "painting-wall-finishing-interior-design",
    status: "published",
    expectedCount: 3,
    expectedServices: [
      "Interior Painting Service",
      "Wall Panelling & Decorative Finishing",
      "False Ceiling Design & Installation",
    ],
  },
];

// Controller simulation logic
function simulateGetServices(categoryQuery?: string) {
  let queryCatId: string | null = null;

  if (categoryQuery && categoryQuery.trim()) {
    const catParam = categoryQuery.trim();
    const cat = categories.find(
      (c) =>
        c.slug === catParam ||
        c.slug === catParam.toLowerCase() ||
        c._id.toHexString() === catParam
    );

    if (!cat || cat.status === "unpublished") {
      return [];
    }

    queryCatId = cat._id.toHexString();
  }

  return (services as any[])
    .filter((s: any) => {
      if (s.status !== "published") return false;
      if (queryCatId) {
        const sCatId = s.categoryId?.$oid || s.categoryId;
        return sCatId === queryCatId;
      }
      return true;
    })
    .map((s: any) => {
      const sCatId = s.categoryId?.$oid || s.categoryId;
      const catObj = categories.find((c) => c._id.toHexString() === sCatId);
      return {
        ...s,
        category: catObj ? { _id: catObj._id, name: catObj.name, slug: catObj.slug } : undefined,
      };
    });
}

console.log("===============================================================================");
console.log("CATEGORY FILTER SIMULATION & VERIFICATION AUDIT");
console.log("===============================================================================\n");

let allPassed = true;

// Test 1: All Services (no filter)
const allServices = simulateGetServices();
console.log(`[TEST 1] No Category Filter (All Services):`);
console.log(`  -> Returned count: ${allServices.length} / Expected: 21`);
if (allServices.length !== 21) {
  console.error("  FAILED: Expected 21 services");
  allPassed = false;
} else {
  console.log("  PASSED\n");
}

// Test 2: Each of the 8 Categories by slug
console.log("[TEST 2] Testing all 8 categories by slug URL parameter (?category=<slug>):\n");

categories.forEach((cat, index) => {
  const result = simulateGetServices(cat.slug);
  const matchedTitles = result.map((r: any) => r.title);
  const countMatch = result.length === cat.expectedCount;
  const titlesMatch =
    cat.expectedServices.every((t: string) => matchedTitles.includes(t)) &&
    matchedTitles.every((t: string) => cat.expectedServices.includes(t));

  const statusStr = countMatch && titlesMatch ? "PASSED" : "FAILED";
  if (!countMatch || !titlesMatch) allPassed = false;

  console.log(`${index + 1}. Category: "${cat.name}"`);
  console.log(`   - Input Query: ?category=${cat.slug}`);
  console.log(`   - Resolved Category ID: ${cat._id.toHexString()}`);
  console.log(`   - Services Returned (${result.length}/${cat.expectedCount}):`);
  result.forEach((s: any) => console.log(`     * ${s.title} (Category attached: ${s.category?.name})`));
  console.log(`   - Status: [${statusStr}]\n`);
});

// Test 3: Non-existent category
console.log("[TEST 3] Non-existent category filter (?category=non-existent-category):");
const emptyResult = simulateGetServices("non-existent-category");
console.log(`  -> Returned count: ${emptyResult.length} / Expected: 0`);
if (emptyResult.length !== 0) {
  console.error("  FAILED: Expected 0 services");
  allPassed = false;
} else {
  console.log("  PASSED\n");
}

// Test 4: ObjectId query parameter (?category=6ac3fcbe079b63ca2b27b03f)
console.log("[TEST 4] Direct ObjectId query parameter (?category=6ac3fcbe079b63ca2b27b03f):");
const oidResult = simulateGetServices("6ac3fcbe079b63ca2b27b03f");
console.log(`  -> Returned count: ${oidResult.length} / Expected: 2`);
if (oidResult.length !== 2) {
  console.error("  FAILED: Expected 2 services");
  allPassed = false;
} else {
  console.log("  PASSED\n");
}

console.log("===============================================================================");
if (allPassed) {
  console.log("ALL 8 CATEGORY FILTER TESTS PASSED COMPLETELY WITH 100% ACCURACY!");
} else {
  console.error("SOME TESTS FAILED! Please check the output above.");
}
console.log("===============================================================================");
