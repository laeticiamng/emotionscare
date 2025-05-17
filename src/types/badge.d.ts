
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  category?: string;
  tier?: string;
  earned?: boolean;
  threshold?: number;
  progress?: number;
  completed?: boolean;
  icon?: string;
  level?: number;
  unlocked?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points?: number;
  progress?: number;
  completed?: boolean;
  totalSteps?: number;
  difficulty?: string;
  deadline?: string;
  goal?: string;
  status?: string;
  category?: string;
}
