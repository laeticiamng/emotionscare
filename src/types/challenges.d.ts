
export interface Challenge {
  id: string;
  title?: string;
  name: string;
  description: string;
  progress: number;
  goal: number; // Propriété requise
  completed?: boolean;
  status?: 'active' | 'completed' | 'failed' | 'expired' | string;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | string;
  category?: string;
  tags?: string[];
  startedAt?: string;
  completedAt?: string;
  expiresAt?: string;
  icon?: string;
  rewards?: {
    points?: number;
    badges?: string[];
    items?: string[];
  };
  requirements?: {
    description: string;
    progress: number;
    goal: number;
    completed?: boolean;
  }[];
}

export interface ChallengeCollection {
  userId: string;
  challenges: Challenge[];
  totalCompleted: number;
  totalActive: number;
  recentlyCompleted: Challenge[];
}
