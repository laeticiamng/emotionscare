
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
  category?: string;
  earned?: boolean;
  date_earned?: string;
  prerequisites?: string[];
  points?: number;
  user_id?: string; // Added missing property
}

export interface Challenge {
  id: string;
  name: string;
  title?: string;
  description: string;
  points: number;
  status: string;
  progress: number;
  category: string;
  completed?: boolean;
  reward?: string;
  unlocked?: boolean;
  type?: string; // Added missing property
  goal?: number; // Added missing property
}
