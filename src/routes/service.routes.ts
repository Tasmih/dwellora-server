import { Router } from "express";

import {
  createService,
  getServices,
  getAdminServices,
  getServiceById,
  updateService,
  deleteService,
  updateServiceStatus,
  getServiceBySlug,
} from "../controllers/service.controller.js";

import { requireAdmin } from "../middleware/auth.middleware.js";

const serviceRouter = Router();

// Public API (only published services)
serviceRouter.get("/", getServices);
serviceRouter.get("/slug/:slug", getServiceBySlug);

// Admin API (require authentication)
serviceRouter.get("/admin", requireAdmin, getAdminServices);
serviceRouter.post("/", requireAdmin, createService);
serviceRouter.get("/:id", requireAdmin, getServiceById);
serviceRouter.put("/:id", requireAdmin, updateService);
serviceRouter.delete("/:id", requireAdmin, deleteService);
serviceRouter.patch("/:id/status", requireAdmin, updateServiceStatus);

export default serviceRouter;