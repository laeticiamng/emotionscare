
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
  achievedAt?: Date | string;
  progress?: number;
  total?: number;
  rarity?: string;
  completed?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  progress: number;
  total: number;
  completed: boolean;
  deadline?: Date;
  category?: string;
}
