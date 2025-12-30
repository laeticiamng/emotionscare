/**
 * Types pour le module buddies
 */

export interface BuddyProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  timezone?: string;
  age_range?: string;
  interests: string[];
  goals: string[];
  availability_status: 'online' | 'away' | 'busy' | 'offline';
  availability_schedule?: Record<string, any>;
  looking_for: string[];
  languages: string[];
  mood_preference?: string;
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  badges: string[];
  xp_points: number;
  support_score: number;
  response_rate: number;
  last_active_at: string;
  is_verified: boolean;
  is_premium: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface BuddyMatch {
  id: string;
  user_id_1: string;
  user_id_2: string;
  compatibility_score: number;
  match_reason?: string;
  mutual_interests: string[];
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  initiated_by?: string;
  matched_at?: string;
  last_interaction_at?: string;
  interaction_count: number;
  created_at: string;
  // Joined
  buddy_profile?: BuddyProfile;
}

export interface BuddyMessage {
  id: string;
  match_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'activity_invite' | 'system' | 'emoji' | 'voice';
  reply_to_id?: string;
  is_read: boolean;
  read_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  // Joined
  sender_name?: string;
  sender_avatar?: string;
}

export interface BuddyActivity {
  id: string;
  match_id: string;
  created_by: string;
  title: string;
  description?: string;
  activity_type: 'meditation' | 'exercise' | 'reading' | 'gaming' | 'creative' | 'call' | 'challenge';
  scheduled_at?: string;
  duration_minutes: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  xp_reward: number;
  participants_mood_before?: Record<string, number>;
  participants_mood_after?: Record<string, number>;
  outcome_notes?: string;
  completed_at?: string;
  created_at: string;
}

export interface BuddyRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  compatibility_score?: number;
  responded_at?: string;
  expires_at: string;
  created_at: string;
  // Joined
  from_profile?: BuddyProfile;
}

export interface BuddySession {
  id: string;
  match_id: string;
  session_type: 'voice_call' | 'video_call' | 'co_activity' | 'focus_session';
  started_by: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  quality_rating?: number;
  notes?: string;
  xp_earned: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface BuddyStats {
  id: string;
  user_id: string;
  total_buddies: number;
  total_messages_sent: number;
  total_messages_received: number;
  total_activities_completed: number;
  total_sessions: number;
  total_session_minutes: number;
  average_response_time_minutes?: number;
  longest_streak_days: number;
  current_streak_days: number;
  xp_from_buddies: number;
  last_activity_at?: string;
}

export interface BuddyFilters {
  interests?: string[];
  goals?: string[];
  availability?: string;
  location?: string;
  ageRange?: string;
  experienceLevel?: string;
  search?: string;
}

export const BUDDY_INTERESTS = [
  'Méditation', 'Yoga', 'Lecture', 'Musique', 'Jeux', 'Cuisine',
  'Sport', 'Art', 'Nature', 'Voyage', 'Cinéma', 'Photographie',
  'Écriture', 'Danse', 'Randonnée', 'Développement personnel'
];

export const BUDDY_GOALS = [
  'Réduire le stress', 'Améliorer le sommeil', 'Pratiquer la méditation',
  'Faire plus de sport', 'Mieux manger', 'Être plus positif',
  'Développer la créativité', 'Améliorer la concentration', 'Gérer ses émotions'
];

export const LOOKING_FOR_OPTIONS = [
  { value: 'support', label: 'Soutien émotionnel' },
  { value: 'motivation', label: 'Motivation quotidienne' },
  { value: 'accountability', label: 'Partenaire de responsabilité' },
  { value: 'friendship', label: 'Amitié bienveillante' }
];
