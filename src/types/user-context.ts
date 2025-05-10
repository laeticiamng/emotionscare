
export interface UserContext {
  id?: string;
  name?: string;
  preferences?: Record<string, any>;
  recentEmotions?: string[];
  recentActivities?: string[];
  userHistory?: {
    lastInteraction?: string;
    frequentTopics?: string[];
  };
}
