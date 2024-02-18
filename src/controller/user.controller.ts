// external imports
import { NextFunction, Request, Response } from "express";
import {} from "../utils/custom";

// internal imports
import {
  ReqestChat_Body_Input,
  ConfirmChat_Body_Input,
} from "../schemas/user_request.schema";

import userService, { UserServiceInterface } from "../services/auth.service";
import { SignUp_or_Login_Response } from "schemas/auth_response.schema";
import PreChatSesstion from "../database/models/PreChatSession.model";
import Client from "../database/models/Client.model";
import Mentor from "../database/models/Mentor.model";
import Notification from "../database/models/Notification.model";
import { ClientEmotionalState_JSON } from "schemas/emotional_state.schema";
import { createChatQuestions } from "../utils/createChatQuestions";
import axios from "axios";

import log from "../utils/logger";
import { Op } from "sequelize";
import ChatSesstion from "../database/models/ChatSession.model";
import User from "../database/models/User.model";

interface User_Controller_Interface {
  requestChat(
    req: Request<{}, {}, ReqestChat_Body_Input>,
    res: Response,
    next: NextFunction
  );

  confirmChat(
    req: Request<{}, {}, ConfirmChat_Body_Input>,
    res: Response,
    next: NextFunction
  );

  getNotification(req: Request, res: Response, next: NextFunction);
}

class User_Controller implements User_Controller_Interface {
  // ------------------------------ request Chat ------------------------------
  async requestChat(
    req: Request<{}, {}, ReqestChat_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.user_identity?.id as number;
    log.debug(userId, "userId");

    if (!userId) {
      throw new Error("UserId not found");
    }
    try {
      const { questionnaires } = req.body;

      //! have to give questionaries to chat processing service
      let questionAns = [];

      for (let i = 1; i < questionnaires.length; i++) {
        questionAns.push({
          Question: createChatQuestions[i - 1],
          Answer: questionnaires[i],
        });
      }

      // get response from chat processing service
      const chatProcessingResponse = await axios.post(
        "http://localhost:8082/api/emotion",
        {
          qna_list: questionAns,
        }
      );

      //log.debug(chatProcessingResponse, "chatProcessingResponse");

      let currEmotionalState = JSON.parse(chatProcessingResponse.data);

      // current user
      const user = await Client.findByPk(userId);

      // create pre chat session
      const newPreChatSession = await PreChatSesstion.create({
        victimId: userId,
        seeking_emotionalState: currEmotionalState, //this have to updated with the response of the chat processing service
        expires_at: new Date(Date.now() + 1000 * 60 * 20), // 5 minutes
      });

      //best matching
      // to whom to match
      const toWhom = questionnaires[0] === "mentor" ? "mentor" : "client";

      let scores = [];

      if (toWhom === "mentor") {
        let allMentors = await Mentor.findAll();

        scores = allMentors.map((mentor) => {
          let scoreArray = [];

          const victim_emotionalState = currEmotionalState;

          log.debug(victim_emotionalState, "victim_emotionalState");

          const mentor_emotionalState = mentor.expertise_emotionalState;

          log.debug(mentor_emotionalState, "mentor_emotionalState");

          // Iterate through the keys of the victim_emotionalState object
          Object.keys(victim_emotionalState).forEach((key) => {
            // Check if the key exists in mentor_emotionalState
            if (mentor_emotionalState.hasOwnProperty(key)) {
              // Multiply the values of the matching keys and store the result
              const mul =
                victim_emotionalState[key] * mentor_emotionalState[key];
              //log.debug(mul, "mul");

              scoreArray.push(mul); // Add the result to scoreArray
            }
          });

          //log.debug(scoreArray, "scoreArray");

          let score = 0;
          for (let i = 0; i < 8; i++) {
            score += scoreArray[i];
          }

          return {
            mentorId: mentor.id,
            score,
          };
        });

        // get highest top 5
        scores.sort((a, b) => b.score - a.score);
        scores.splice(Math.min(5, scores.length));
      } else {
        let allClients = await Client.findAll({
          where: { id: { [Op.ne]: userId } },
        });

        scores = allClients.map((client) => {
          let scoreArray = [];

          const victim_emotionalState = currEmotionalState;

          log.debug(victim_emotionalState, "victim_emotionalState");

          const client_emotionalState = client.emotionalState;

          log.debug(client_emotionalState, "client_emotionalState");

          // Iterate through the keys of the victim_emotionalState object
          Object.keys(victim_emotionalState).forEach((key) => {
            // Check if the key exists in mentor_emotionalState
            if (client_emotionalState.hasOwnProperty(key)) {
              // Multiply the values of the matching keys and store the result
              const sub =
                victim_emotionalState[key] * client_emotionalState[key];
              //log.debug(mul, "mul");

              scoreArray.push(sub); // Add the result to scoreArray
            }
          });

          //log.debug(scoreArray, "scoreArray");

          let score = 0;
          for (let i = 0; i < 8; i++) {
            score += scoreArray[i];
          }

          return {
            mentorId: client.id,
            score,
          };
        });

        // get highest top 5
        scores.sort((a, b) => b.score - a.score);
        scores.splice(Math.min(5, scores.length));
      }

      log.debug(scores, "scores");

      // send notification to the top 5
      await Promise.all(
        scores.map(async (score) => {
          await Notification.create({
            userId: score.mentorId,
            expires_at: new Date(Date.now() + 1000 * 60 * 20), // 5 minutes
            valid: true,
            preChatSessionId: newPreChatSession.id,
          });
        })
      );

      res.status(201).json({ preSessionId: newPreChatSession.id });
    } catch (error) {
      next(error);
    }
  }

