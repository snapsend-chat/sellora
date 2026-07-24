import { db, auth } from "../database/firebase.js";
import { signInUser } from "../models/auth.model.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;



async function getUserByUid(uid) {
  const snapshot = await db.ref(`users/${uid}`).once('value');
  return snapshot.exists() ? snapshot.val() : null;
}

async function checkEmailExists(email) {
  const snapshot = await db.ref('users').orderByChild('email').equalTo(email.toLowerCase().trim()).once('value');
  return snapshot.exists();
}

const createUserAndToken = async (userData, username, picture = "") => {
  const { uid, email, iat } = userData;
  const normalizedEmail = email.toLowerCase().trim();
  await db.ref(`users/${uid}`).set({
    username,
    email: normalizedEmail,
    uid,
    iat,
    picture,
    createdAt: new Date().getTime()
  });
  const token = signInUser({ uid, email: normalizedEmail });
  return token;
};

export const signUpWithEmail = async (req, res) => {
  try {
    const { token, username } = req.body;
    if (!token || !username) return res.status(400).json({ message: "token and username required" });
    const userData = await auth.verifyIdToken(token);
    const { uid, email } = userData;
    const userExists = await checkEmailExists(email);
    const userExistsUid = await getUserByUid(uid);
    if (userExists || userExistsUid) {
      return res.status(409).json({ message: "User already exists" });
    }
    const appToken = await createUserAndToken(userData, username);
    return res.status(201).json({ token: appToken });
  } catch(err) {
    console.error(err);
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

export const signUpWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "token required" });
    const userData = await auth.verifyIdToken(token);
    const { uid, email, name, picture } = userData;
    const userExists = await checkEmailExists(email);
    const userExistsUid = await getUserByUid(uid);
    if (userExists || userExistsUid) {
      const tk = signInUser({uid, email});
      return res.status(201).json({ token: tk });
    }
    const appToken = await createUserAndToken(userData, name, picture);
    return res.status(201).json({ token: appToken });
  } catch(err) {
    console.error(err);
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

export const signInWithEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "token required" });
    const firebaseUser = await auth.verifyIdToken(token);
    const { uid, email } = firebaseUser;
    const dbUser = await getUserByUid(uid);
    if (!dbUser) {
      return res.status(404).json({ success: false, message: "USER NOT EXISTS" });
    }
    const accessToken = signInUser({ uid: uid, email: dbUser.email });
    return res.status(200).json({ success: true, token: accessToken, user: dbUser });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};