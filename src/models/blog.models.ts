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

export type BlogType = "blog" | "vlog";
export type BlogStatus = "published" | "draft";

export interface Blog {
  _id?: ObjectId;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImage?: string;
  type: BlogType;
  videoUrl?: string;
  author: string;
  readTime: string;
  seo?: SeoSettings;
  status: BlogStatus;
  createdAt: Date;
  updatedAt: Date;
}

const collectionName = "blogs";

export function blogCollection() {
  return getDatabase().collection<Blog>(collectionName);
}
