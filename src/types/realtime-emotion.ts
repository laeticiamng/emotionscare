// Types pour l'analyse émotionnelle temps réel

export interface EmotionScore {
  label: string;
  confidence: number;
  timestamp: number;
}

export interface VisionEmotionResult {
  label: string;
  scores: Record<string, number>;
  confidence: number;
  timestamp: number;
}

export interface VoiceEmotionResult {
  prosody: {
    valence: number;
    arousal: number;
  };
  emotions: Record<string, number>;
  confidence: number;
  timestamp: number;
}

export interface TextEmotionResult {
  label: string;
  sentiment: number; // -1 to 1
  confidence: number;
  timestamp: number;
}

export interface FusedMoodResult {
  mood_index: number; // 0-100
  label: string;
  confidences: {
    voice: number;
    vision: number;
    text: number;
  };
  timestamp: number;
  latency_ms: number;
}

export interface EmotionState {
  vision: VisionEmotionResult | null;
  voice: VoiceEmotionResult | null;
  text: TextEmotionResult | null;
  fused: FusedMoodResult | null;
  isActive: boolean;
  latency: {
    vision: number;
    voice: number;
    text: number;
    fusion: number;
  };
}
