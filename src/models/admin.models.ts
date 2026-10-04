import { ObjectId } from "mongodb";
import { getDatabase } from "../config/datbase.js";



export interface Admin {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin";
}


const collectionName = "admins";


export function adminCollection() {
  const database = getDatabase();

  return database.collection<Admin>(collectionName);
}


export async function findAdminByEmail(email: string) {
  const admin = await adminCollection().findOne({
    email,
  });

  return admin;
}


export async function createAdmin(adminData: Admin) {
  const result = await adminCollection().insertOne(adminData);

  return result;
}