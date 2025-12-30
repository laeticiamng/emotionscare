/**
 * Types pour le module group-sessions
 */

export interface GroupSession {
  id: string;
  title: string;
  description?: string;
  category: string;
  session_type: 'open' | 'private' | 'moderated';
  host_id: string;
  max_participants: number;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  cover_image?: string;
  tags: string[];
  is_recurring: boolean;
  recurrence_rule?: string;
  meeting_url?: string;
  recording_url?: string;
  xp_reward: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined fields
  host_name?: string;
  host_avatar?: string;
  participant_count?: number;
  is_registered?: boolean;
}

export interface GroupSessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  status: 'registered' | 'attended' | 'absent' | 'cancelled';
  role: 'participant' | 'co-host' | 'moderator';
  joined_at?: string;
  left_at?: string;
  mood_before?: number;
  mood_after?: number;
  feedback?: string;
  rating?: number;
  xp_earned: number;
  created_at: string;
  // Joined fields
  user_name?: string;
  user_avatar?: string;
}

export interface GroupSessionMessage {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'system' | 'reaction' | 'resource';
  reply_to_id?: string;
  is_pinned: boolean;
  is_hidden: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  // Joined fields
  user_name?: string;
  user_avatar?: string;
  reactions?: GroupSessionReaction[];
}

export interface GroupSessionReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface GroupSessionResource {
  id: string;
  session_id: string;
  uploaded_by: string;
  title: string;
  resource_type: 'link' | 'file' | 'image' | 'video' | 'audio';
  url: string;
  description?: string;
  download_count: number;
  created_at: string;
}

export interface GroupSessionCategory {
  id: string;
  name: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  order_index: number;
  is_active: boolean;
}

export interface GroupSessionFilters {
  category?: string;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  hostId?: string;
  isRegistered?: boolean;
}

export interface CreateSessionInput {
  title: string;
  description?: string;
  category: string;
  session_type: 'open' | 'private' | 'moderated';
  max_participants?: number;
  scheduled_at: string;
  duration_minutes?: number;
  tags?: string[];
  cover_image?: string;
  is_recurring?: boolean;
  recurrence_rule?: string;
}
