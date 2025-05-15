
export interface ScanResult {
  id: string;
  user_id: string;
  timestamp: Date | string;
  emotion_data: EmotionScanData;
  confidence_score: number;
}

export interface EmotionScanData {
  primary_emotion: string;
  intensity: number;
  secondary_emotions?: string[];
  triggers?: string[];
  streak_days?: number;
  points_earned?: number;
}

export interface EmotionGamificationStats {
  total_scans: number;
  streak_days: number;
  points: number;
  level: number;
  next_milestone: number;
  badges_earned: string[];
  highest_emotion: string;
  emotional_balance: number; // 0-100 score of emotional health balance
}

export interface GamificationStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  rank: number;
  streak: number;
  nextLevel: number;
  achievements: any[];
  badges: any[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  challenges: any[];
  recentAchievements: any[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  level: number;
  position: number;
  avatar?: string;
  badges?: any[];
}

export interface TeamOverviewProps {
  teamId: string;
  period?: string;
  anonymized?: boolean;
}

export interface VoiceEmotionScannerProps {
  onScanComplete?: (result: any) => void;
  autoStart?: boolean;
}
