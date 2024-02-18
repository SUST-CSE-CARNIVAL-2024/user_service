//external imports
import express from "express";

// internal imports
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

const router = express.Router();

router.get("/checkServer", (_, res) => res.sendStatus(200));

router.use("/auth", authRouter);

router.use("/user", userRouter);

export default router;
