export interface MoodProfile {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  energyLevel: number; // 1-10
  valence: number; // 1-10 (positive/negative)
  tempo: number; // BPM
  dominantEmotions: string[];
  musicalGenres: string[];
  instruments: string[];
  soundscapes: string[];
  createdAt: Date;
  lastUsed?: Date;
}

export interface MoodPresetBlend {
  joy: number;
  calm: number;
  energy: number;
  focus: number;
}

export interface MoodPresetRecord {
  id: string;
  slug: string | null;
  userId: string | null;
  name: string;
  description: string | null;
  icon: string | null;
  gradient: string | null;
  tags: string[];
  softness: number;
  clarity: number;
  blend: MoodPresetBlend;
  createdAt: string;
  updatedAt: string;
}

export interface MoodMix {
  id: string;
  name: string;
  description: string;
  userId: string;
  baseMood: MoodProfile;
  mixedMoods: MoodProfile[];
  duration: number; // en minutes
  tracks: MoodTrack[];
  aiGeneratedElements: AIElement[];
  settings: MixSettings;
  stats: MixStats;
  status: 'creating' | 'ready' | 'playing' | 'paused' | 'completed';
  createdAt: Date;
  lastPlayed?: Date;
  isFavorite: boolean;
  shareUrl?: string;
}

export interface MoodTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  energy: number;
  valence: number;
  tempo: number;
  duration: number; // en secondes
  audioUrl: string;
  coverArt: string;
  aiGenerated: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
  volume: number;
  position: number; // position dans le mix
}

export interface AIElement {
  id: string;
  type: 'transition' | 'ambient' | 'effect' | 'narration' | 'breathing';
  content: string;
  audioUrl?: string;
  duration: number;
  position: number;
  settings: {
    volume: number;
    fadeIn: number;
    fadeOut: number;
    loop?: boolean;
  };
}

export interface MixSettings {
  crossfadeDuration: number; // en secondes
  autoTransition: boolean;
  binaural: boolean;
  spatialAudio: boolean;
  adaptiveVolume: boolean;
  emotionalProgression: 'stable' | 'ascending' | 'descending' | 'wave';
  includeNarration: boolean;
  includeBreathing: boolean;
  includeNatureSounds: boolean;
  targetDuration: number; // en minutes
}

export interface MixStats {
  totalPlays: number;
  totalListenTime: number; // en minutes
  averageRating: number;
  completionRate: number; // pourcentage
  emotionalImpact: {
    before: string[];
    after: string[];
    improvement: number;
  };
  peakEngagement: number; // timestamp du moment le plus engageant
  skipPoints: number[]; // timestamps où l'utilisateur a sauté
}

export interface MoodMixerSession {
  id: string;
  userId: string;
  currentMix: MoodMix | null;
  startTime: Date;
  endTime?: Date;
  initialMood: string;
  targetMood: string;
  currentMood: string;
  moodProgression: MoodProgressPoint[];
  interactions: SessionInteraction[];
  biometrics?: BiometricData;
}

export interface MoodProgressPoint {
  timestamp: Date;
  mood: string;
  energy: number;
  valence: number;
  confidence: number;
  method: 'self-report' | 'ai-detection' | 'biometric';
}

export interface SessionInteraction {
  timestamp: Date;
  type: 'play' | 'pause' | 'skip' | 'like' | 'dislike' | 'mood-change' | 'volume-change';
  data: any;
}

export interface BiometricData {
  heartRate?: number[];
  stressLevel?: number[];
  skinConductance?: number[];
  brainwaves?: {
    alpha: number[];
    beta: number[];
    theta: number[];
    delta: number[];
  };
}

export interface MoodMixerPreferences {
  userId: string;
  favoriteGenres: string[];
  preferredInstruments: string[];
  avoidedGenres: string[];
  maxMixDuration: number;
  autoPlay: boolean;
  adaptiveRecommendations: boolean;
  biometricIntegration: boolean;
  privacyLevel: 'low' | 'medium' | 'high';
  notificationsEnabled: boolean;
  socialSharing: boolean;
}

export interface MoodMixerContextType {
  currentSession: MoodMixerSession | null;
  availableMoods: MoodProfile[];
  myMixes: MoodMix[];
  recommendedMixes: MoodMix[];
  isCreating: boolean;
  isPlaying: boolean;
  currentMix: MoodMix | null;
  preferences: MoodMixerPreferences | null;
  
  // Actions
  startSession: (initialMood: string, targetMood?: string) => Promise<void>;
  createMix: (baseMood: MoodProfile, settings: Partial<MixSettings>) => Promise<MoodMix>;
  playMix: (mixId: string) => Promise<void>;
  pauseMix: () => void;
  stopMix: () => void;
  updateMoodProgress: (mood: string, energy: number, valence: number) => void;
  saveMix: (mix: MoodMix) => Promise<void>;
  deleteMix: (mixId: string) => Promise<void>;
  shareMix: (mixId: string) => Promise<string>;
  rateMix: (mixId: string, rating: number) => Promise<void>;
  
  // AI Functions
  generateMixFromMood: (mood: string, preferences?: Partial<MixSettings>) => Promise<MoodMix>;
  getRecommendations: (currentMood: string) => Promise<MoodMix[]>;
  analyzeListeningPatterns: () => Promise<any>;
  predictOptimalDuration: (mood: string) => number;
}