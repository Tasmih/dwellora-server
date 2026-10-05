import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import serviceRouter from "./routes/service.routes.js";
import categoryRouter from "./routes/category.routes.js";

const clientOrigin = process.env.CLIENT_ORIGIN;

if (!clientOrigin) {
  throw new Error("CLIENT_ORIGIN is missing");
}

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/services", serviceRouter);
app.use("/api/categories", categoryRouter);

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