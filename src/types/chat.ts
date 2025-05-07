
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
