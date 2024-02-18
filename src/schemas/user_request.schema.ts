// external imports
import { object, string, union, TypeOf, number } from "zod";

export enum UserRole {
  CLIENT = "client",
  MENTOR = "mentor",
}

export interface User_Schema_Interface {
  ReqestChat: object;
  ConfirmChat: object;
}

class UserSchema implements User_Schema_Interface {
  // ------------------------- ReqestChat Schema -------------------------
  ReqestChat = object({
    body: object({
      questionnaires: string()
        .array()
        .min(1, "At least one questionnaire is required"),
    }),
  });

  ConfirmChat = object({
    body: object({
      preSessionId: number({
        required_error: "preChatSessionId is required",
      }),
    }),
  });
}

export default new UserSchema();

export type ReqestChat_Body_Input = TypeOf<UserSchema["ReqestChat"]>["body"];
export type ConfirmChat_Body_Input = TypeOf<UserSchema["ConfirmChat"]>["body"];
