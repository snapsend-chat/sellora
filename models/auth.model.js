import { db } from "../database/firebase.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signUpNewUser = async (data) => {
  const { name, uid, email, iat, picture } = data;
  await db.ref(`users/${uid}`).update({
    username: name,
    email: email,
    uid: uid,
    iat: iat,
    picture: picture
  });
  const token = jwt.sign({ uid, email }, JWT_SECRET, { expiresIn: "2d" });
  return { token };
}

export const signUpNewUserEmail = async (data) => {
  try {
    const { name, uid, email, iat } = data;
    const usr = (await db.ref("users/").once("value"));
    let uobj = usr.exists() ? Object.values(usr.val()) : [];
    uobj = uobj.find(u => u.email == email);
    if(uobj) return null;
    await db.ref(`users/${uid}`).update({
      username: name,
      email: email,
      uid: uid,
      iat: iat,
      picture: ""
    });
    const token = jwt.sign({ uid, email }, JWT_SECRET, { expiresIn: "2d" });
    return { token };
  } catch(err) {
    console.log(err);
    return null;
  }
}

export const signInUser = (data) => {
  const token = jwt.sign({ uid: data.uid, email: data.email }, JWT_SECRET, { expiresIn: "2d" });
  return { token };
}