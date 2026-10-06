import { Router } from "express";

import {
  createProject,
  getProjects,
  getAdminProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectStatus,
  getProjectBySlug,
} from "../controllers/project.controller.js";

import { requireAdmin } from "../middleware/auth.middleware.js";

const projectRouter = Router();

// Public API (only published projects)
projectRouter.get("/", getProjects);
projectRouter.get("/slug/:slug", getProjectBySlug);

// Admin API (require authentication)
projectRouter.get("/admin", requireAdmin, getAdminProjects);
projectRouter.post("/", requireAdmin, createProject);
projectRouter.get("/:id", requireAdmin, getProjectById);
projectRouter.put("/:id", requireAdmin, updateProject);
projectRouter.delete("/:id", requireAdmin, deleteProject);
projectRouter.patch("/:id/status", requireAdmin, updateProjectStatus);

export default projectRouter;
