import { Router } from "express";
import {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "./contact.controller.js";
import { requireAdmin } from "../../middleware/auth.middleware.js";

const contactRouter = Router();

// Public submission
contactRouter.post("/", submitContact);

// Admin protected endpoints
contactRouter.get("/", requireAdmin, getContacts);
contactRouter.get("/:id", requireAdmin, getContactById);
contactRouter.patch("/:id/status", requireAdmin, updateContactStatus);
contactRouter.delete("/:id", requireAdmin, deleteContact);

export default contactRouter;
