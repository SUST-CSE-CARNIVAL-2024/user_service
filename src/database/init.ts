//internal imports
import log from "../utils/logger";
import { config } from "../config";

// import all models
import User from "./models/User.model";
import Client from "./models/Client.model";
import Mentor from "./models/Mentor.model";
import PreChatSesstion from "./models/PreChatSession.model";
import Notification from "./models/Notification.model";
import ChatSesstion from "./models/ChatSession.model";

import deleteOlderNotification, {
  stopChatSession_and_updateEmotionalState,
} from "./models/periodical_updates";

const isDev = config.ENVIRONMENT === "dev";

const dbInit = async () =>
  Promise.all([
    // sync all models with database
    User.sync({ alter: isDev }),
    Client.sync({ alter: isDev }),
    Mentor.sync({ alter: isDev }),
    PreChatSesstion.sync({ alter: isDev }),
    Notification.sync({ alter: isDev }),
    ChatSesstion.sync({ alter: isDev }),
  ])
    .then(() => {
      log.info("Database synced.");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

deleteOlderNotification.start();
stopChatSession_and_updateEmotionalState.start();

export default dbInit;
