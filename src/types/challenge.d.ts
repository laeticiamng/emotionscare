
export interface Challenge {
  id: string;
  title: string;
  name: string;
  description: string;
  progress: number;
  completed: boolean;
  status: string;
  points: number;
  difficulty: string;
  category: string;
  tags: string[];
  goal: string;
  totalSteps?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  points: number;
  rank: number;
  badges: number;
  streak: number;
}
