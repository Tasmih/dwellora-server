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

export interface IncludedItem {
  title: string;
  description: string;
}

export interface Service {
  _id?: ObjectId;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  image: string;
  includedItems?: IncludedItem[];
  seo?: SeoSettings;
  categoryId?: ObjectId;
  status: "published" | "unpublished";
  createdAt: Date;
  updatedAt: Date;
}

const collectionName = "services";

export function serviceCollection() {
  return getDatabase().collection<Service>(collectionName);
}