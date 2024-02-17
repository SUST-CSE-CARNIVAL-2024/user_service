//internal imports
import log from "../utils/logger";
import { config } from "../config";

// import all models
import User from "./models/User.model";
import Client from "./models/Client.model";
import Mentor from "./models/Mentor.model";

const isDev = config.ENVIRONMENT === "dev";

const dbInit = async () =>
  Promise.all([
    // sync all models with database
    User.sync({ alter: isDev }),
    Client.sync({ alter: isDev }),
    Mentor.sync({ alter: isDev }),
  ])
    .then(() => {
      log.info("Database synced.");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

export default dbInit;
