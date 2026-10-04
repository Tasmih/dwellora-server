import { Router } from "express";
import { loginAdmin } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", loginAdmin);

authRouter.get("/me", requireAdmin, (_req, res) => {
  res.status(200).json({
    success: true,
    admin: res.locals.admin,
  });
});

export default authRouter;