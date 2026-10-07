import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";

import {
  projectCollection,
  type SeoSettings,
  type ProjectFeature,
} from "../models/project.models.js";
import {
  categoryCollection,
  type ServiceCategory,
} from "../models/category.models.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

function readProjectInput(body: unknown) {
  if (!isObject(body)) {
    throw new Error("Invalid project data.");
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
  const description = requiredText("description");

  // Support coverImage (with fallback to image)
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

  let shortDescription = optionalText("shortDescription");
  if (!shortDescription) {
    shortDescription = description.slice(0, 160).trim();
  }

  const client = optionalText("client");
  const location = optionalText("location");
  const year = optionalText("year");

  let gallery: string[] = [];
  if (body.gallery !== undefined) {
    if (!Array.isArray(body.gallery)) {
      throw new Error("gallery must be an array of image URLs.");
    }
    gallery = body.gallery
      .filter((urlItem) => typeof urlItem === "string" && urlItem.trim().length > 0)
      .map((urlItem, index) =>
        sanitizeUrl(urlItem as string, `Gallery image at index ${index}`)
      );
  }

  let features: ProjectFeature[] = [];
  if (body.features !== undefined) {
    if (!Array.isArray(body.features)) {
      throw new Error("features must be an array.");
    }
    features = body.features.map((item, index) => {
      if (!isObject(item)) {
        throw new Error(`Feature at index ${index} must be an object.`);
      }
      if (typeof item.title !== "string" || !item.title.trim()) {
        throw new Error(`Feature at index ${index} must have a non-blank title.`);
      }
      const itemDescription =
        item.description !== undefined ? String(item.description).trim() : "";
      return {
        title: item.title.trim(),
        description: itemDescription,
      };
    });
  }

  let categoryId: ObjectId | null | undefined;
  if (body.categoryId !== undefined) {
    if (body.categoryId === null || body.categoryId === "") {
      categoryId = null;
    } else if (
      typeof body.categoryId === "string" &&
      ObjectId.isValid(body.categoryId)
    ) {
      categoryId = new ObjectId(body.categoryId);
    } else {
      throw new Error("Invalid categoryId format.");
    }
  }

  let seo: SeoSettings | undefined;
  if (body.seo !== undefined) {
    if (!isObject(body.seo)) {
      throw new Error("Invalid SEO settings.");
    }

    const inputSeo = body.seo;

    const readSeoText = (field: string) => {
      const value = inputSeo[field];
      if (value === undefined) return "";
      if (typeof value !== "string") {
        throw new Error(`${field} must be text.`);
      }
      return value.trim();
    };

    const ogImageRaw = readSeoText("ogImage");
    const canonicalUrlRaw = readSeoText("canonicalUrl");

    seo = {
      metaTitle: readSeoText("metaTitle"),
      metaDescription: readSeoText("metaDescription"),
      keywords: readSeoText("keywords"),
      ogTitle: readSeoText("ogTitle"),
      ogDescription: readSeoText("ogDescription"),
      ogImage: ogImageRaw ? sanitizeUrl(ogImageRaw, "Open Graph image") : "",
      canonicalUrl: canonicalUrlRaw
        ? sanitizeUrl(canonicalUrlRaw, "Canonical URL")
        : "",
    };
  }

  return {
    title,
    slug,
    shortDescription,
    description,
    coverImage,
    gallery,
    features,
    ...(client !== undefined ? { client } : {}),
    ...(location !== undefined ? { location } : {}),
    ...(year !== undefined ? { year } : {}),
    ...(categoryId !== undefined ? { categoryId } : {}),
    ...(seo !== undefined ? { seo } : {}),
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Invalid project data.";
}

// Helper to find category document
async function findCategoryDoc(
  query: Record<string, unknown>
): Promise<ServiceCategory | null> {
  return categoryCollection().findOne(query);
}

// Helper to find multiple category documents
async function findCategoryDocs(
  query: Record<string, unknown>
): Promise<ServiceCategory[]> {
  return categoryCollection().find(query).toArray();
}

// Admin: Create project
export const createProject: RequestHandler = async (req, res, next) => {
  try {
    let input;

    try {
      input = readProjectInput(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: errorMessage(error),
      });
      return;
    }

    const existing = await projectCollection().findOne({
      slug: input.slug,
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: "This slug is already used. Please choose another.",
      });
      return;
    }

    if (input.categoryId) {
      const cat = await categoryCollection().findOne({ _id: input.categoryId });
      if (!cat) {
        res.status(400).json({
          success: false,
          message: "Selected category does not exist.",
        });
        return;
      }
    }

    const now = new Date();

    const result = await projectCollection().insertOne({
      title: input.title,
      slug: input.slug,
      shortDescription: input.shortDescription,
      description: input.description,
      coverImage: input.coverImage,
      gallery: input.gallery,
      client: input.client || "",
      location: input.location || "",
      year: input.year || "",
      features: input.features,
      ...(input.seo ? { seo: input.seo } : {}),
      ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      status: "published",
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      id: result.insertedId,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get published projects (filter by category slug or ID)
export const getProjects: RequestHandler = async (req, res, next) => {
  try {
    const categoryQuery =
      req.query.category || req.query.categorySlug || req.query.categoryId;
    const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
    const limit =
      limitParam && Number.isInteger(limitParam) && limitParam > 0
        ? Math.min(limitParam, 100)
        : undefined;

    // Filter by specific category
    if (typeof categoryQuery === "string" && categoryQuery.trim()) {
      const catParam = categoryQuery.trim();
      const isOid = ObjectId.isValid(catParam) && catParam.length === 24;

      const cat = await findCategoryDoc({
        $or: [
          { slug: catParam },
          { slug: catParam.toLowerCase() },
          ...(isOid ? [{ _id: new ObjectId(catParam) }] : []),
        ],
      });

      if (!cat || cat.status === "unpublished") {
        res.status(200).json({
          success: true,
          projects: [],
        });
        return;
      }

      const targetCatId =
        cat._id instanceof ObjectId ? cat._id : new ObjectId(cat._id);

      const projectQuery = {
        status: "published" as const,
        $or: [
          { categoryId: targetCatId },
          { categoryId: targetCatId.toHexString() as unknown as ObjectId },
        ],
      };

      let cursor = projectCollection()
        .find(projectQuery)
        .sort({ createdAt: -1 });

      if (limit) {
        cursor = cursor.limit(limit);
      }

      const projects = await cursor.toArray();

      const enrichedProjects = projects.map((p) => ({
        ...p,
        category: {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
        },
      }));

      res.status(200).json({
        success: true,
        projects: enrichedProjects,
      });
      return;
    }

    // Default: fetch published categories and projects in parallel
    const [publishedCats, allProjects] = await Promise.all([
      findCategoryDocs({ status: { $ne: "unpublished" } }),
      (async () => {
        let cursor = projectCollection()
          .find({ status: "published" })
          .sort({ createdAt: -1 });
        if (limit) {
          cursor = cursor.limit(limit);
        }
        return cursor.toArray();
      })(),
    ]);

    const categoryMap = new Map(
      publishedCats
        .filter((c) => Boolean(c._id))
        .map((c) => [
          c._id!.toString(),
          { _id: c._id!, name: c.name, slug: c.slug },
        ])
    );

    const enrichedProjects = allProjects
      .filter((p) => {
        if (!p.categoryId) return true;
        const catKey =
          p.categoryId instanceof ObjectId
            ? p.categoryId.toHexString()
            : String(p.categoryId);
        return categoryMap.has(catKey);
      })
      .map((p) => {
        const catKey = p.categoryId
          ? p.categoryId instanceof ObjectId
            ? p.categoryId.toHexString()
            : String(p.categoryId)
          : undefined;

        return {
          ...p,
          category: catKey ? categoryMap.get(catKey) : undefined,
        };
      });

    res.status(200).json({
      success: true,
      projects: enrichedProjects,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all projects with category details (optionally filter by category)
export const getAdminProjects: RequestHandler = async (req, res, next) => {
  try {
    const categoryQuery =
      req.query.category || req.query.categorySlug || req.query.categoryId;
    let query: Record<string, unknown> = {};

    if (typeof categoryQuery === "string" && categoryQuery.trim()) {
      const catParam = categoryQuery.trim();
      const isOid = ObjectId.isValid(catParam) && catParam.length === 24;

      const cat = await findCategoryDoc({
        $or: [
          { slug: catParam },
          { slug: catParam.toLowerCase() },
          ...(isOid ? [{ _id: new ObjectId(catParam) }] : []),
        ],
      });

      if (cat) {
        const targetCatId =
          cat._id instanceof ObjectId ? cat._id : new ObjectId(cat._id);
        query = {
          $or: [
            { categoryId: targetCatId },
            { categoryId: targetCatId.toHexString() },
          ],
        };
      } else if (isOid) {
        query = {
          $or: [
            { categoryId: new ObjectId(catParam) },
            { categoryId: catParam },
          ],
        };
      } else {
        res.status(200).json({
          success: true,
          projects: [],
        });
        return;
      }
    }

    const projects = await projectCollection()
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const categoryIds = projects
      .map((p) => {
        if (!p.categoryId) return null;
        return ObjectId.isValid(p.categoryId)
          ? new ObjectId(p.categoryId)
          : null;
      })
      .filter((id): id is ObjectId => Boolean(id));

    const categories =
      categoryIds.length > 0
        ? await findCategoryDocs({ _id: { $in: categoryIds } })
        : [];

    const categoryMap = new Map(
      categories
        .filter((c) => Boolean(c._id))
        .map((c) => [
          c._id!.toHexString(),
          { _id: c._id!, name: c.name, slug: c.slug, status: c.status },
        ])
    );

    const enrichedProjects = projects.map((p) => {
      const catKey = p.categoryId
        ? typeof p.categoryId === "string"
          ? p.categoryId
          : p.categoryId.toHexString()
        : undefined;

      return {
        ...p,
        category: catKey ? categoryMap.get(catKey) : undefined,
      };
    });

    res.status(200).json({
      success: true,
      projects: enrichedProjects,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get project by ID
export const getProjectById: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid project id",
      });
      return;
    }

    const project = await projectCollection().findOne({
      _id: new ObjectId(id),
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    let category;
    if (project.categoryId) {
      const targetCatId =
        ObjectId.isValid(project.categoryId)
          ? new ObjectId(project.categoryId)
          : project.categoryId;

      const cat = await findCategoryDoc({
        _id: targetCatId,
      });

      if (cat) {
        category = {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          status: cat.status,
        };
      }
    }

    res.status(200).json({
      success: true,
      project: {
        ...project,
        ...(category ? { category } : {}),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get project by slug (hidden if assigned to unpublished category)
export const getProjectBySlug: RequestHandler = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string" || !slug) {
      res.status(400).json({
        success: false,
        message: "Invalid slug",
      });
      return;
    }

    const project = await projectCollection().findOne({
      slug,
      status: "published",
    });

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    let category;
    if (project.categoryId) {
      const targetCatId =
        ObjectId.isValid(project.categoryId)
          ? new ObjectId(project.categoryId)
          : project.categoryId;

      const cat = await findCategoryDoc({
        _id: targetCatId,
        status: { $ne: "unpublished" },
      });

      if (!cat) {
        res.status(404).json({
          success: false,
          message: "Project not found",
        });
        return;
      }

      category = {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
      };
    }

    res.status(200).json({
      success: true,
      project: {
        ...project,
        ...(category ? { category } : {}),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update project
export const updateProject: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid project id",
      });
      return;
    }

    let input;

    try {
      input = readProjectInput(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: errorMessage(error),
      });
      return;
    }

    const projectId = new ObjectId(id);

    const existing = await projectCollection().findOne({
      slug: input.slug,
      _id: { $ne: projectId },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: "This slug is already used. Please choose another.",
      });
      return;
    }

    if (input.categoryId) {
      const cat = await categoryCollection().findOne({ _id: input.categoryId });
      if (!cat) {
        res.status(400).json({
          success: false,
          message: "Selected category does not exist.",
        });
        return;
      }
    }

    const updateFields: Record<string, unknown> = {
      title: input.title,
      slug: input.slug,
      shortDescription: input.shortDescription,
      description: input.description,
      coverImage: input.coverImage,
      gallery: input.gallery,
      client: input.client || "",
      location: input.location || "",
      year: input.year || "",
      features: input.features,
      updatedAt: new Date(),
    };

    if (input.seo !== undefined) {
      updateFields.seo = input.seo;
    }

    if (req.body.categoryId !== undefined) {
      updateFields.categoryId = input.categoryId || null;
    }

    const result = await projectCollection().updateOne(
      { _id: projectId },
      {
        $set: updateFields,
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete project
export const deleteProject: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid project id",
      });
      return;
    }

    const result = await projectCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update project status
export const updateProjectStatus: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid project id",
      });
      return;
    }

    const status = req.body?.status;

    if (status !== "published" && status !== "unpublished") {
      res.status(400).json({
        success: false,
        message: "Invalid status",
      });
      return;
    }

    const result = await projectCollection().updateOne(
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
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Project status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
