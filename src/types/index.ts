
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  onboarded: boolean;
  anonymity_code: string;
  emotional_score?: number;
  avatar?: string;
  image?: string;
  preferences?: UserPreferences;
  joined_at?: string;
}

export type UserRole = 'admin' | 'user' | 'coach' | 'direction' | 'employe_classique' | 'analyste' | 'responsable_bien_etre';

export interface UserPreferences {
  theme: string;
  fontSize: string;
  accentColor: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface Emotion {
  id: string;
  user_id: string;
  text?: string;
  emojis?: string;
  date: string;
  score?: number;
  audio_url?: string | null;
  ai_feedback?: string | null;
  emotion?: string;
  confidence?: number;
  transcript?: string;
  intensity?: number;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  transcript?: string;
  feedback?: string;
  intensity?: number;
  score?: number;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  date: string;
  ai_feedback?: string;
}

export interface MoodData {
  date: string;
  value: number;
}

export interface Badge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url?: string;
  awarded_at: string;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  data: any;
  type: string;
}

export interface VRSessionTemplate {
  template_id: string;
  theme: string;
  duration: number;
  preview_url: string;
  description?: string;
  is_audio_only?: boolean;
  audio_url?: string;
  completion_rate?: number;
}

export interface VRSession {
  id: string;
  user_id: string;
  date: string;
  duration_seconds: number;
  location_url: string;
  heart_rate_before?: number;
  heart_rate_after?: number;
  emotional_impact?: number;
}

// Invitation Types
export interface Invitation {
  id: string;
  email: string;
  role: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
}

export interface InvitationFormData {
  email: string;
  role: UserRole;
}

export interface InvitationStats {
  sent: number;
  pending: number;
  accepted: number;
  expired: number;
}

// Invitation Verification Response
export interface InvitationVerificationResult {
  valid: boolean;
  message?: string;
  email?: string;
  role?: string;
}
