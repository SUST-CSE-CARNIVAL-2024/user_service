//external imports
import cron from "node-cron";
import { Op } from "sequelize";

import Notification from "./Notification.model";
import log from "../../utils/logger";
import PreChatSesstion from "./PreChatSession.model";
import ChatSesstion from "./ChatSession.model";
import axios from "axios";
import User from "./User.model";
import Client from "./Client.model";

//delete older notification every 5 minutes
const deleteOlderNotification = cron.schedule("*/10 * * * *", async () => {
  try {
    const result = await Notification.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date(),
        },
      },
    });
    log.debug(result, "result");

    //delete preChatSession
    const result2 = await PreChatSesstion.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date(),
        },
      },
    });
    log.debug(result2, "result2");
  } catch (error) {
    log.error(error, "error");
  }
});

export const stopChatSession_and_updateEmotionalState = cron.schedule(
  "*/10 * * * *",
  async () => {
    try {
      const outDatedChatSessions = await ChatSesstion.findAll({
        where: {
          expires_at: {
            [Op.lt]: new Date(),
          },
        },
      });

      for (const chatSession of outDatedChatSessions) {
        const victimId = chatSession.victimId;
        chatSession.expired = true;
        await chatSession.save();

        //! notify chat processing service
        const victim = await User.findByPk(victimId);
        const response = await axios.post(
          "http://localhost:8082/api/afterChatUpdate",
          {
            username: victim.email,
          }
        );

        let updatedEmotionalState = JSON.parse(response.data);
        let currentTempEmotionalState = chatSession.temporary_emotionalState;

        //! update the emotional state
        Object.keys(updatedEmotionalState).forEach((key) => {
          if (currentTempEmotionalState.hasOwnProperty(key)) {
            //perform the weighted average in which the weight of the currentTempEmotionalState is 0.2 and the weight of the updatedEmotionalState is 0.8
            updatedEmotionalState[key] =
              0.8 * updatedEmotionalState[key] -
              0.2 * currentTempEmotionalState[key];
          }
        });

        //! update the emotional state
        chatSession.temporary_emotionalState = updatedEmotionalState;
        await chatSession.save();

        //! update user emotional state
        const client = await Client.findOne({
          where: {
            userId: victimId,
          },
        });

        let currentEmotionalState = client.emotionalState;
        Object.keys(updatedEmotionalState).forEach((key) => {
          if (currentEmotionalState.hasOwnProperty(key)) {
            //perform the weighted average in which the weight of the currentEmotionalState is 0.2 and the weight of the updatedEmotionalState is 0.8
            updatedEmotionalState[key] =
              0.8 * updatedEmotionalState[key] -
              0.2 * currentEmotionalState[key];
          }
        });

        client.emotionalState = updatedEmotionalState;
        await client.save();
      }
    } catch (error) {
      log.error(error, "error");
      throw error;
    }
  }
);

export default deleteOlderNotification;
