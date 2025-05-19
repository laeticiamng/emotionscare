
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
  imageUrl?: string; // Pour compatibilité
  image_url?: string; // Pour compatibilité
  category?: string;
  earned?: boolean;
  achieved?: boolean; // Pour compatibilité
  unlocked?: boolean; // Pour compatibilité
  date_earned?: string;
  dateAwarded?: string; // Pour compatibilité
  unlockedAt?: string; // Pour compatibilité
  unlocked_at?: string; // Pour compatibilité
  timestamp?: string; // Pour compatibilité
  prerequisites?: string[];
  points?: number;
  user_id?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  level?: number; // Pour compatibilité
  rarity?: string; // Pour compatibilité
  threshold?: number; // Pour compatibilité avec progress/threshold pattern
  progress?: number;
  completed?: boolean;
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
  total?: number; // Pour tracking progress total
  totalSteps?: number; // Alternative pour total
  difficulty?: string; // Pour niveau de difficulté
  completions?: number; // Pour tracking completions
  deadline?: string; // Pour tracking deadline
  isCompleted?: boolean; // Pour compatibilité
}
