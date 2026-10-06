import { ObjectId } from "mongodb";

export type ContactStatus = "new" | "read" | "replied";

export interface Contact {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}
