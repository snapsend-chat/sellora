import { db, auth } from "../database/firebase.js";
import { signUpNewUser, signInUser } from "../models/auth.model.js";

export const signUpWithEmail = async (req, res) => {
  try {
    const data = req.body;
    const userData = await auth.verifyIdToken(data.token);
    const result = await signUpNewUser({name: data.username, email: userData.email, uid: userData.uid, iat: userData.iat, picture: ""});
    if(!result) res.status(404).json({success: false, message: "USER ALREADY EXISTS"});
    res.status(200).json({success: true, ...result});
  } catch(err) {
    console.log(err);
    res.status(500).json({message: err});
  }
}

export const signUpWithGoogle = async (req, res) => {
  try {
    const data = req.body;
    const userData = await auth.verifyIdToken(data.token);
    const { name, uid, email, iat, picture } = userData;
    const result = await signUpNewUser(userData);
    if(!result) res.status(200).json({name, uid, success: true});
    res.status(200).json({success: true, ...result});
  } catch(err) {
    console.log(err);
    res.status(500).json({message: err});
  }
}


export const signInWithEmail = async (req, res) => {
  try {
    const data = req.body;
    const userData = await auth.verifyIdToken(data.token);
    const result = await signInUser({email: userData.email, uid: userData.uid});
    if(!result) res.status(404).json({success: false, message: "USER NOT EXISTS"});
    res.status(200).json({success: true, ...result});
  } catch(err) {
    console.log(err);
    res.status(500).json({message: err});
  }
}