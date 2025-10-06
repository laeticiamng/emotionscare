// @ts-nocheck
/**
 * Types pour la génération musicale émotionnelle
 */

export interface EmotionState {
  valence: number;
  arousal: number;
  dominantEmotion?: string;
  labels?: string[];
  confidence?: number;
}

export interface SunoMusicConfig {
  customMode: boolean;
  instrumental: boolean;
  title: string;
  style: string;
  prompt?: string;
  model: 'V3_5' | 'V4' | 'V4_5' | 'V4_5PLUS' | 'V5';
  negativeTags?: string;
  vocalGender?: 'm' | 'f' | null;
  styleWeight?: number;
  weirdnessConstraint?: number;
  audioWeight?: number;
  durationSeconds?: number;
  callBackUrl?: string;
}

export interface SunoGenerationResult {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tracks?: SunoTrack[];
}

export interface SunoTrack {
  id: string;
  title: string;
  audioUrl?: string;
  streamUrl?: string;
  duration?: number;
  model: string;
  style: string;
}

export interface SunoCallback {
  taskId: string;
  callbackType: 'text' | 'first' | 'complete' | 'error';
  status: string;
  data?: {
    title?: string;
    audioUrl?: string;
    streamUrl?: string;
    duration?: number;
    model?: string;
    style?: string;
  };
}

export interface MusicGenerationSession {
  id: string;
  userId: string;
  taskId: string;
  emotionState: EmotionState;
  emotionBadge: string;
  sunoConfig: SunoMusicConfig;
  result?: SunoGenerationResult;
  createdAt: Date;
  completedAt?: Date;
}
