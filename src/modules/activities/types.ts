/**
 * Types pour le module activities
 */

export type ActivityCategory = 'relaxation' | 'physical' | 'creative' | 'social' | 'mindfulness' | 'nature';
export type ActivityDifficulty = 'easy' | 'medium' | 'hard';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  duration_minutes: number;
  difficulty: ActivityDifficulty;
  icon?: string;
  tags: string[];
  benefits: string[];
  instructions: string[];
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_id: string;
  completed_at: string;
  rating?: number;
  notes?: string;
  mood_before?: number;
  mood_after?: number;
}

export interface ActivityFilters {
  category?: ActivityCategory;
  difficulty?: ActivityDifficulty;
  maxDuration?: number;
  search?: string;
}

export interface ActivitiesState {
  status: 'idle' | 'loading' | 'success' | 'error';
  activities: Activity[];
  favorites: string[];
  history: UserActivity[];
  filters: ActivityFilters;
  error: string | null;
}
