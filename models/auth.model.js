import { db } from "../database/firebase.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signUpNewUser = async (data) => {
  const { name, uid, email, iat, picture } = data;
  const hs = (await db.ref("users/").once("value")).val();
  let uo = hs ? Object.values(hs) : [];
  uo = uo.find(e => e.email == email);
  if(uo) {
    return null;
  }
  await db.ref(`users/${uid}`).update({
    username: name,
    email: email,
    uid: uid,
    iat: iat,
    picture: picture
  });
  return { name, uid };
}

export const signInUser = (data) => {
  const token = jwt.sign({ uid: data.uid, email: data.email }, JWT_SECRET, { expiresIn: "2d" });
  return { token };
}