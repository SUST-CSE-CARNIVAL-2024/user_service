//import user model
import Mentor from "../models/Mentor.model";

//internal imports
import log from "../../utils/logger";

export interface MentorRepositoryInterface {
  createMentor(_newUser: Partial<Mentor>): Promise<Mentor>;
  updateMentorEmotionalState(
    _id: number,
    emotionalState: JSON
  ): Promise<Mentor>;
}

class MentorRepository implements MentorRepositoryInterface {
  async createMentor(_newUser: Partial<Mentor>) {
    try {
      const newUser = await Mentor.create(_newUser);
      return newUser;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  async updateMentorEmotionalState(
    _id: number,
    expertise_emotionalState: JSON
  ) {
    try {
      const mentor = await Mentor.findByPk(_id);

      if (!Mentor) throw new Error("Mentor not found");

      const updatedMentor = await mentor.update({ expertise_emotionalState });

      return updatedMentor;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }
}

export default new MentorRepository();
