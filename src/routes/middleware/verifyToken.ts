import { Request, Response, NextFunction } from "express";
import {} from "../../utils/custom";
import jwtService from "../../utils/jwt";

import createError from "http-errors";
import { config } from "../../config";
import log from "../../utils/logger";

const authorize =
  (onlyClient: boolean, onlyMentor: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      log.debug(token, "token");

      if (!token) {
        return next(createError.Unauthorized());
      }

      //log.deug(auth_response_payload, "auth_response_payload");
      const parsedToken = await jwtService.verifyToken(token);

      if (!parsedToken) {
        return next(createError.Unauthorized());
      }

      // set the user_identity in req.locals
      let role = parsedToken.role ? parsedToken.role : null;

      if (onlyClient && role !== "client") {
        return next(createError.Unauthorized());
      }

      if (onlyMentor && role !== "mentor") {
        return next(createError.Unauthorized());
      }

      req.user_identity = {
        id: parsedToken.id,
        email: parsedToken.email,
        role,
      };
      return next();
    } catch (error) {
      next(error);
    }
  };

export default authorize;
