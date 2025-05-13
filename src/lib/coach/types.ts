
export interface CoachEmotionData {
  emotion: string;
  score: number;
}

export interface MusicRecommendation {
  title: string;
  genre: string;
  description: string;
}

export interface CoachServiceInterface {
  askQuestion: (question: string) => Promise<string>;
  getRecommendations: (userId: string) => Promise<string[]>;
  processEmotions: (emotions: any[]) => Promise<{
    primaryEmotion: string;
    averageScore: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  triggerCoachEvent: (
    eventType: 'scan_complete' | 'trend_change' | 'low_score' | 'reminder',
    data: any
  ) => Promise<{
    message: string;
    recommendations: string[];
  }>;
  getMusicRecommendation: (emotion: string) => Promise<MusicRecommendation>;
}
