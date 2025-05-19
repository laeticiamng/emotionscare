export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  rank: number;
  badges?: number;
  achievements?: number;
  level?: number;
  streak?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  points: number;
  completed?: boolean;
  progress?: number;
  deadline?: string;
  createdAt: string;
  target?: number;
  // Add any other properties used in mockData
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earned: boolean;
  earnedAt?: string;
  category?: string;
  level?: number;
  // Add any other properties used in mockData
}
