import express from "express";
import cors from "cors";
import 'dotenv/config';

import authRouter from "./routes/auth.routes.js";

import userRouter from "./routes/user.routes.js";

import authMiddleware from "./middleware/auth.middleware.js";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", authMiddleware, userRouter);

//app.use("/api/v1/products", userRouter);


app.get("/", (req, res) => {
  res.send("Hi");
});

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
