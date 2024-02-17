import Client from "../database/models/Client.model";

import { ClientEmotionalState_JSON } from "../schemas/emotional_state.schema";

export interface ClientServiceInterface {
  addNewClient(clientInput: Partial<Client>): Promise<Client>;
  updateClientEmotionalState(
    clientId: number,
    emotionalState: ClientEmotionalState_JSON
  ): Promise<Client>;
}

//

class ClientService implements ClientServiceInterface {
  async addNewClient(clientInput: Partial<Client>): Promise<Client> {
    try {
      const newClient = await Client.create(clientInput);
      return newClient;
    } catch (error) {
      throw error;
    }
  }

  async updateClientEmotionalState(
    clientId: number,
    emotionalState: ClientEmotionalState_JSON
  ): Promise<Client> {
    try {
      const client = await Client.findByPk(clientId);

      if (!client) throw new Error("Client not found");

      const updatedClient = await client.update({ emotionalState });

      return updatedClient;
    } catch (error) {
      throw error;
    }
  }
}

export default new ClientService();
