//import user model
import Notification from "../models/Notification.model";

//internal imports
import log from "../../utils/logger";

export interface NotificationRepositoryInterface {
  createNotification(
    _newNotification: Partial<Notification>
  ): Promise<Notification>;
  updateNotification(_id: number): Promise<Notification>;
}
