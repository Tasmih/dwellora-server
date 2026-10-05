import { Router } from "express";

import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  updateServiceStatus,
} from "../controllers/service.controller.js";


import { requireAdmin } from "../middleware/auth.middleware.js";


const serviceRouter = Router();


// public API
// show service from website

serviceRouter.ge(
  "/",
  getServices
);


serviceRouter.get(
  "/:id",
  getServiceById
);




// admin API
// To manage from Dashboard


serviceRouter.post(
  "/",
  requireAdmin,
  createService
);


serviceRouter.put(
  "/:id",
  requireAdmin,
  updateService
);


serviceRouter.delete(
  "/:id",
  requireAdmin,
  deleteService
);


serviceRouter.patch(
  "/:id/status",
  requireAdmin,
  updateServiceStatus
);



export default serviceRouter;