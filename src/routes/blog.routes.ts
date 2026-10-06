import { Router } from "express";

import {
  createBlog,
  getBlogs,
  getAdminBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  getBlogBySlug,
} from "../controllers/blog.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const blogRouter = Router();

// Public API (published blogs and vlogs)
blogRouter.get("/", getBlogs);
blogRouter.get("/slug/:slug", getBlogBySlug);

// Admin API (require authentication)
blogRouter.get("/admin", requireAdmin, getAdminBlogs);
blogRouter.post("/", requireAdmin, createBlog);
blogRouter.get("/:id", requireAdmin, getBlogById);
blogRouter.put("/:id", requireAdmin, updateBlog);
blogRouter.delete("/:id", requireAdmin, deleteBlog);
blogRouter.patch("/:id/status", requireAdmin, updateBlogStatus);

export default blogRouter;
