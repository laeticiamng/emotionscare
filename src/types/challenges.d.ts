
export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  category: string;
  goal: number;
  points?: number;
  progress?: number;
  completed?: boolean;
  status?: string;
  totalSteps?: number;
}

export interface ChallengeCollection {
  daily: Challenge[];
  weekly: Challenge[];
  monthly: Challenge[];
  special: Challenge[];
}
