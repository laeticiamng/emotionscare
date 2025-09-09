export interface UserMetrics {
  dailyActiveTime: number;
  weeklyActiveTime: number;
  monthlyActiveTime: number;
  totalSessions: number;
  averageSessionTime: number;
  lastActivity: string;
  engagementScore: number;
}

export interface EmotionMetrics {
  dominantEmotion: string;
  emotionDistribution: Record<string, number>;
  emotionTrends: Array<{
    date: string;
    emotion: string;
    confidence: number;
  }>;
  moodStability: number;
  improvementScore: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  errorRate: number;
  crashRate: number;
  userSatisfaction: number;
}

export interface PredictionModel {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  lastTrained: string;
  features: string[];
  targetVariable: string;
}

export interface Prediction {
  id: string;
  modelId: string;
  emotion: string;
  confidence: number;
  timestamp: string;
  source: string;
  context?: string;
  probability: Record<string, number>;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  event: string;
  properties: Record<string, any>;
  timestamp: string;
  sessionId: string;
}