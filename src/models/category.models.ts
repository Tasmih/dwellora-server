import { ObjectId } from "mongodb";
import { getDatabase } from "../config/database.js";

export interface ServiceCategory {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  image?: string;
  displayOrder?: number;
  status: "published" | "unpublished";
  createdAt: Date;
  updatedAt: Date;
}

const collectionName = "service_categories";

export function categoryCollection() {
  return getDatabase().collection<ServiceCategory>(collectionName);
}
