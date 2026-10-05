import { ObjectId } from "mongodb";
import { getDatabase } from "../config/database.js";


export interface Service {
  _id?: ObjectId;
  title: string;
  slug: string;
  description: string;
  image: string;
  status: "published" | "unpublished";
  createdAt: Date;
  updatedAt: Date;
}


const collectionName = "services";


export function serviceCollection() {
  const database = getDatabase();

  return database.collection<Service>(collectionName);
}