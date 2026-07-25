import { db } from "../database/firebase.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signInUser = (data) => {
  const token = jwt.sign({ uid: data.uid, email: data.email }, JWT_SECRET, { expiresIn: "2d" });
  return token;
}