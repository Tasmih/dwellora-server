import type { RequestHandler } from "express";
import { serviceCollection } from "../models/service.models.js";
import { projectCollection } from "../models/project.models.js";
import { blogCollection } from "../models/blog.models.js";
import { contactCollection } from "../modules/contact/contact.model.js";

export const getAdminStats: RequestHandler = async (_req, res, next) => {
  try {
    const [services, projects, blogs, inquiries] = await Promise.all([
      serviceCollection().countDocuments(),
      projectCollection().countDocuments(),
      blogCollection().countDocuments(),
      contactCollection().countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        services,
        projects,
        blogs,
        inquiries,
      },
      services,
      projects,
      blogs,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};
