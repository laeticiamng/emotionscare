
export interface VRSessionTemplate {
  id: string;
  title: string;
  description: string;
  duration: number;
  emotion_target: string;
  thumbnail_url?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface VRSession {
  id: string;
  template_id: string;
  user_id: string;
  started_at: Date;
  completed_at?: Date;
  duration_seconds: number;
  emotional_state_before?: string;
  emotional_state_after?: string;
  notes?: string;
}

export interface VRSessionStats {
  total_sessions: number;
  total_duration_minutes: number;
  most_used_template: string;
  average_emotional_improvement: number;
}
