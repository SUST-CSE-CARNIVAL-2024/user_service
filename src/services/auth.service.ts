// external imports
import createHttpError from "http-errors";

//internal imports
import {
  Signup_Body_Input,
  Login_Body_Input,
} from "../schemas/auth_request.schema";

import userRepository, {
  UserRepositoryInterface,
} from "../database/repository/auth.repository";

import { config } from "../config";
import jwtService, { JWT_Payload } from "../utils/jwt";
import { UserRole } from "../schemas/auth_request.schema";
import log from "../utils/logger";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";
import clientService from "./client.service";
import mentorService from "./mentor.service";

// ============================== UserService ============================== //

export interface Signup_or_Login_Service_Output {
  role: string;
  token: string;
}

export interface UserServiceInterface {
  SignUp(userInput: Signup_Body_Input): Promise<Signup_or_Login_Service_Output>;

  LogIn(userInput: Login_Body_Input): Promise<Signup_or_Login_Service_Output>;
}

class UserService implements UserServiceInterface {
  private repository: UserRepositoryInterface;

  constructor() {
    this.repository = userRepository;
  }

  // ----------------------------------------- SignUP ------------------------------------------ //
  async SignUp(userInput: Signup_Body_Input) {
    try {
      const { email, password, role } = userInput;

      const existingUser = await this.repository.findUserByEmail(email);

      if (existingUser)
        throw createHttpError(409, `User with email ${email} already exists`);

      const newUser = await this.repository.createUser(userInput);

      //! have to add to client or mentor table
      if (role === UserRole.CLIENT) {
        const newClient = await clientService.addNewClient({
          userId: newUser.id,
        });

        await newUser.setClient(newClient);
        await newClient.setUser(newUser);
      } else if (role === UserRole.MENTOR) {
        const newMentor = await mentorService.addNewMentor({
          userId: newUser.id,
        });

        await newUser.setMentor(newMentor);
        await newMentor.setUser(newUser);
      }

      //! have to pass the questionnaires to the gpt and update the expertise_emotionalState

      // generate JWT token
      const token_payload: JWT_Payload = {
        id: newUser.id,
        email: email,
        role: role,
      };

      const token = await jwtService.generateToken(token_payload);

      return { role, token };
    } catch (error) {
      throw error;
    }
  }

  async LogIn(userInput: Login_Body_Input) {
    try {
      const { email, password } = userInput;

      const existingUser = await this.repository.findUserByEmail_and_Password(
        email,
        password
      );

      if (!existingUser)
        throw createHttpError(400, "invalid email or password");

      const role = existingUser.role;
      // generate JWT token
      const token_payload: JWT_Payload = {
        id: existingUser.id,
        email: existingUser.email,
        role,
      };

      const token = await jwtService.generateToken(token_payload);

      return { role, token };
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
