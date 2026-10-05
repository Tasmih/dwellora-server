import { Router } from "express";

import {
  createCategory,
  getCategories,
  getAdminCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "../controllers/category.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const categoryRouter = Router();

// Public API
categoryRouter.get("/", getCategories);
categoryRouter.get("/slug/:slug", getCategoryBySlug);

// Admin API
categoryRouter.get("/admin", requireAdmin, getAdminCategories);
categoryRouter.post("/", requireAdmin, createCategory);
categoryRouter.get("/:id", requireAdmin, getCategoryById);
categoryRouter.put("/:id", requireAdmin, updateCategory);
categoryRouter.delete("/:id", requireAdmin, deleteCategory);
categoryRouter.patch("/:id/status", requireAdmin, updateCategoryStatus);

export default categoryRouter;
