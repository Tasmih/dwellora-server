import fs from "fs";
import path from "path";

const jsonPath = path.resolve(process.cwd(), "src/seed/services.import.json");
const rawData = fs.readFileSync(jsonPath, "utf-8");
let services: any[];

try {
  services = JSON.parse(rawData);
} catch (e: any) {
  console.error("JSON parsing error:", e.message);
  process.exit(1);
}

console.log("Total services parsed:", services.length);

const expectedCategories: Record<string, { name: string; services: { title: string; image: string }[] }> = {
  "6ac3fcbe079b63ca2b27b03f": {
    name: "Full Home Renovation",
    services: [
      { title: "Complete Home Renovation", image: "https://i.ibb.co/k63Kv661/complete-home-renovation.jpg" },
      { title: "Interior Home Remodeling", image: "https://i.ibb.co/whSqNGYp/Interior-Home-Remodeling.jpg" },
    ],
  },
  "6ac40c35079b63ca2b27b040": {
    name: "Kitchen Renovation",
    services: [
      { title: "Kitchen Cabinet Renovation", image: "https://i.ibb.co/TDh3k91h/Kitchen-Cabinet-Renovation.jpg" },
      { title: "Kitchen Counter Renovation", image: "https://i.ibb.co/twG36fNG/Kitchen-Counter-Renovation.jpg" },
      { title: "Kitchen Hood Renovation", image: "https://i.ibb.co/YByqgqvB/Kitchen-Hood-Renovation.jpg" },
      { title: "Full Kitchen Renovation", image: "https://i.ibb.co/ymwwG0L8/Full-Kitchen-Renovation.jpg" },
    ],
  },
  "6ac4112c079b63ca2b27b041": {
    name: "Bathroom Renovation",
    services: [
      { title: "Bathroom Remodeling", image: "https://i.ibb.co/spYMRrrp/Bathroom-Remodeling.jpg" },
      { title: "Shower Area Renovation", image: "https://i.ibb.co/PZkjRW0g/Shower-Area-Renovation.jpg" },
      { title: "Vanity Installation", image: "https://i.ibb.co/ZnPTLtK/Vanity-Installation.jpg" },
    ],
  },
  "6ac41d5675c98ae114364612": {
    name: "Custom Furniture",
    services: [
      { title: "Custom TV Unit Design", image: "https://i.ibb.co/Y74tjCTf/Custom-TV-Unit-Design.jpg" },
      { title: "Custom Dining Furniture", image: "https://i.ibb.co/KptZshgT/Custom-Dining-Furniture.jpg" },
      { title: "Built-in Furniture Design", image: "https://i.ibb.co/s9r8NRVJ/Built-in-Furniture-Design.jpg" },
    ],
  },
  "6ac41ed775c98ae114364613": {
    name: "Wardrobe & Cabinet",
    services: [
      { title: "Bedroom Wardrobe Design", image: "https://i.ibb.co/WW2hYLSN/Bedroom-Wardrobe-Design.jpg" },
      { title: "Storage Cabinet Installation", image: "https://i.ibb.co/3yBcSPtY/Storage-Cabinet-Installation.jpg" },
    ],
  },
  "6ac41fec75c98ae114364614": {
    name: "Doors, Windows & Frames",
    services: [
      { title: "Wooden Door Installation", image: "https://i.ibb.co/VcpnhWP9/Wooden-Door-Installation.jpg" },
      { title: "Window Replacement Service", image: "https://i.ibb.co/wrxF25GV/Window-Replacement-Service.jpg" },
    ],
  },
  "6ac4216775c98ae114364615": {
    name: "Wooden Flooring & Decking",
    services: [
      { title: "Wooden Flooring Installation", image: "https://i.ibb.co/60dkZ7cD/Wooden-Flooring-Installation.jpg" },
      { title: "Outdoor Decking Service", image: "https://i.ibb.co/G3fDxnxq/Outdoor-Decking-Service.jpg" },
    ],
  },
  "6ac4244d75c98ae114364616": {
    name: "Painting, Wall Finishing & Interior Design",
    services: [
      { title: "Interior Painting Service", image: "https://i.ibb.co/DP8jg7yf/Interior-Painting-Service.jpg" },
      { title: "Wall Panelling & Decorative Finishing", image: "https://i.ibb.co/gLnXc40W/Wall-Panelling-Decorative-Finishing.jpg" },
      { title: "False Ceiling Design & Installation", image: "https://i.ibb.co/LD9Bf2ny/False-Ceiling-Design-Installation.jpg" },
    ],
  },
};

const errors: string[] = [];
const wordCounts: { title: string; count: number }[] = [];

if (services.length !== 21) {
  errors.push(`Expected 21 services, found: ${services.length}`);
}

const seenIds = new Set<string>();
const seenSlugs = new Set<string>();
const seenImages = new Set<string>();
const seenTitles = new Set<string>();

const allExpectedServices = Object.entries(expectedCategories).flatMap(([catId, cat]) =>
  cat.services.map((s) => ({ ...s, categoryId: catId, categoryName: cat.name }))
);

