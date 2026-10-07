import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findAdminByEmail } from "../models/admin.models.js";


const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

const signingSecret: string = jwtSecret;

const isProductionEnv =
  process.env.NODE_ENV === "production" ||
  process.env.RENDER === "true" ||
  Boolean(process.env.RENDER_EXTERNAL_URL) ||
  Boolean(process.env.CLIENT_ORIGIN?.includes("vercel.app"));

export const getAuthCookieOptions = (req?: Parameters<RequestHandler>[0]) => {
  const isSecure =
    isProductionEnv ||
    req?.secure ||
    req?.get("x-forwarded-proto") === "https";

  return {
    httpOnly: true,
    secure: Boolean(isSecure),
    sameSite: (isSecure ? "none" : "lax") as "none" | "lax",
    maxAge: 4 * 24 * 60 * 60 * 1000,
    path: "/",
  };
};

export const loginAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const admin = await findAdminByEmail(email.trim().toLowerCase());

    const passwordMatches = admin
      ? await bcrypt.compare(password, admin.password)
      : false;

    if (!admin || !passwordMatches || admin.role !== "admin") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign(
      { role: admin.role },
      signingSecret,
      {
        subject: admin._id.toHexString(),
        algorithm: "HS256",
        expiresIn: "4d",
      }
    );

    const cookieOpts = getAuthCookieOptions(req);
    res.cookie("admin_token", token, cookieOpts);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id.toHexString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin: RequestHandler = (req, res) => {
  const cookieOpts = getAuthCookieOptions(req);

  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: cookieOpts.secure,
    sameSite: cookieOpts.sameSite,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};