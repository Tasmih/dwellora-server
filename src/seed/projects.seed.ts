import "dotenv/config";
import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";
import { connectDatabase, getDatabase } from "../config/database.js";
import { type Project } from "../models/project.models.js";

interface RawExtendedJsonProject {
  _id?: { $oid: string };
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  gallery?: string[];
  categoryId?: { $oid: string };
  location?: string;
  client?: string;
  year?: string;
  features?: { title: string; description: string }[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    canonicalUrl: string;
  };
  status: "published" | "unpublished";
  createdAt?: { $date: string };
  updatedAt?: { $date: string };
}

async function seedProjects() {
  console.log("==========================================");
  console.log("   DWELLORA: Projects MongoDB Seeder      ");
  console.log("==========================================\n");

  try {
    const importFilePath = path.resolve(process.cwd(), "src/seed/projects.import.json");

    if (!fs.existsSync(importFilePath)) {
      throw new Error(`Seed import file not found at: ${importFilePath}`);
    }

    const rawData = fs.readFileSync(importFilePath, "utf8");
    const rawProjects: RawExtendedJsonProject[] = JSON.parse(rawData);

    console.log(`Loaded ${rawProjects.length} projects from ${path.basename(importFilePath)}`);

    console.log("Connecting to MongoDB...");
    await connectDatabase();
    const db = getDatabase();
    const projectsColl = db.collection<Project>("projects");
    console.log('Connected to database collection: "projects"\n');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of rawProjects) {
      // 1. Prevent duplicate insertion using slug
      const existing = await projectsColl.findOne({ slug: item.slug.trim() });
      if (existing) {
        console.log(`[SKIPPED] Project slug "${item.slug}" already exists in database.`);
        skippedCount++;
        continue;
      }

      // 2. Prepare ObjectId and dates
      const docId = item._id?.$oid ? new ObjectId(item._id.$oid) : new ObjectId();
      const categoryId = item.categoryId?.$oid
        ? new ObjectId(item.categoryId.$oid)
        : undefined;
      const createdAt = item.createdAt?.$date
        ? new Date(item.createdAt.$date)
        : new Date();
      const updatedAt = item.updatedAt?.$date
        ? new Date(item.updatedAt.$date)
        : new Date();

      // 3. Construct document
      const projectDoc: Project = {
        _id: docId,
        title: item.title.trim(),
        slug: item.slug.trim(),
        shortDescription: item.shortDescription.trim(),
        description: item.description.trim(),
        coverImage: item.coverImage.trim(),
        gallery: item.gallery || [],
        ...(categoryId ? { categoryId } : {}),
        location: item.location?.trim() || "",
        client: item.client?.trim() || "",
        year: item.year?.trim() || "",
        features: (item.features || []).map((f) => ({
          title: f.title.trim(),
          description: f.description.trim(),
        })),
        seo: item.seo
          ? {
              metaTitle: item.seo.metaTitle.trim(),
              metaDescription: item.seo.metaDescription.trim(),
              keywords: item.seo.keywords.trim(),
              ogTitle: item.seo.ogTitle.trim(),
              ogDescription: item.seo.ogDescription.trim(),
              ogImage: item.seo.ogImage.trim(),
              canonicalUrl: item.seo.canonicalUrl.trim(),
            }
          : undefined,
        status: item.status || "published",
        createdAt,
        updatedAt,
      };

      await projectsColl.insertOne(projectDoc as any);
      console.log(`[INSERTED] "${projectDoc.title}" (slug: ${projectDoc.slug})`);
      insertedCount++;
    }

    console.log("\n==========================================");
    console.log(`Results: ${insertedCount} inserted, ${skippedCount} skipped.`);

    // 4. Verification queries
    const totalProjects = await projectsColl.countDocuments();
    const publishedProjects = await projectsColl.countDocuments({ status: "published" });
    console.log(`Total projects in collection: ${totalProjects}`);
    console.log(`Published projects: ${publishedProjects}`);
    console.log("Projects seed completed successfully! 🎉");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error while seeding projects:", error);
    process.exit(1);
  }
}

seedProjects();