services.forEach((doc: any, idx: number) => {
  const indexStr = `Service #${idx + 1} ("${doc.title || "unnamed"}")`;

  const requiredFields = [
    "_id",
    "title",
    "slug",
    "shortDescription",
    "description",
    "image",
    "includedItems",
    "seo",
    "categoryId",
    "status",
    "createdAt",
    "updatedAt",
  ];
  for (const field of requiredFields) {
    if (doc[field] === undefined || doc[field] === null || doc[field] === "") {
      errors.push(`${indexStr} missing required field: ${field}`);
    }
  }

  if (!doc._id || typeof doc._id.$oid !== "string" || !/^[0-9a-fA-F]{24}$/.test(doc._id.$oid)) {
    errors.push(`${indexStr} invalid _id format: ${JSON.stringify(doc._id)}`);
  } else {
    if (seenIds.has(doc._id.$oid)) errors.push(`${indexStr} duplicate _id: ${doc._id.$oid}`);
    seenIds.add(doc._id.$oid);
  }

  if (!doc.categoryId || typeof doc.categoryId.$oid !== "string" || !/^[0-9a-fA-F]{24}$/.test(doc.categoryId.$oid)) {
    errors.push(`${indexStr} invalid categoryId format: ${JSON.stringify(doc.categoryId)}`);
  }

  if (!doc.createdAt || typeof doc.createdAt.$date !== "string" || isNaN(Date.parse(doc.createdAt.$date))) {
    errors.push(`${indexStr} invalid createdAt: ${JSON.stringify(doc.createdAt)}`);
  }
  if (!doc.updatedAt || typeof doc.updatedAt.$date !== "string" || isNaN(Date.parse(doc.updatedAt.$date))) {
    errors.push(`${indexStr} invalid updatedAt: ${JSON.stringify(doc.updatedAt)}`);
  }

  if (doc.status !== "published" && doc.status !== "unpublished") {
    errors.push(`${indexStr} invalid status: ${doc.status}`);
  }

  if (!doc.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(doc.slug)) {
    errors.push(`${indexStr} invalid slug: ${doc.slug}`);
  } else {
    if (seenSlugs.has(doc.slug)) errors.push(`${indexStr} duplicate slug: ${doc.slug}`);
    seenSlugs.add(doc.slug);
  }

  if (!doc.image || !doc.image.startsWith("https://i.ibb.co/")) {
    errors.push(`${indexStr} image not in https://i.ibb.co/ format: ${doc.image}`);
  } else {
    if (seenImages.has(doc.image)) errors.push(`${indexStr} duplicate image: ${doc.image}`);
    seenImages.add(doc.image);
  }

  if (!Array.isArray(doc.includedItems) || doc.includedItems.length !== 3) {
    errors.push(`${indexStr} includedItems must be array of 3 items, found: ${doc.includedItems?.length}`);
  } else {
    doc.includedItems.forEach((item: any, itemIdx: number) => {
      if (!item.title || !item.title.trim()) errors.push(`${indexStr} includedItem[${itemIdx}] missing title`);
      if (!item.description || !item.description.trim()) errors.push(`${indexStr} includedItem[${itemIdx}] missing description`);
    });
  }

  const words = (doc.description || "").trim().split(/\s+/).filter(Boolean).length;
  wordCounts.push({ title: doc.title, count: words });

  const seo = doc.seo;
  if (!seo || typeof seo !== "object") {
    errors.push(`${indexStr} missing or invalid seo object`);
  } else {
    const seoFields = ["metaTitle", "metaDescription", "keywords", "ogTitle", "ogDescription", "ogImage", "canonicalUrl"];
    for (const sf of seoFields) {
      if (!seo[sf] || typeof seo[sf] !== "string" || !seo[sf].trim()) {
        errors.push(`${indexStr} seo missing field: ${sf}`);
      }
    }
  }

  seenTitles.add(doc.title);
});

allExpectedServices.forEach((exp) => {
  const match = services.find((s) => s.title === exp.title);
  if (!match) {
    errors.push(`Missing expected service title: "${exp.title}"`);
  } else {
    if (match.categoryId?.$oid !== exp.categoryId) {
      errors.push(`Category ID mismatch for "${exp.title}": expected ${exp.categoryId}, got ${match.categoryId?.$oid}`);
    }
    if (match.image !== exp.image) {
      errors.push(`Image URL mismatch for "${exp.title}": expected ${exp.image}, got ${match.image}`);
    }
  }
});

console.log("\n==========================================");
console.log("AUDIT REPORT SUMMARY");
console.log("==========================================");
console.log("Total Services Checked:", services.length);
console.log("Total Errors Found:", errors.length);
if (errors.length > 0) {
  console.log("\nErrors Found:");
  errors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
} else {
  console.log("All structural, data, category, image, and content checks PASSED perfectly with 0 errors!");
}

console.log("\nWord Counts for Descriptions (target 80-150 words):");
wordCounts.forEach((w) => {
  const status = w.count >= 80 && w.count <= 150 ? "OK" : "CHECK";
  console.log(`- ${w.title}: ${w.count} words [${status}]`);
});
