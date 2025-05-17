export interface Challenge {
  id: string;
  title: string;
  name?: string;
  description: string;
  points?: number;
  progress: number;
  completed: boolean;
  goal: string | number;
  totalSteps?: number;
  status: 'completed' | 'failed' | 'locked' | 'ongoing' | 'active' | 'available' | 'in-progress';
  category: string;
  difficulty?: string;
  tags?: string[];
  deadline?: string;
  completions?: number;
  total?: number;
}

export interface ChallengeProgress {
  challengeId: string;
  userId: string;
  progress: number;
  completed: boolean;
  updatedAt: string;
}

export interface ChallengeGroup {
  title: string;
  challenges: Challenge[];
}

export interface ChallengeAward {
  type: 'badge' | 'points' | 'level' | 'item';
  value: number | string;
  description: string;
}
