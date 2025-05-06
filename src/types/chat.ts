
export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export type ChatResponse = {
  response: string;
  intent?: string;
  sessionId?: string;
};

export type UserContext = {
  recentEmotions?: string;
  currentScore?: number;
  lastEmotionDate?: string;
};
