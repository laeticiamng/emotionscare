// @ts-nocheck

// Challenge and badge interfaces
export interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  threshold?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  goal?: string;
  threshold: number;
  completed: boolean;
  category: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  reward?: any;
  imageUrl?: string;
}