  // ------------------------------ confirmChat ------------------------------
  async confirmChat(
    req: Request<{}, {}, ConfirmChat_Body_Input>,
    res: Response,
    next: NextFunction
  ) {
    const userId = req.user_identity?.id as number;
    log.debug(userId, "userId");

    if (!userId) {
      throw new Error("UserId not found");
    }
    try {
      const { preSessionId } = req.body;

      const preChatSession = await PreChatSesstion.findByPk(preSessionId);

      if (!preChatSession) {
        throw new Error(
          "PreChatSession not found... either expired or invalid"
        );
      }

      const notification = await Notification.findOne({
        where: {
          preChatSessionId: preSessionId,
          userId,
          valid: true,
        },
      });

      if (!notification) {
        throw new Error("You are not authorized to confirm this chat");
      }

      const victimId = preChatSession.victimId;

      //delete all other notifications
      await Notification.destroy({
        where: {
          preChatSessionId: preSessionId,
        },
      });

      // delete preChatSession
      await preChatSession.destroy();

      // start new Chat Session
      const newChatSession = await ChatSesstion.create({
        victimId,
        mentorId: userId,
        temporary_emotionalState: preChatSession.seeking_emotionalState,
        expires_at: new Date(Date.now() + 1000 * 60 * 20), // 20 minutes
      });

      const victim = await User.findByPk(victimId);

      //send notification to the victim
      await Notification.create({
        userId: victimId,
        expires_at: new Date(Date.now() + 1000 * 60 * 20), // 5 minutes
        valid: true,
        preChatSessionId: newChatSession.id,
      });

      res.status(201).json({
        victimEmail: victim.email,
        chatSessionId: newChatSession.id,
      });
    } catch (error) {
      next(error);
    }
  }

  // ------------------------------ getNotification ------------------------------
  async getNotification(req: Request, res: Response, next: NextFunction) {
    const userId = req.user_identity?.id as number;

    if (!userId) {
      throw new Error("UserId not found");
    }

    try {
      const notifications = await Notification.findAll({
        where: {
          userId,
          valid: true,
          expires_at: {
            [Op.gt]: new Date(),
          },
        },
      });

      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  }
}

export default new User_Controller();
