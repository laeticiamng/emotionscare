
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'active' | 'completed' | 'failed' | 'ongoing' | string;
  category: string;
  progress: number;
  goal: number;
  completed: boolean;
  dueDate?: string;
  deadline?: string;
  reward?: string;
  icon?: string;
  name?: string; // For compatibility
  difficulty?: string;
  tags?: string[];
  completions?: number;
  total?: number;
  totalSteps?: number;
}

export type ChallengeType = 'daily' | 'weekly' | 'monthly' | 'special' | 'onetime';

export interface UserChallenge {
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface ChallengeCompletion {
  challenge: Challenge;
  completedAt: string;
  reward: number;
  bonuses?: {
    name: string;
    points: number;
  }[];
}

export interface ChallengeCollection {
  daily: Challenge[];
  weekly: Challenge[];
  monthly: Challenge[];
  special: Challenge[];
}
