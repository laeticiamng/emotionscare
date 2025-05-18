
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
  achievedAt?: Date | string;
  unlockedAt?: Date | string; // Added for backward compatibility
  unlocked_at?: Date | string; // Added for backward compatibility
  progress?: number;
  total?: number;
  rarity?: string;
  completed?: boolean;
  imageUrl?: string; // Added for backward compatibility
  image_url?: string; // Added for backward compatibility
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
  
  // Adding properties for backwards compatibility
  name?: string;
  difficulty?: string;
  completions?: number;
  goal?: number;
  totalSteps?: number;
}
