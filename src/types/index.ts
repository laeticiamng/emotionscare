
// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  avatar?: string;
  image?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  team_id?: string;
  department?: string;
  position?: string;
  last_active?: string;
  is_verified?: boolean;
}

// Emotion related types
export interface EmotionResult {
  emotion: string;
  confidence?: number;
  score?: number;
  feedback?: string;
  recommendations?: string[];
  transcript?: string;
  timestamp?: string;
  emojis?: string;
}

// VR related types
export interface VRSessionTemplate {
  id: string;
  template_id: string;
  theme: string;
  title: string;
  duration: number;
  preview_url: string;
  description: string;
  is_audio_only: boolean;
}
