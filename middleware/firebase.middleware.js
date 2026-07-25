import { auth } from "../database/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader ||!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);

    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again' });
  }
};