
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  points: number;
  completed?: boolean;
  progress?: number;
  assigned_date?: string;
  due_date?: string;
  completion_date?: string;
  emotion_target?: string;
  category?: string;
}

export type ChallengeType = 
  | 'mindfulness' 
  | 'physical' 
  | 'emotional' 
  | 'social' 
  | 'learning' 
  | 'productivity' 
  | 'gratitude';

export interface UserChallenge {
  id: string;
  challenge_id: string;
  user_id: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'failed';
  assigned_date: string;
  completed_date?: string;
  progress: number;
  notes?: string;
}

export interface ChallengeCompletion {
  challenge_id: string;
  user_id: string;
  date: string;
  points_earned: number;
  feedback?: string;
  mood_before?: number;
  mood_after?: number;
}
