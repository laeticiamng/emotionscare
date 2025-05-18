
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  intensity: number;
  category: string;
  tags: string[];
  thumbnail: string;
  created_at: string;
  updated_at?: string;
  author_id?: string;
  author_name?: string;
  average_rating?: number;
  completion_count?: number;
  music_track_id?: string;
  is_premium?: boolean;
}

export interface VRSessionHistory {
  id: string;
  user_id: string;
  template_id: string;
  start_time: string;
  end_time?: string;
  duration?: number;
  completed: boolean;
  heart_rate_start?: number;
  heart_rate_end?: number;
  calories_burned?: number;
  focus_score?: number;
  stress_level_before?: number;
  stress_level_after?: number;
  emotional_state_before?: string;
  emotional_state_after?: string;
  notes?: string;
}

export interface VRTemplateFilter {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  duration?: 'short' | 'medium' | 'long';
  tags?: string[];
  sort?: 'popular' | 'newest' | 'rating' | 'duration';
}
