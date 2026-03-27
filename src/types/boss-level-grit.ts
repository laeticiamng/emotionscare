// @ts-nocheck
export interface GritChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'novice' | 'warrior' | 'master' | 'legend';
  category: 'mental' | 'physical' | 'emotional' | 'spiritual';
  duration: number; // en minutes
  xpReward: number;
  completionRate: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  streakRequired?: number;
  prerequisites?: string[];
  tags: string[];
  createdAt: Date;
  completedAt?: Date;
}

export interface GritLevel {
  id: string;
  name: string;
  description: string;
  minXp: number;
  maxXp: number;
  color: string;
  icon: string;
  benefits: string[];
  unlockedFeatures: string[];
}

export interface GritSession {
  id: string;
  challengeId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  difficulty: number; // 1-10
  completionScore: number; // 0-100
  emotionalState: {
    before: string;
    after: string;
    confidence: number;
  };
  insights: string[];
  nextRecommendations: string[];
}

export interface GritStats {
  totalXp: number;
  currentLevel: GritLevel;
  nextLevel: GritLevel;
  completedChallenges: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  totalSessionTime: number;
  categoriesProgress: {
    mental: number;
    physical: number;
    emotional: number;
    spiritual: number;
  };
  achievements: GritAchievement[];
}

export interface GritAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'completion' | 'score' | 'time' | 'category';
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  reward: {
    xp: number;
    features?: string[];
  };
}

export interface GritMindset {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  affirmations: string[];
  visualizations: string[];
  breathingPatterns: string[];
  applicableContexts: string[];
}

export interface BossLevelGritContextType {
  stats: GritStats | null;
  currentChallenge: GritChallenge | null;
  activeSession: GritSession | null;
  availableChallenges: GritChallenge[];
  mindsets: GritMindset[];
  isLoading: boolean;
  startChallenge: (challengeId: string) => Promise<void>;
  completeChallenge: (score: number, insights?: string[]) => Promise<void>;
  updateProgress: (progress: number) => void;
  getRecommendations: () => GritChallenge[];
  unlockNextLevel: () => Promise<boolean>;
}