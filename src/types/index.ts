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
  theme: "light" | "dark" | "pastel" | "system";
  fontSize: "small" | "medium" | "large";
  accentColor: string;
  backgroundColor?: "default" | "blue" | "mint" | "coral"; 
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
  source?: string; 
  is_confidential?: boolean;
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
  originalDate?: Date;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

export interface Badge {
  id: string;
  user_id: string;
  name: string;
  description: string;
  image_url?: string;
  awarded_at: string;
  icon_url?: string;
  threshold?: number;
  category?: string;
  unlocked?: boolean;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  data: any;
  type: string;
  user_id?: string;
  summary?: string;
  mood_score?: number;
  categories?: string[];
  recommendations?: string[];
  metric?: string;
  period_start?: string;
  period_end?: string;
  value?: number;
  change_pct?: number;
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
  title?: string;  // Adding title property
  recommended_mood?: string; // Adding recommended_mood property
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
  is_audio_only?: boolean;
  template_id?: string;
  duration?: number;
  completed?: boolean;
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

// Challenge Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  requirements?: string;
  icon_url?: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  date: string;
  completed: boolean;
}
