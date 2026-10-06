import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";

import {
  serviceCollection,
  type SeoSettings,
} from "../models/service.models.js";
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

function readServiceInput(body: unknown) {
  if (!isObject(body)) {
    throw new Error("Invalid service data.");
  }

  const requiredText = (field: string) => {
    const value = body[field];

    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${field} is required.`);
    }

    return value.trim();
  };

  const title = requiredText("title");
  const slug = requiredText("slug");
  const description = requiredText("description");
  const rawImage = requiredText("image");

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "Slug must contain lowercase English letters, numbers and single hyphens."
    );
  }

  const image = sanitizeUrl(rawImage, "Image");

  let shortDescription: string | undefined;
  if (body.shortDescription !== undefined) {
    if (typeof body.shortDescription !== "string") {
      throw new Error("shortDescription must be text.");
    }
    shortDescription = body.shortDescription.trim();
  }

  let includedItems: Array<{ title: string; description: string }> | undefined;
  if (body.includedItems !== undefined) {
    if (!Array.isArray(body.includedItems)) {
      throw new Error("includedItems must be an array.");
    }
    includedItems = body.includedItems.map((item, index) => {
      if (!isObject(item)) {
        throw new Error(`Included item at index ${index} must be an object.`);
      }
      if (typeof item.title !== "string" || !item.title.trim()) {
        throw new Error(
          `Included item at index ${index} must have a non-blank title.`
        );
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
    description,
    image,
    ...(shortDescription !== undefined ? { shortDescription } : {}),
    ...(includedItems !== undefined ? { includedItems } : {}),
    ...(categoryId !== undefined ? { categoryId } : {}),
    ...(seo !== undefined ? { seo } : {}),
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Invalid service data.";
}

export const createService: RequestHandler = async (req, res, next) => {
  try {
    let input;

    try {
      input = readServiceInput(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: errorMessage(error),
      });
      return;
    }

    const existing = await serviceCollection().findOne({
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
    const shortDesc =
      input.shortDescription && input.shortDescription.length > 0
        ? input.shortDescription
        : input.description.slice(0, 160).trim();

    const result = await serviceCollection().insertOne({
      title: input.title,
      slug: input.slug,
      shortDescription: shortDesc,
      description: input.description,
      image: input.image,
      includedItems: input.includedItems || [],
      ...(input.seo ? { seo: input.seo } : {}),
      ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      status: "published",
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      id: result.insertedId,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to find category document across service_categories or categories collections
async function findCategoryDoc(
  query: Record<string, unknown>
): Promise<ServiceCategory | null> {
  let cat = await categoryCollection().findOne(query);
  if (!cat) {
    try {
      const db = categoryCollection().dbName ? categoryCollection() : null;
    } catch {}
  }
  return cat;
}

// Helper to find multiple category documents
async function findCategoryDocs(
  query: Record<string, unknown>
): Promise<ServiceCategory[]> {
  return categoryCollection().find(query).toArray();
}

// Public: Get published services (filter by category slug or ID)
export const getServices: RequestHandler = async (req, res, next) => {
  try {
    const categoryQuery =
      req.query.category || req.query.categorySlug || req.query.categoryId;
    let query: Record<string, unknown>;

    if (typeof categoryQuery === "string" && categoryQuery.trim()) {
      const catParam = categoryQuery.trim();
      const isOid = ObjectId.isValid(catParam) && catParam.length === 24;

      // 1. Resolve category by slug (or by _id if ObjectId string provided)
      const cat = await findCategoryDoc({
        $or: [
          { slug: catParam },
          { slug: catParam.toLowerCase() },
          ...(isOid ? [{ _id: new ObjectId(catParam) }] : []),
        ],
      });

      if (!cat) {
        res.status(200).json({
          success: true,
          services: [],
        });
        return;
      }

      // If category is explicitly unpublished, return empty list for public
      if (cat.status === "unpublished") {
        res.status(200).json({
          success: true,
          services: [],
        });
        return;
      }

      // 2. Extract category ObjectId
      const targetCatId =
        cat._id instanceof ObjectId ? cat._id : new ObjectId(cat._id);

      // 3. Query services collection by categoryId ObjectId
      query = {
        status: "published",
        $or: [
          { categoryId: targetCatId },
          { categoryId: targetCatId.toHexString() },
        ],
      };
    } else {
      // Find all published category IDs
      const publishedCats = await findCategoryDocs({
        status: { $ne: "unpublished" },
      });
      const publishedCatIds = publishedCats
        .map((c) => (c._id ? (c._id instanceof ObjectId ? c._id : new ObjectId(c._id)) : null))
        .filter((id): id is ObjectId => Boolean(id));
      const publishedCatIdStrs = publishedCats
        .map((c) => (c._id ? c._id.toString() : null))
        .filter((id): id is string => Boolean(id));

      query = {
        status: "published",
        $or: [
          { categoryId: { $in: [null, undefined] } },
          { categoryId: { $exists: false } },
          { categoryId: { $in: [...publishedCatIds, ...publishedCatIdStrs] } },
        ],
      };
    }

    const services = await serviceCollection()
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Attach category details
    const categoryIds = services
      .map((s) => {
        if (!s.categoryId) return null;
        return ObjectId.isValid(s.categoryId)
          ? new ObjectId(s.categoryId)
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
          { _id: c._id!, name: c.name, slug: c.slug },
        ])
    );

    const enrichedServices = services.map((s) => {
      const catKey = s.categoryId
        ? typeof s.categoryId === "string"
          ? s.categoryId
          : s.categoryId.toHexString()
        : undefined;

      return {
        ...s,
        category: catKey ? categoryMap.get(catKey) : undefined,
      };
    });

    res.status(200).json({
      success: true,
      services: enrichedServices,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all services with category details (optionally filter by category)
export const getAdminServices: RequestHandler = async (req, res, next) => {
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
          services: [],
        });
        return;
      }
    }

    const services = await serviceCollection()
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const categoryIds = services
      .map((s) => {
        if (!s.categoryId) return null;
        return ObjectId.isValid(s.categoryId)
          ? new ObjectId(s.categoryId)
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

    const enrichedServices = services.map((s) => {
      const catKey = s.categoryId
        ? typeof s.categoryId === "string"
          ? s.categoryId
          : s.categoryId.toHexString()
        : undefined;

      return {
        ...s,
        category: catKey ? categoryMap.get(catKey) : undefined,
      };
    });

    res.status(200).json({
      success: true,
      services: enrichedServices,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get service by ID
export const getServiceById: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid service id",
      });
      return;
    }

    const service = await serviceCollection().findOne({
      _id: new ObjectId(id),
    });

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    let category;
    if (service.categoryId) {
      const targetCatId =
        ObjectId.isValid(service.categoryId)
          ? new ObjectId(service.categoryId)
          : service.categoryId;

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
      service: {
        ...service,
        ...(category ? { category } : {}),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get service by slug (hidden if assigned to unpublished or dangling category)
export const getServiceBySlug: RequestHandler = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string" || !slug) {
      res.status(400).json({
        success: false,
        message: "Invalid slug",
      });
      return;
    }

    const service = await serviceCollection().findOne({
      slug,
      status: "published",
    });

    if (!service) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    let category;
    if (service.categoryId) {
      const targetCatId =
        ObjectId.isValid(service.categoryId)
          ? new ObjectId(service.categoryId)
          : service.categoryId;

      const cat = await findCategoryDoc({
        _id: targetCatId,
        status: { $ne: "unpublished" },
      });

      // Rules: If assigned category is unpublished or dangling, return 404
      if (!cat) {
        res.status(404).json({
          success: false,
          message: "Service not found",
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
      service: {
        ...service,
        ...(category ? { category } : {}),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update service
export const updateService: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid service id",
      });
      return;
    }

    let input;

    try {
      input = readServiceInput(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: errorMessage(error),
      });
      return;
    }

    const serviceId = new ObjectId(id);

    const existing = await serviceCollection().findOne({
      slug: input.slug,
      _id: { $ne: serviceId },
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
      description: input.description,
      image: input.image,
      updatedAt: new Date(),
    };

    if (input.shortDescription !== undefined) {
      updateFields.shortDescription = input.shortDescription;
    }

    if (input.includedItems !== undefined) {
      updateFields.includedItems = input.includedItems;
    }

    if (input.seo !== undefined) {
      updateFields.seo = input.seo;
    }

    // Preserve categoryId when omitted; allow null to remove assignment
    if (req.body.categoryId !== undefined) {
      updateFields.categoryId = input.categoryId || null;
    }

    const result = await serviceCollection().updateOne(
      { _id: serviceId },
      {
        $set: updateFields,
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid service id",
      });
      return;
    }

    const result = await serviceCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateServiceStatus: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid service id",
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

    const result = await serviceCollection().updateOne(
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
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};