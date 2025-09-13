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
export const OnboardingPrefs = z.object({
  musicRelax: z.boolean().optional(),
  defaultDurationMin: z.number().int().min(5).max(60).optional(),
  favoriteModule: z.string().optional(), // optionnel si redirection vers un module favori
});
export type OnboardingPrefs = z.infer<typeof OnboardingPrefs>;
