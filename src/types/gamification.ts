
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlock_date?: string | Date;
  progress?: number;
  total?: number;
  category: 'journal' | 'mindfulness' | 'community' | 'streak' | 'exploration';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration_days: number;
  start_date?: string | Date;
  end_date?: string | Date;
  status: 'not_started' | 'active' | 'completed' | 'failed';
  progress: number;
  reward_points: number;
  category: 'mindfulness' | 'social' | 'journaling' | 'emotion' | 'physical';
}

export interface UserProgress {
  user_id: string;
  xp: number;
  level: number;
  next_level_xp: number;
  total_journal_entries: number;
  total_mindfulness_minutes: number;
  longest_streak_days: number;
  current_streak_days: number;
  achievements_unlocked: number;
  total_achievements: number;
  challenges_completed: number;
}
