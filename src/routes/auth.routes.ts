//external imports
import express from "express";

// internal imports
import validateRequest from "./middleware/validateRequest";
import authSchema from "../schemas/auth_request.schema";
import authController from "../controller/auth.controller";

const authRouter = express.Router();

// sign up
authRouter.post(
  "/signup",
  validateRequest(authSchema.Signup),
  authController.signup
);

// log in
authRouter.post(
  "/login",
  validateRequest(authSchema.Login),
  authController.login
);

export default authRouter;
