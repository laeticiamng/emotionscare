
export interface GamificationStats {
  points: number;
  level: number;
  rank: string;
  badges: Badge[];
  challenges: Challenge[];
  streak: number;
  nextLevel: {
    points: number;
    rewards: string[];
  };
  achievements: Achievement[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'completed' | 'locked' | 'active';
  category: string;
  type?: string;
  progress?: number;
  goal?: number;
  icon?: string;
  startDate?: string;
  endDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  type?: string;
  image?: string;
  date?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  points: number;
  icon?: string;
}

export interface GamificationAction {
  type: 'SCAN' | 'JOURNAL' | 'COACH' | 'VR' | 'CHALLENGE' | 'STREAK' | 'LOGIN';
  data?: any;
}
