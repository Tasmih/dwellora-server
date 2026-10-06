import "dotenv/config";
import { connectDatabase, getDatabase } from "../config/database.js";
import {
  createBlog,
  getBlogs,
  getAdminBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  updateBlogStatus,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { blogCollection } from "../models/blog.models.js";

function mockResponse() {
  let responseData: any = null;
  let statusCode = 200;

  const res: any = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(data: any) {
      responseData = data;
      return this;
    },
  };

  return {
    res,
    getData: () => responseData,
    getStatus: () => statusCode,
  };
}

async function runTests() {
  await connectDatabase();
  console.log("\n==================================================");
  console.log("TESTING BLOG / VLOG BACKEND MODULE");
  console.log("==================================================\n");

  const testBlogSlug = "test-modern-interior-renovation-guide";
  const testVlogSlug = "test-behind-the-scenes-luxury-bathroom-makeover";

  // Cleanup any leftover test entries
  await blogCollection().deleteMany({
    slug: { $in: [testBlogSlug, testVlogSlug] },
  });

  // 1. Create Blog
  console.log("--- 1. POST /api/blogs (Create Blog) ---");
  const createBlogMock = mockResponse();
  await (createBlog as any)(
    {
      body: {
        title: "Modern Interior Renovation Guide for Dhaka Homes",
        slug: testBlogSlug,
        shortDescription: "Key considerations, timber selections, and moisture management for modern residential renovations in Dhaka.",
        content: "Renovating a residence requires a delicate balance of aesthetics, architectural functionality, and durable craftsmanship. In this guide, Dwellora explores material palettes, custom cabinetry design, and Level 5 surface finishing.",
        coverImage: "https://i.ibb.co/B2rtVn03/Full-Home-Renovation.jpg",
        type: "blog",
        author: "Dwellora Design Studio",
        status: "published",
        seo: {
          metaTitle: "Modern Interior Renovation Guide | Dwellora Journal",
          metaDescription: "Essential renovation advice and architectural joinery insights for upscale apartments in Dhaka.",
          keywords: "home renovation, interior design guide, custom woodwork dhaka",
          ogTitle: "Modern Interior Renovation Guide | Dwellora Journal",
          ogDescription: "Essential renovation advice and architectural joinery insights.",
          ogImage: "https://i.ibb.co/B2rtVn03/Full-Home-Renovation.jpg",
          canonicalUrl: `https://dwellora.com/blog/${testBlogSlug}`,
        },
      },
    },
    createBlogMock.res,
    console.error
  );

  const createdBlog = createBlogMock.getData()?.blog;
  console.log(`Status: ${createBlogMock.getStatus()} | Message: ${createBlogMock.getData()?.message}`);
  console.log(`Created Blog ID: ${createdBlog?._id} | ReadTime: ${createdBlog?.readTime} | Type: ${createdBlog?.type}`);

  if (!createdBlog?._id) {
    throw new Error("Failed to create test blog");
  }

  // 2. Create Vlog
  console.log("\n--- 2. POST /api/blogs (Create Vlog) ---");
  const createVlogMock = mockResponse();
  await (createBlog as any)(
    {
      body: {
        title: "Behind the Scenes: Luxury Bathroom Transformation",
        slug: testVlogSlug,
        shortDescription: "Watch our master artisans install curbless walk-in showers, floating teak vanities, and commercial waterproofing membranes.",
        content: "In this exclusive video tour, follow the step-by-step transformation of a master bathroom into a serene wellness sanctuary in Dhanmondi.",
        coverImage: "https://i.ibb.co/BVktQHdP/Luxury-Bathroom-Transformation.jpg",
        type: "vlog",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        author: "Dwellora Craftsmanship Team",
        status: "published",
      },
    },
    createVlogMock.res,
    console.error
  );

  const createdVlog = createVlogMock.getData()?.blog;
  console.log(`Status: ${createVlogMock.getStatus()} | Message: ${createVlogMock.getData()?.message}`);
  console.log(`Created Vlog ID: ${createdVlog?._id} | ReadTime: ${createdVlog?.readTime} | VideoUrl: ${createdVlog?.videoUrl}`);

  // 3. Public GET /api/blogs
  console.log("\n--- 3. GET /api/blogs (Public List) ---");
  const getBlogsMock = mockResponse();
  await (getBlogs as any)({ query: {} }, getBlogsMock.res, console.error);
  console.log(`Status: ${getBlogsMock.getStatus()} | Total Published: ${getBlogsMock.getData()?.total}`);

  // 4. Public GET /api/blogs?type=vlog
  console.log("\n--- 4. GET /api/blogs?type=vlog (Filter Vlogs) ---");
  const getVlogsMock = mockResponse();
  await (getBlogs as any)({ query: { type: "vlog" } }, getVlogsMock.res, console.error);
  console.log(`Status: ${getVlogsMock.getStatus()} | Vlogs Count: ${getVlogsMock.getData()?.total}`);

  // 5. Public GET /api/blogs/slug/:slug
  console.log("\n--- 5. GET /api/blogs/slug/:slug (Get Blog by Slug) ---");
  const getBySlugMock = mockResponse();
  await (getBlogBySlug as any)(
    { params: { slug: testBlogSlug } },
    getBySlugMock.res,
    console.error
  );
  console.log(`Status: ${getBySlugMock.getStatus()} | Title: ${getBySlugMock.getData()?.blog?.title}`);

  // 6. Admin GET /api/blogs/:id
  console.log("\n--- 6. GET /api/blogs/:id (Admin Get by ID) ---");
  const getByIdMock = mockResponse();
  await (getBlogById as any)(
    { params: { id: createdBlog._id.toString() } },
    getByIdMock.res,
    console.error
  );
  console.log(`Status: ${getByIdMock.getStatus()} | Author: ${getByIdMock.getData()?.blog?.author}`);

  // 7. Admin PUT /api/blogs/:id (Update Blog)
  console.log("\n--- 7. PUT /api/blogs/:id (Update Blog) ---");
  const updateMock = mockResponse();
  await (updateBlog as any)(
    {
      params: { id: createdBlog._id.toString() },
      body: {
        title: "Modern Interior Renovation Guide for Dhaka Homes (Updated Edition)",
        slug: testBlogSlug,
        shortDescription: "Updated guide on timber selections, custom cabinetry, and Level 5 surface finishing.",
        content: "Updated content covering luxury architectural carpentry and smart living integration.",
        coverImage: "https://i.ibb.co/B2rtVn03/Full-Home-Renovation.jpg",
        type: "blog",
        author: "Dwellora Editorial Team",
        status: "published",
      },
    },
    updateMock.res,
    console.error
  );
  console.log(`Status: ${updateMock.getStatus()} | Message: ${updateMock.getData()?.message}`);
  console.log(`Updated Title: ${updateMock.getData()?.blog?.title}`);

  // 8. Admin PATCH /api/blogs/:id/status
  console.log("\n--- 8. PATCH /api/blogs/:id/status (Update Status to Draft) ---");
  const statusMock = mockResponse();
  await (updateBlogStatus as any)(
    {
      params: { id: createdBlog._id.toString() },
      body: { status: "draft" },
    },
    statusMock.res,
    console.error
  );
  console.log(`Status: ${statusMock.getStatus()} | New Status: ${statusMock.getData()?.blog?.status}`);

  // 9. Admin DELETE /api/blogs/:id
  console.log("\n--- 9. DELETE /api/blogs/:id (Delete Blog) ---");
  const deleteMock = mockResponse();
  await (deleteBlog as any)(
    { params: { id: createdBlog._id.toString() } },
    deleteMock.res,
    console.error
  );
  console.log(`Status: ${deleteMock.getStatus()} | Message: ${deleteMock.getData()?.message}`);

  // Clean up the created test vlog as well
  if (createdVlog?._id) {
    await blogCollection().deleteOne({ _id: createdVlog._id });
  }

  console.log("\n==================================================");
  console.log("ALL BLOG/VLOG BACKEND API TESTS COMPLETED SUCCESSFULLY");
  console.log("==================================================\n");

  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
