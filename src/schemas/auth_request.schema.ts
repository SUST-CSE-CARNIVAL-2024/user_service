// external imports
import { object, string, union, TypeOf, number } from "zod";

export enum UserRole {
  CLIENT = "client",
  MENTOR = "mentor",
}

export interface Auth_Schema_Interface {
  Signup: object;
  Login: object;
}

class AuthSchema implements Auth_Schema_Interface {
  // ------------------------- SignUp Schema -------------------------
  Signup = object({
    body: object({
      email: string({
        required_error: "Email is required",
      }).email("Invalid email"),

      password: string({
        required_error: "Password is required",
      }).min(4, "Password must be at least 4 characters long"),

      role: string({
        required_error: "Role is required",
      }).refine((val) => Object.values(UserRole).includes(val as UserRole), {
        message: `Role must be one of ${Object.values(UserRole).join(", ")}`,
      }),

      questionnaires: string()
        .array()
        .min(1, "At least one questionnaire is required"),
    }),
  });

  // ------------------------- SignUp Schema -------------------------
  Login = object({
    body: object({
      email: string({
        required_error: "Email is required",
      }).email("Invalid email"),

      password: string({
        required_error: "Password is required",
      }).min(4, "Password must be at least 4 characters long"),
    }),
  });
}

export default new AuthSchema();

export type Signup_Body_Input = TypeOf<AuthSchema["Signup"]>["body"];
export type Login_Body_Input = TypeOf<AuthSchema["Login"]>["body"];
