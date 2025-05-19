
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url: string;
  cover?: string;
  emotion?: string;
  category?: string;
  tags?: string[];
  audioUrl?: string; // Added to fix the error in use-audio.ts
}

export interface AudioPlaylist {
  id: string;
  name: string;
  tracks: AudioTrack[];
  createdAt: string;
  updatedAt?: string;
  coverImage?: string;
}

export interface AudioProcessorProps {
  onResult: (result: any) => void;
  isRecording?: boolean;
}

// Types for emotional data in audio context
export interface MoodData {
  emotion: string;
  intensity: number;
  timestamp: string;
}

export interface EmotionalData {
  userId: string;
  emotions: MoodData[];
  averageIntensity: number;
  dominantEmotion: string;
}
