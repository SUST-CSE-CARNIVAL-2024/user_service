//external imports
import express from "express";

// internal imports
import validateRequest from "./middleware/validateRequest";
import authorize from "./middleware/verifyToken";
import userService from "../services/auth.service";
import userSchema from "../schemas/user_request.schema";
import userController from "../controller/user.controller";

const userRouter = express.Router();

// request chat
userRouter.post(
  "/request_Chat",
  validateRequest(userSchema.ReqestChat),
  authorize(true, false),
  userController.requestChat
);

// confirm chat
userRouter.post(
  "/confirm_Chat",
  validateRequest(userSchema.ConfirmChat),
  authorize(true, false),
  userController.confirmChat
);

// get notification
userRouter.get(
  "/get_Notification",
  authorize(false, false),
  userController.getNotification
);

export default userRouter;
