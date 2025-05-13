
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  completed: boolean;
  progress: number;
  category: string;
  points: number;
  deadline?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  dateEarned: string;
}

export interface GamificationStats {
  level: number;
  points: number;
  nextLevelPoints: number;
  badges: Badge[];
  challengesCompleted: number;
  streak: number;
}
