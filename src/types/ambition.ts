export interface AmbitionLevel {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'boss';
  points: number;
  completed: boolean;
}

export interface AmbitionGame {
  id: string;
  userId: string;
  currentLevel: number;
  totalPoints: number;
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface AmbitionRun {
  id: string;
  userId: string;
  levelId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  score: number;
}