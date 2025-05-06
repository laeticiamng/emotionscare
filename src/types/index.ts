
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

// Turn UserRole from type to enum with values, so it can be used in code
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  COACH = 'coach',
  DIRECTION = 'direction',
  EMPLOYE_CLASSIQUE = 'employe_classique',
  ANALYSTE = 'analyste',
  RESPONSABLE_BIEN_ETRE = 'responsable_bien_etre',
  MANAGER = 'manager' // Added for compatibility with useScanPage.ts
}

export interface UserPreferences {
  theme: string;
  fontSize: string;
  accentColor: string;
  backgroundColor?: string; 
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
  source?: string; // Added for compatibility with existing code
  is_confidential?: boolean; // Added for compatibility
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
  text?: string; // Added for compatibility with existing code
}

export interface MoodData {
  date: string;
  value: number;
  originalDate?: Date; // Added for compatibility
  sentiment?: number; // Added for compatibility
  anxiety?: number; // Added for compatibility
  energy?: number; // Added for compatibility
}

export interface Badge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url?: string;
  awarded_at: string;
  icon_url?: string; // Added for compatibility
  threshold?: number; // Added for compatibility
  category?: string; // Added for compatibility
  unlocked?: boolean; // Added for compatibility
}

export interface Report {
  id: string;
  title: string;
  date: string;
  data: any;
  type: string;
  user_id?: string; // Added for compatibility
  summary?: string; // Added for compatibility
  mood_score?: number; // Added for compatibility
  categories?: string[]; // Added for compatibility
  recommendations?: string[]; // Added for compatibility
  metric?: string; // Added for compatibility
  period_start?: string; // Added for compatibility
  period_end?: string; // Added for compatibility
  value?: number; // Added for compatibility
  change_pct?: number; // Added for compatibility
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
  is_audio_only?: boolean; // Added for compatibility
  template_id?: string; // Added for compatibility
  duration?: number; // Added for compatibility with useVRSession.tsx
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
  role: string;
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
