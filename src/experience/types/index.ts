/**
 * Experience Layer — Type Definitions
 * Central types for the immersive experience system.
 */

/* ── Immersion Levels ────────────────────────────────────────── */

export type ImmersionLevel = 0 | 1 | 2 | 3;

/* ── Ambient State ───────────────────────────────────────────── */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type MoodType =
  | 'calm'
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'neutral'
  | 'energetic'
  | 'focused';

export interface AmbientPalette {
  primary: string;
  secondary: string;
  glow: string;
  fog: string;
  background: string;
  particle: string;
}

export interface AmbientState {
  mood: MoodType;
  timeOfDay: TimeOfDay;
  palette: AmbientPalette;
  lightIntensity: number;     // 0-1
  fogDensity: number;         // 0-1
  motionIntensity: number;    // 0-1
  breathPhase: BreathPhase | null;
}

/* ── Device ──────────────────────────────────────────────────── */

export type DeviceTier = 'high' | 'medium' | 'low';

/* ── Transitions ─────────────────────────────────────────────── */

export type TransitionType =
  | 'fade-through'
  | 'depth-shift'
  | 'ambient-morph'
  | 'reveal'
  | 'cut';

export interface TransitionConfig {
  type: TransitionType;
  duration: number;
}

/* ── Breathing ───────────────────────────────────────────────── */

export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

/* ── Page Context ────────────────────────────────────────────── */

export interface PageExperienceConfig {
  immersionLevel: ImmersionLevel;
  transition: TransitionConfig;
  ambientAudio?: string;
  sceneType?: 'hero' | 'breathing' | 'galaxy' | 'nebula';
}

/* ── User Preferences ────────────────────────────────────────── */

export interface ExperiencePreferences {
  reducedMotion: boolean;
  ambientAudioEnabled: boolean;
  maxImmersionLevel: ImmersionLevel;
  masterVolume: number;       // 0-1
}

/* ── Feedback Types ──────────────────────────────────────────── */

export type FeedbackType =
  | 'pulse'
  | 'ripple'
  | 'wave'
  | 'glow'
  | 'achievement'
  | 'level-up'
  | 'insight';

export interface FeedbackEvent {
  type: FeedbackType;
  intensity?: number;         // 0-1, default 0.6
  color?: string;
  position?: { x: number; y: number };
  duration?: number;          // ms
}

/* ── Season Theme ────────────────────────────────────────────── */

export interface SeasonTheme {
  id: string;
  name: string;
  palette: AmbientPalette;
  particleType: 'snow' | 'leaves' | 'petals' | 'stars' | 'fireflies';
  lightTemperature: 'cold' | 'warm' | 'neutral';
}
