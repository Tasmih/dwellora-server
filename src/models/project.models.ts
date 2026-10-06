import { ObjectId } from "mongodb";
import { getDatabase } from "../config/database.js";

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface Project {
  _id?: ObjectId;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  gallery: string[];
  categoryId?: ObjectId;
  location?: string;
  client?: string;
  year?: string;
  features?: ProjectFeature[];
  seo?: SeoSettings;
  status: "published" | "unpublished";
  createdAt: Date;
  updatedAt: Date;
}

const collectionName = "projects";

export function projectCollection() {
  return getDatabase().collection<Project>(collectionName);
}
