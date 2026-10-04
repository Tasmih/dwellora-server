import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { adminCollection } from "../models/admin.models.js";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

const verificationSecret: string = jwtSecret;

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.admin_token;

  if (typeof token !== "string" || !token) {
    res.status(401).json({
      success: false,
      message: "Please log in",
    });
    return;
  }

  let payload: JwtPayload;

  try {
    const decoded = jwt.verify(token, verificationSecret, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      !/^[a-fA-F0-9]{24}$/.test(decoded.sub) ||
      typeof decoded.exp !== "number"
    ) {
      throw new Error("Invalid token payload");
    }

    payload = decoded;
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please log in again",
    });
    return;
  }

  try {
    const admin = await adminCollection().findOne(
      { _id: new ObjectId(payload.sub), role: "admin" },
      { projection: { password: 0 } }
    );

    if (!admin) {
      res.status(403).json({
        success: false,
        message: "Admin access required",
      });
      return;
    }

    res.locals.admin = {
      id: admin._id.toHexString(),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};