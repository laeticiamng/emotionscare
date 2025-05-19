
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
  imageUrl?: string; // For backward compatibility
  image_url?: string; // For backward compatibility
  category?: string;
  earned?: boolean;
  achieved?: boolean; // For backward compatibility
  unlocked?: boolean; // For backward compatibility
  date_earned?: string;
  dateAwarded?: string; // For backward compatibility
  unlockedAt?: string; // For backward compatibility
  unlocked_at?: string; // For backward compatibility
  timestamp?: string; // For backward compatibility
  prerequisites?: string[];
  points?: number;
  user_id?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Challenge {
  id: string;
  name?: string;
  title?: string;
  description: string;
  points: number;
  status: string;
  progress: number;
  category: string;
  completed?: boolean;
  reward?: string | Badge;
  unlocked: boolean;
  type?: string;
  goal?: number;
  total?: number; // For tracking progress total
  totalSteps?: number; // Alternative for total
  difficulty?: string; // For difficulty level
  completions?: number; // For tracking completions
  deadline?: string; // For deadline tracking
}
