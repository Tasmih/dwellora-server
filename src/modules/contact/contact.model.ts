import { getDatabase } from "../../config/database.js";
import { type Contact } from "./contact.interface.js";

const collectionName = "contacts";

export function contactCollection() {
  return getDatabase().collection<Contact>(collectionName);
}

export * from "./contact.interface.js";
