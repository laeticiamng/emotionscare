import { z } from "zod";

export const FlashGlowPrefs = z.object({
  intensity: z.number().min(0).max(10).optional(),
  enabled: z.boolean().optional(),
});
export type FlashGlowPrefs = z.infer<typeof FlashGlowPrefs>;
export const AdaptiveMusicPrefs = z.object({}).optional();
export type AdaptiveMusicPrefs = z.infer<typeof AdaptiveMusicPrefs>;
export const BossGritPrefs = z.object({}).optional();
export type BossGritPrefs = z.infer<typeof BossGritPrefs>;
export const BreathConstellationPrefs = z.object({}).optional();
export type BreathConstellationPrefs = z.infer<typeof BreathConstellationPrefs>;
export const BubbleBeatPrefs = z.object({}).optional();
export type BubbleBeatPrefs = z.infer<typeof BubbleBeatPrefs>;
export const CoachPrefs = z.object({}).optional();
export type CoachPrefs = z.infer<typeof CoachPrefs>;
export const EmotionScanPrefs = z.object({}).optional();
export type EmotionScanPrefs = z.infer<typeof EmotionScanPrefs>;
export const FlashGlowUltraPrefs = z.object({}).optional();
export type FlashGlowUltraPrefs = z.infer<typeof FlashGlowUltraPrefs>;
export const JournalPrefs = z.object({}).optional();
export type JournalPrefs = z.infer<typeof JournalPrefs>;
export const MoodMixerPrefs = z.object({}).optional();
export type MoodMixerPrefs = z.infer<typeof MoodMixerPrefs>;
export const ScanPrefs = z.object({}).optional();
export type ScanPrefs = z.infer<typeof ScanPrefs>;
export const StorySynthPrefs = z.object({}).optional();
export type StorySynthPrefs = z.infer<typeof StorySynthPrefs>;

export const AudioPrefs = z.object({
  masterVolume: z.number().min(0).max(1).optional(),
  crossfadeMs: z.number().int().min(0).max(5000).optional(),
  haptics: z.boolean().optional(),
  loopDefault: z.boolean().optional()
});
export type AudioPrefs = z.infer<typeof AudioPrefs>;
export const OnboardingPrefs = z.object({
  musicRelax: z.boolean().optional(),
  defaultDurationMin: z.number().int().min(5).max(60).optional(),
  favoriteModule: z.string().optional(), // optionnel si redirection vers un module favori
});
export type OnboardingPrefs = z.infer<typeof OnboardingPrefs>;

export const SessionEvent = z.object({
  id: z.string().optional(),
  module: z.string().optional(),           // ex: "mood-mixer"
  startedAt: z.string().optional(),        // ISO
  endedAt: z.string().optional(),          // ISO
  durationSec: z.number().int().optional(),// durée estimée
  mood: z.string().optional(),             // info libre
  score: z.number().optional(),            // score brut si dispo
  meta: z.record(z.any()).optional()
});
export type SessionEvent = z.infer<typeof SessionEvent>;

export const ScoreSnapshot = z.object({
  total: z.number().optional(),
  streakDays: z.number().optional(),
  level: z.number().optional(),
  badges: z.array(z.string()).optional(),
  byDay: z.array(z.object({
    date: z.string(), value: z.number()
  })).optional()
});
export type ScoreSnapshot = z.infer<typeof ScoreSnapshot>;

export const Achievement = z.object({
  key: z.string().optional(),
  label: z.string().optional(),
  earnedAt: z.string().optional()
});
export type Achievement = z.infer<typeof Achievement>;
export const Feedback = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  message: z.string().optional(),
});
export type Feedback = z.infer<typeof Feedback>;
