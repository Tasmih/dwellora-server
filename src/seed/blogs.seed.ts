import "dotenv/config";
import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";
import { connectDatabase, getDatabase } from "../config/database.js";
import { type Blog } from "../models/blog.models.js";

interface RawExtendedJsonBlog {
  _id?: { $oid: string };
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImage?: string;
  type: "blog" | "vlog";
  videoUrl?: string;
  author: string;
  readTime: string;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    canonicalUrl: string;
  };
  status: "published" | "draft";
  createdAt?: { $date: string };
  updatedAt?: { $date: string };
}

async function seedBlogs() {
  console.log("==========================================");
  console.log("   DWELLORA: Blogs & Vlogs MongoDB Seeder ");
  console.log("==========================================\n");

  try {
    const importFilePath = path.resolve(process.cwd(), "src/seed/blogs.import.json");

    if (!fs.existsSync(importFilePath)) {
      throw new Error(`Seed import file not found at: ${importFilePath}`);
    }

    const rawData = fs.readFileSync(importFilePath, "utf8");
    const rawBlogs: RawExtendedJsonBlog[] = JSON.parse(rawData);

    console.log(`Loaded ${rawBlogs.length} articles from ${path.basename(importFilePath)}`);

    console.log("Connecting to MongoDB...");
    await connectDatabase();
    const db = getDatabase();
    const blogsColl = db.collection<Blog>("blogs");
    console.log('Connected to database collection: "blogs"\n');

    const seedSlugs = rawBlogs.map((b) => b.slug.trim());
    const deleteResult = await blogsColl.deleteMany({
      slug: { $nin: seedSlugs },
    });
    if (deleteResult.deletedCount > 0) {
      console.log(`[CLEANED] Removed ${deleteResult.deletedCount} non-seed/test records.`);
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of rawBlogs) {
      const docId = item._id?.$oid ? new ObjectId(item._id.$oid) : new ObjectId();
      const createdAt = item.createdAt?.$date
        ? new Date(item.createdAt.$date)
        : new Date();
      const updatedAt = item.updatedAt?.$date
        ? new Date(item.updatedAt.$date)
        : new Date();

      const blogDoc: Blog = {
        _id: docId,
        title: item.title.trim(),
        slug: item.slug.trim(),
        shortDescription: item.shortDescription.trim(),
        content: item.content.trim(),
        ...(item.coverImage ? { coverImage: item.coverImage.trim() } : {}),
        type: item.type,
        ...(item.videoUrl ? { videoUrl: item.videoUrl.trim() } : {}),
        author: item.author?.trim() || "Dwellora Editorial Team",
        readTime: item.readTime?.trim() || "5 min read",
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

      const existing = await blogsColl.findOne({ slug: blogDoc.slug });
      if (existing) {
        blogDoc._id = existing._id;
        await blogsColl.replaceOne(
          { slug: blogDoc.slug },
          blogDoc
        );
        console.log(`[UPDATED] "${blogDoc.title}" (slug: ${blogDoc.slug})`);
        updatedCount++;
      } else {
        await blogsColl.insertOne(blogDoc as any);
        console.log(`[INSERTED] "${blogDoc.title}" (slug: ${blogDoc.slug})`);
        insertedCount++;
      }
    }

    console.log("\n==========================================");
    console.log(`Results: ${insertedCount} inserted, ${updatedCount} updated.`);

    const totalBlogs = await blogsColl.countDocuments();
    const publishedBlogs = await blogsColl.countDocuments({ status: "published" });
    const blogCount = await blogsColl.countDocuments({ type: "blog" });
    const vlogCount = await blogsColl.countDocuments({ type: "vlog" });

    console.log(`Total records in "blogs" collection: ${totalBlogs}`);
    console.log(`Published records: ${publishedBlogs}`);
    console.log(`Editorial Blogs: ${blogCount} | Video Vlogs: ${vlogCount}`);
    console.log("Blogs seed completed successfully! 🎉");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error while seeding blogs:", error);
    process.exit(1);
  }
}

seedBlogs();
