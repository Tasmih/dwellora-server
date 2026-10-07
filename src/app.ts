import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import serviceRouter from "./routes/service.routes.js";
import categoryRouter from "./routes/category.routes.js";
import projectRouter from "./routes/project.routes.js";
import blogRouter from "./routes/blog.routes.js";
import contactRouter from "./modules/contact/contact.routes.js";
import adminRouter from "./routes/admin.routes.js";

const clientOrigin = process.env.CLIENT_ORIGIN || "https://dwellora-client.vercel.app";

const app = express();
app.set("trust proxy", 1);

app.disable("x-powered-by");

const allowedOrigins = [
  "https://dwellora-client.vercel.app",
  "http://localhost:3000",
  ...(clientOrigin ? clientOrigin.split(",").map((s) => s.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      const isAllowed =
        allowedOrigins.some((o) => cleanOrigin === o.replace(/\/$/, "")) ||
        cleanOrigin.endsWith(".vercel.app") ||
        cleanOrigin.includes("localhost") ||
        cleanOrigin.includes("127.0.0.1");
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/services", serviceRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/projects", projectRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Dwellora server is running",
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const requestedStatus =
    typeof error?.status === "number" ? error.status : 500;

  const status =
    requestedStatus >= 400 && requestedStatus <= 599
      ? requestedStatus
      : 500;

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    message:
      status === 400
        ? "Invalid JSON request"
        : status === 413
          ? "Request body is too large"
          : "Something went wrong",
  });
};

app.use(errorHandler);

export default app;