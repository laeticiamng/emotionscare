
export interface Badge {
  id: string;
  name: string;
  description: string;
  image?: string;
  imageUrl?: string;
  unlocked: boolean;
  achieved?: boolean;
  earnedAt?: string;
  earned?: boolean;
  category: string;
  icon?: string | React.ReactNode;
  level?: number;
  progress?: number;
  threshold?: number;
  tier?: string;
}
