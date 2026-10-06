import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";

import {
  blogCollection,
  type Blog,
  type BlogType,
  type BlogStatus,
  type SeoSettings,
} from "../models/blog.models.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getParamString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value) && typeof value[0] === "string") return value[0].trim();
  return "";
}

function sanitizeUrl(value: string, fieldName = "URL"): string {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error(`${fieldName} must be a valid HTTP or HTTPS URL.`);
    }
    if (url.hostname.endsWith(".")) {
      url.hostname = url.hostname.replace(/\.+$/, "");
    }
    return url.toString();
  } catch {
    throw new Error(`${fieldName} must be a valid HTTP or HTTPS URL.`);
  }
}

function calculateReadTime(content: string, type: BlogType): string {
  if (type === "vlog") {
    return "Video";
  }
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function readBlogInput(body: unknown) {
  if (!isObject(body)) {
    throw new Error("Invalid blog data.");
  }

  const requiredText = (field: string) => {
    const value = body[field];
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${field} is required.`);
    }
    return value.trim();
  };

  const optionalText = (field: string) => {
    const value = body[field];
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") {
      throw new Error(`${field} must be text.`);
    }
    return value.trim();
  };

  const title = requiredText("title");
  const slug = requiredText("slug");
  const content = requiredText("content");

  // Cover image with fallback to image property
  const rawCoverImage =
    typeof body.coverImage === "string" && body.coverImage.trim()
      ? body.coverImage.trim()
      : typeof body.image === "string" && body.image.trim()
        ? body.image.trim()
        : "";

  if (!rawCoverImage) {
    throw new Error("coverImage is required.");
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "Slug must contain lowercase English letters, numbers and single hyphens."
    );
  }

  const coverImage = sanitizeUrl(rawCoverImage, "coverImage");

  // Type: blog | vlog
  const rawType = optionalText("type");
  let type: BlogType = "blog";
  if (rawType) {
    if (rawType !== "blog" && rawType !== "vlog") {
      throw new Error("type must be either 'blog' or 'vlog'.");
    }
    type = rawType;
  }

  // Optional video URL (relevant especially for vlogs)
  const rawVideoUrl = optionalText("videoUrl");
  const videoUrl = rawVideoUrl ? sanitizeUrl(rawVideoUrl, "videoUrl") : undefined;

  let shortDescription = optionalText("shortDescription");
  if (!shortDescription) {
    shortDescription = content.slice(0, 160).trim();
  }

  const author = optionalText("author") || "Dwellora Editorial Team";
  const customReadTime = optionalText("readTime");
  const readTime = customReadTime || calculateReadTime(content, type);

  // Status: published | draft
  const rawStatus = optionalText("status");
  let status: BlogStatus = "published";
  if (rawStatus) {
    if (rawStatus !== "published" && rawStatus !== "draft") {
      throw new Error("status must be either 'published' or 'draft'.");
    }
    status = rawStatus;
  }

  // SEO Settings
  let seo: SeoSettings | undefined = undefined;
  if (body.seo !== undefined && body.seo !== null) {
    if (!isObject(body.seo)) {
      throw new Error("seo must be an object.");
    }

    const rawSeo = body.seo;
    const metaTitle =
      typeof rawSeo.metaTitle === "string" && rawSeo.metaTitle.trim()
        ? rawSeo.metaTitle.trim()
        : `${title} | Dwellora Journal`;

    const metaDescription =
      typeof rawSeo.metaDescription === "string" && rawSeo.metaDescription.trim()
        ? rawSeo.metaDescription.trim()
        : shortDescription;

    const keywords =
      typeof rawSeo.keywords === "string" ? rawSeo.keywords.trim() : "";

    const ogTitle =
      typeof rawSeo.ogTitle === "string" && rawSeo.ogTitle.trim()
        ? rawSeo.ogTitle.trim()
        : metaTitle;

    const ogDescription =
      typeof rawSeo.ogDescription === "string" && rawSeo.ogDescription.trim()
        ? rawSeo.ogDescription.trim()
        : metaDescription;

    const ogImage =
      typeof rawSeo.ogImage === "string" && rawSeo.ogImage.trim()
        ? sanitizeUrl(rawSeo.ogImage, "ogImage")
        : coverImage;

    const canonicalUrl =
      typeof rawSeo.canonicalUrl === "string" && rawSeo.canonicalUrl.trim()
        ? sanitizeUrl(rawSeo.canonicalUrl, "canonicalUrl")
        : `https://dwellora.com/blog/${slug}`;

    seo = {
      metaTitle,
      metaDescription,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      canonicalUrl,
    };
  } else {
    // Default SEO generated from article fields
    seo = {
      metaTitle: `${title} | Dwellora Journal`,
      metaDescription: shortDescription,
      keywords: "home renovation, bespoke carpentry, architectural design, interior inspiration",
      ogTitle: `${title} | Dwellora Journal`,
      ogDescription: shortDescription,
      ogImage: coverImage,
      canonicalUrl: `https://dwellora.com/blog/${slug}`,
    };
  }

  return {
    title,
    slug,
    shortDescription,
    content,
    coverImage,
    type,
    videoUrl,
    author,
    readTime,
    seo,
    status,
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Invalid blog data.";
}

// Public: Get all published blogs/vlogs with optional filtering
export const getBlogs: RequestHandler = async (req, res, next) => {
  try {
    const { type, search } = req.query;

    const matchQuery: Record<string, unknown> = {
      status: "published",
    };

    if (type === "blog" || type === "vlog") {
      matchQuery.type = type;
    }

    if (typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      matchQuery.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
      ];
    }

    const blogs = await blogCollection()
      .find(matchQuery)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      blogs,
      total: blogs.length,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get single published blog/vlog by slug
export const getBlogBySlug: RequestHandler = async (req, res, next) => {
  try {
    const slug = getParamString(req.params.slug);

    if (!slug) {
      res.status(400).json({
        success: false,
        message: "Invalid slug",
      });
      return;
    }

    const blog = await blogCollection().findOne({
      slug,
      status: "published",
    });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all blogs/vlogs (published and draft)
export const getAdminBlogs: RequestHandler = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const query: Record<string, unknown> = {};

    if (type === "blog" || type === "vlog") {
      query.type = type;
    }

    if (status === "published" || status === "draft") {
      query.status = status;
    }

    const blogs = await blogCollection()
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      blogs,
      total: blogs.length,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get single blog/vlog by ID
export const getBlogById: RequestHandler = async (req, res, next) => {
  try {
    const id = getParamString(req.params.id);

    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    const blog = await blogCollection().findOne({
      _id: new ObjectId(id),
    });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create new blog/vlog
export const createBlog: RequestHandler = async (req, res, next) => {
  try {
    let input: ReturnType<typeof readBlogInput>;

    try {
      input = readBlogInput(req.body);
    } catch (validationError) {
      res.status(400).json({
        success: false,
        message: errorMessage(validationError),
      });
      return;
    }

    // Check slug uniqueness
    const existing = await blogCollection().findOne({ slug: input.slug });
    if (existing) {
      res.status(409).json({
        success: false,
        message: "A blog post with this slug already exists.",
      });
      return;
    }

    const now = new Date();
    const newBlog: Blog = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    const result = await blogCollection().insertOne(newBlog);
    const createdBlog = await blogCollection().findOne({
      _id: result.insertedId,
    });

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      blog: createdBlog,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update blog/vlog
export const updateBlog: RequestHandler = async (req, res, next) => {
  try {
    const id = getParamString(req.params.id);

    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    let input: ReturnType<typeof readBlogInput>;
    try {
      input = readBlogInput(req.body);
    } catch (validationError) {
      res.status(400).json({
        success: false,
        message: errorMessage(validationError),
      });
      return;
    }

    // Ensure slug is unique excluding this document
    const duplicateSlug = await blogCollection().findOne({
      _id: { $ne: new ObjectId(id) },
      slug: input.slug,
    });

    if (duplicateSlug) {
      res.status(409).json({
        success: false,
        message: "A blog post with this slug already exists.",
      });
      return;
    }

    const updateDoc = {
      ...input,
      updatedAt: new Date(),
    };

    const updateResult = await blogCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
      return;
    }

    const updatedBlog = await blogCollection().findOne({
      _id: new ObjectId(id),
    });

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update blog status (published | draft)
export const updateBlogStatus: RequestHandler = async (req, res, next) => {
  try {
    const id = getParamString(req.params.id);

    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    const status = req.body?.status;
    if (status !== "published" && status !== "draft") {
      res.status(400).json({
        success: false,
        message: "Status must be either 'published' or 'draft'.",
      });
      return;
    }

    const result = await blogCollection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
      return;
    }

    const updatedBlog = await blogCollection().findOne({
      _id: new ObjectId(id),
    });

    res.status(200).json({
      success: true,
      message: "Blog status updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete blog/vlog
export const deleteBlog: RequestHandler = async (req, res, next) => {
  try {
    const id = getParamString(req.params.id);

    if (!id || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
      return;
    }

    const result = await blogCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
