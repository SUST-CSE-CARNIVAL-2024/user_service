//import user model
import Client from "../models/User.model";

//internal imports
import log from "../../utils/logger";

export interface ClientRepositoryInterface {
  createClient(_newUser: Partial<Client>): Promise<Client>;
  updateClientEmotionalState(
    _id: number,
    emotionalState: JSON
  ): Promise<Client>;
}

class ClientRepository implements ClientRepositoryInterface {
  async createClient(_newUser: Partial<Client>) {
    try {
      const newUser = await Client.create(_newUser);
      return newUser;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  async updateClientEmotionalState(_id: number, emotionalState: JSON) {
    try {
      const client = await Client.findByPk(_id);

      if (!client) throw new Error("Client not found");

      const updatedClient = await client.update({ emotionalState });

      return updatedClient;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }
}

export default new ClientRepository();
