export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level?: number;
  progress?: number;
  image?: string;
  category?: string;
  dateEarned?: string;
  isNew?: boolean;
  criteria?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
  progress?: number;
  deadline?: string;
  category?: string;
  difficulty?: string; // Adding this to fix the type error
}
