
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
  privacy?: 'public' | 'private' | 'friends';
}

export interface VRSessionTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  theme: string;
  is_audio_only: boolean;
  preview_url: string;
  audio_url: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  benefits: string[];
  emotions: string[];
  popularity: number;
}
