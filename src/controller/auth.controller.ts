// external imports
import { NextFunction, Request, Response } from "express";

// internal imports
import {
  Signup_Body_Input,
  Login_Body_Input,
} from "../schemas/auth_request.schema";

import authService from "../services/auth.service";
import { SignUp_or_Login_Response } from "schemas/auth_response.schema";

interface Auth_Controller_Interface {
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

class Auth_Controller implements Auth_Controller_Interface {
  // ------------------------------ signup ------------------------------
  async signup(
    req: Request<{}, {}, Signup_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, role, questionnaires } = req.body;

      const result: SignUp_or_Login_Response = await authService.SignUp({
        email,
        password,
        role,
        questionnaires,
      });

      res.status(201).json(result);
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

      const { role: userRole, token: response_token } = await authService.LogIn(
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

export default new Auth_Controller();
