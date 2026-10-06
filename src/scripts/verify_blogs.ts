import "dotenv/config";
import { connectDatabase, getDatabase } from "../config/database.js";
import { type Blog } from "../models/blog.models.js";

async function verifyBlogs() {
  await connectDatabase();
  const db = getDatabase();
  const blogs = await db.collection<Blog>("blogs").find({}).toArray();

  console.log("\n=======================================================");
  console.log(`Verified ${blogs.length} records in MongoDB "blogs" collection:`);
  console.log("=======================================================");

  blogs.forEach((b, i) => {
    console.log(`\n${i + 1}. ${b.title}`);
    console.log(`   Type:       ${b.type}`);
    console.log(`   CoverImage: ${b.coverImage || "[None]"}`);
    console.log(`   VideoUrl:   ${b.videoUrl || "[None]"}`);
  });

  console.log("\n=======================================================\n");
  process.exit(0);
}

verifyBlogs();
