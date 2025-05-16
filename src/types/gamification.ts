
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name or URL
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category?: string;
  dateUnlocked?: string;
}

export interface GamificationStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  longestStreak: number;
  completedChallenges: number;
  totalChallenges: number;
  unlockedBadges: number;
  totalBadges: number;
  points?: number; // Added for UserDashboard
  badges?: number; // Added for AdminDashboard
  activeUsersPercent?: number; // Added for GamificationSummaryCard
  completionRate?: number; // Added for GamificationSummaryCard
}

export interface Challenge {
  id: string;
  name: string;
  title?: string; // Added for ChallengesList
  description: string;
  reward: number;
  progress: number;
  goal: number;
  completed: boolean;
  category: string;
  endDate?: string;
  deadline?: string; // Added for ChallengesList
  status?: 'active' | 'completed' | 'expired'; // Added for ChallengesList
  difficulty?: 'easy' | 'medium' | 'hard'; // Added for ChallengesList
  completions?: number; // Added for ChallengesList
  points?: number; // Added for ChallengesList
  total?: number; // Added for ChallengesList
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  available: boolean;
  category: string;
  unlocked: boolean;
}
