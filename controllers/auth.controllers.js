import { db, auth } from "../database/firebase.js";
import { signUpNewUser, signInUser, signUpNewUserEmail } from "../models/auth.model.js";

export const signUpWithEmail = async (req, res) => {
  try {
    const data = req.body;
    let userData = await auth.verifyIdToken(data.token);
    userData.name = data.username;
    const result = await signUpNewUserEmail({...userData});
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