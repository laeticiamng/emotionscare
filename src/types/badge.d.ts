
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  unlocked: boolean;
  level: number;
  category: string;
  tier?: string;
  icon?: string;
  earned?: boolean;
  progress?: number;
  threshold?: number;
  completed?: boolean;
  rarity?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  goal: number;
  category: string;
  completed: boolean;
  status: string;
  name?: string;
  totalSteps?: number;
  difficulty?: string;
  deadline?: string;
}
