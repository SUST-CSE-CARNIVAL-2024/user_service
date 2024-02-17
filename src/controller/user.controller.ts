// external imports
import { NextFunction, Request, Response } from "express";

// internal imports
import {
  Signup_Body_Input,
  Login_Body_Input,
} from "../schemas/auth_request.schema";

import userService, { UserServiceInterface } from "../services/auth.service";
import { SignUp_or_Login_Response } from "schemas/auth_response.schema";

interface User_Controller_Interface {
  signup(
    req: Request<{}, {}, Signup_Body_Input>,
    res: Response,
    next: NextFunction
  );

  login(
    req: Request<{}, {}, Login_Body_Input>,
    res: Response,
    next: NextFunction
  );
}

class User_Controller implements User_Controller_Interface {
  // ------------------------------ signup ------------------------------
  async signup(
    req: Request<{}, {}, Signup_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, role, questionnaires } = req.body;

      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  // ---------------------------- Login -----------------------------------
  async login(
    req: Request<{}, {}, Login_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const { role: userRole, token: response_token } = await userService.LogIn(
        {
          email,
          password,
        }
      );

      const response: SignUp_or_Login_Response = {
        role: userRole,
        token: response_token,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new User_Controller();
