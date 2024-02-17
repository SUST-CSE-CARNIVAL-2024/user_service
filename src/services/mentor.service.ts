import Mentor from "../database/models/Mentor.model";

import { ProfessionalExpertise_JSON } from "../schemas/emotional_state.schema";

export interface MentorServiceInterface {
  addNewMentor(MentorInput: Partial<Mentor>): Promise<Mentor>;
  updateMentorEmotionalState(
    clientId: number,
    emotionalState: ProfessionalExpertise_JSON
  ): Promise<Mentor>;
}

//

class MentorService implements MentorServiceInterface {
  async addNewMentor(mentorInput: Partial<Mentor>): Promise<Mentor> {
    try {
      const newMentor = await Mentor.create(mentorInput);
      return newMentor;
    } catch (error) {
      throw error;
    }
  }

  async updateMentorEmotionalState(
    mentorId: number,
    expertise_emotionalState: ProfessionalExpertise_JSON
  ): Promise<Mentor> {
    try {
      const mentor = await Mentor.findByPk(mentorId);

      if (!mentor) throw new Error("Mentor not found");

      const updatedMentor = await mentor.update({
        expertise_emotionalState,
      });

      return updatedMentor;
    } catch (error) {
      throw error;
    }
  }
}

export default new MentorService();
