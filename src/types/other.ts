
export interface MoodData {
  id?: string;
  mood: string;
  intensity?: number;
  date?: string;
  value?: number;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
  originalDate?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: any[];
  description?: string;
}

export interface EmotionalData {
  id?: string;
  user_id?: string;
  timestamp?: string;
  emotion?: string;
  intensity?: number;
  created_at?: string;
  updated_at?: string;
  context?: string;
  source?: string;
}
