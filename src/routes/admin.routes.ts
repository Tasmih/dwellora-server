import { Router } from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const adminRouter = Router();

adminRouter.get("/stats", requireAdmin, getAdminStats);

export default adminRouter;
