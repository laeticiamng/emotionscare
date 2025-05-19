
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
  unlocked?: boolean; // Added for backward compatibility
  threshold?: number; // Added for backward compatibility
  level?: number; // Added for backward compatibility
  earned?: boolean; // Added for backward compatibility
  earnedDate?: string; // Added for backward compatibility
  category?: string; // Added for backward compatibility
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
  isCompleted?: boolean; // Additional backward compatibility
  status?: 'completed' | 'failed' | 'locked' | 'ongoing' | 'active' | 'available' | 'in-progress';
}
