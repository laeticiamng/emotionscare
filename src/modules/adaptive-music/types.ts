/**
 * Types pour le module Adaptive Music
 */

export interface AdaptiveMusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  bpm?: number;
  energy: number;
  valence: number;
  focus: MoodPlaylistEnergyFocus;
  instrumentation: string[];
  tags: string[];
}

export type MoodPlaylistEnergyFocus = 
  | 'breathing' 
  | 'flow' 
  | 'release' 
  | 'recovery' 
  | 'uplift' 
  | 'reset';

export interface AdaptiveMusicSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  tracks_played: string[];
  mood_before?: number;
  mood_after?: number;
  preset_id: string;
  intensity: AdaptiveIntensity;
  poms_pre?: PomsValues;
  poms_post?: PomsValues;
  total_duration_seconds: number;
}

export type AdaptiveIntensity = 'soft' | 'moderate' | 'full';

export interface PomsValues {
  tension: 'relachee' | 'ouverte' | 'vigilante';
  fatigue: 'ressourcee' | 'stable' | 'alourdie';
}

export interface AdaptiveMusicStats {
  totalSessions: number;
  totalMinutes: number;
  averageMoodImprovement: number;
  favoritePreset: string;
  favoriteTracks: string[];
  weeklyTrend: { date: string; minutes: number; sessions: number }[];
  presetDistribution: Record<string, number>;
}

export interface AdaptiveMusicPreferences {
  preferInstrumental: boolean;
  preferredEnergy: number;
  preferredValence: number;
  excludedInstruments: string[];
  preferredDuration: number;
  autoAdvance: boolean;
}

export interface AdaptivePreset {
  id: string;
  label: string;
  description: string;
  tone: string;
  accent: string;
  mood: string;
  energyRange: [number, number];
  valenceRange: [number, number];
}

export interface PlaybackState {
  trackId: string | null;
  position: number;
  volume: number;
  isPlaying: boolean;
  presetId: string;
}

export interface MoodPlaylistRequest {
  mood: string;
  intensity: number;
  durationMinutes: number;
  preferences?: {
    includeInstrumental?: boolean;
    excludedArtists?: string[];
  };
  context?: {
    activity?: string;
    timeOfDay?: string;
  };
}

export interface MoodPlaylistResult {
  tracks: AdaptiveMusicTrack[];
  totalDuration: number;
  mood: string;
  generatedAt: string;
}
