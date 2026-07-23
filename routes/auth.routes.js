import { Router } from "express";

import { signUpWithEmail, signUpWithGoogle, signInWithEmail } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/sign-up", signUpWithEmail);

authRouter.post("/sign-up-gmail", signUpWithGoogle);

authRouter.post("/sign-in", signInWithEmail);

export default authRouter;
