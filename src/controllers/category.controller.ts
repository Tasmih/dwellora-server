import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";

import {
  categoryCollection,
  type ServiceCategory,
} from "../models/category.models.js";
import { serviceCollection } from "../models/service.models.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function readCategoryInput(body: unknown) {
  if (!isObject(body)) {
    throw new Error("Invalid category data.");
  }

  const requiredText = (field: string) => {
    const value = body[field];
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${field} is required.`);
    }
    return value.trim();
  };

  const name = requiredText("name");
  const slug = requiredText("slug");
  const description = requiredText("description");

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "Slug must contain lowercase English letters, numbers and single hyphens."
    );
  }

  let image: string | undefined;
  if (body.image !== undefined && body.image !== null && body.image !== "") {
    if (typeof body.image !== "string" || !isHttpUrl(body.image)) {
      throw new Error("Image must be a valid HTTP or HTTPS URL.");
    }
    image = body.image.trim();
  }

  let displayOrder: number | undefined;
  if (
    body.displayOrder !== undefined &&
    body.displayOrder !== null &&
    body.displayOrder !== ""
  ) {
    const num =
      typeof body.displayOrder === "number"
        ? body.displayOrder
        : Number(body.displayOrder);
    if (!Number.isInteger(num) || num < 0) {
      throw new Error("Display Order must be a non-negative integer.");
    }
    displayOrder = num;
  }

  return {
    name,
    slug,
    description,
    image,
    displayOrder,
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Invalid category data.";
}

// Public: Get all published categories
export const getCategories: RequestHandler = async (_req, res, next) => {
  try {
    const categories = await categoryCollection()
      .aggregate<ServiceCategory>([
        { $match: { status: "published" } },
        {
          $addFields: {
            effectiveOrder: {
              $ifNull: ["$displayOrder", 999999999],
            },
          },
        },
        {
          $sort: {
            effectiveOrder: 1,
            createdAt: 1,
            _id: 1,
          },
        },
        {
          $project: {
            effectiveOrder: 0,
          },
        },
      ])
      .toArray();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get single published category by slug
export const getCategoryBySlug: RequestHandler = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    if (typeof slug !== "string" || !slug) {
      res.status(400).json({
        success: false,
        message: "Invalid slug",
      });
      return;
    }

    const category = await categoryCollection().findOne({
      slug,
      status: "published",
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all categories (published and unpublished)
export const getAdminCategories: RequestHandler = async (_req, res, next) => {
  try {
    const categories = await categoryCollection()
      .aggregate<ServiceCategory>([
        {
          $addFields: {
            effectiveOrder: {
              $ifNull: ["$displayOrder", 999999999],
            },
          },
        },
        {
          $sort: {
            effectiveOrder: 1,
            createdAt: 1,
            _id: 1,
          },
        },
        {
          $project: {
            effectiveOrder: 0,
          },
        },
      ])
      .toArray();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get category by ID
export const getCategoryById: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
      return;
    }

    const category = await categoryCollection().findOne({
      _id: new ObjectId(id),
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create category
export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    let input;
    try {
      input = readCategoryInput(req.body);
    } catch (err) {
      res.status(400).json({
        success: false,
        message: errorMessage(err),
      });
      return;
    }

    const existing = await categoryCollection().findOne({
      slug: input.slug,
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: "This category slug is already used. Please choose another.",
      });
      return;
    }

    const now = new Date();
    const result = await categoryCollection().insertOne({
      name: input.name,
      slug: input.slug,
      description: input.description,
      ...(input.image ? { image: input.image } : {}),
      ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
      status: "published",
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      id: result.insertedId,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update category
export const updateCategory: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
      return;
    }

    let input;
    try {
      input = readCategoryInput(req.body);
    } catch (err) {
      res.status(400).json({
        success: false,
        message: errorMessage(err),
      });
      return;
    }

    const categoryId = new ObjectId(id);

    const existing = await categoryCollection().findOne({
      slug: input.slug,
      _id: { $ne: categoryId },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: "This category slug is already used. Please choose another.",
      });
      return;
    }

    const updateFields: Record<string, unknown> = {
      name: input.name,
      slug: input.slug,
      description: input.description,
      updatedAt: new Date(),
    };

    if (req.body.image !== undefined) {
      updateFields.image = input.image || null;
    }

    if (req.body.displayOrder !== undefined) {
      updateFields.displayOrder =
        input.displayOrder !== undefined ? input.displayOrder : null;
    }

    const result = await categoryCollection().updateOne(
      { _id: categoryId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update category status (published / unpublished)
export const updateCategoryStatus: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category id",
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

    const result = await categoryCollection().updateOne(
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
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete category (blocked if referenced by ANY services)
export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
      return;
    }

    const categoryId = new ObjectId(id);

    // Check if any services reference this category
    const count = await serviceCollection().countDocuments({
      categoryId,
    });

    if (count > 0) {
      res.status(409).json({
        success: false,
        message: `Cannot delete category because it is currently assigned to ${count} service(s). Please reassign or remove the category from those services first.`,
      });
      return;
    }

    const result = await categoryCollection().deleteOne({
      _id: categoryId,
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
