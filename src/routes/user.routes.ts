//external imports
import express from "express";

// internal imports
import validateRequest from "./middleware/validateRequest";
import userService from "../services/auth.service";
import authSchema from "../schemas/auth_request.schema";
import authController from "../controller/auth.controller";

const authRouter = express.Router();

export default authRouter;
