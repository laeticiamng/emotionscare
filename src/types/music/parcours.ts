// Types for EC-MUSIC-PARCOURS-XL system

export interface ParcoursPreset {
  key: string;
  title: string;
  emotion: string;
  duration_min: number;
  duration_max: number;
  music: {
    bpm: string | number;
    mode: string;
    progression?: string;
    time_signature?: string;
    style: string;
    instruments: string[];
    prompt: string;
  };
  segments: ParcoursSegmentConfig[];
  tcm: {
    points: string[];
    warnings: string[];
    aromatherapy: string;
  };
  immersion: {
    light: string;
    sounds: string[];
    props: string[];
  };
  affirmations: string[];
}

export interface ParcoursSegmentConfig {
  title: string;
  start: number;
  end: number;
  type: string;
  voiceover: string;
}

export interface ParcoursRun {
  id: string;
  user_id: string;
  preset_key: string;
  started_at: string;
  ended_at?: string;
  status: 'created' | 'generating' | 'ready' | 'playing' | 'completed' | 'failed';
  suds_start?: number;
  suds_mid?: number;
  suds_end?: number;
  notes_encrypted?: string;
  metadata?: Record<string, any>;
}

export interface ParcoursSegment {
  id: string;
  run_id: string;
  segment_index: number;
  title: string;
  start_seconds: number;
  end_seconds: number;
  suno_task_id?: string;
  preview_url?: string;
  final_url?: string;
  storage_path?: string;
  lyrics?: string;
  voiceover_text?: string;
  voiceover_url?: string;
  status: 'pending' | 'generating' | 'first' | 'complete' | 'failed';
  created_at: string;
}

export interface SunoGenerateRequest {
  customMode: boolean;
  instrumental: boolean;
  title: string;
  style: string;
  model: string;
  durationSeconds: number;
  callBackUrl?: string;
  prompt?: string;
  lyrics?: string;
}

export interface SunoExtendRequest {
  audioId: string;
  continueAt: number;
  model: string;
  callBackUrl?: string;
}

export interface SunoCallbackPayload {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  callbackType: 'first' | 'complete';
  audioUrl?: string;
  streamUrl?: string;
  lyrics?: string;
  error?: string;
}

export interface HumeEmotionDetection {
  emotion: string;
  confidence: number;
  valence: number;
  arousal: number;
}

export interface ParcoursPlayerState {
  isPlaying: boolean;
  currentSegmentIndex: number;
  currentTime: number;
  totalDuration: number;
  volume: number;
}

export interface EmotionBadge {
  label: string;
  color: string;
  icon: string;
}
