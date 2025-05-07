
export interface UserContext {
  recentEmotions: string | null;
  currentScore: number | null;
  lastEmotionDate?: string;
}

export interface ChatResponse {
  response: string;
  intent?: string;
  sessionId?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
