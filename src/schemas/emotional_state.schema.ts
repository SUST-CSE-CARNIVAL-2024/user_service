export interface ClientEmotionalState_JSON {
  Depression: number; // Indicators include persistent sadness, lack of interest in activities, feelings of hopelessness, and changes in sleep patterns.

  Anxiety: number; //Look for signs of excessive worry, restlessness, difficulty concentrating, and sleep disturbances.

  Stress: number; //Symptoms might include feeling overwhelmed, irritability, fatigue, and difficulty managing thoughts or worries.

  Contentment: number; // Indicators include a general sense of satisfaction with life, positive engagement with activities, and stable mood.

  Happiness: number; //Look for expressions of joy, optimism, energy, and satisfaction with life's circumstances.

  Anger: number; //Signs might include irritability, frustration with situations or people, and a short temper.

  Fatigue: number; //Indicators include overwhelming tiredness, lack of energy, and a general sense of being physically and emotionally drained.

  Neutral: number; //If the responses don't strongly indicate any particular emotional state, or if the person seems to be functioning without significant emotional disturbance
}

export interface ProfessionalExpertise_JSON {
  DepressionManagement: number; // Expertise in managing depression through various therapeutic techniques and interventions.

  AnxietyManagement: number; // Proficiency in treating anxiety disorders, including generalized anxiety, panic attacks, and social anxiety.

  StressReduction: number; // Skills in stress management techniques, relaxation methods, and coping strategies for reducing stress levels.

  EnhancingContentment: number; // Ability to guide clients towards achieving a sense of contentment and life satisfaction through positive psychology and other methods.

  PromotingHappiness: number; // Expertise in interventions that increase happiness, joy, and optimism, possibly including positive psychology practices.

  AngerManagement: number; // Competence in helping clients manage and express anger in healthy ways, including conflict resolution skills.

  FatigueAlleviation: number; // Specialization in addressing causes of mental and physical fatigue and providing strategies for energy restoration.

  MaintainingNeutrality: number; // Ability to support clients in achieving and maintaining a neutral, balanced emotional state, especially in cases of emotional dysregulation.
}
