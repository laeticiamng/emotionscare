import { z } from "zod";

export const FlashGlowPrefs = z.object({
  intensity: z.number().min(0).max(10).optional(),
  enabled: z.boolean().optional(),
});
export type FlashGlowPrefs = z.infer<typeof FlashGlowPrefs>;
export const AdaptiveMusicPrefs = z.object({
  style: z.string().optional(),
  durationMin: z.number().int().min(1).max(60).optional(),
  autoLoop: z.boolean().optional(),
  defaultVolume: z.number().min(0).max(1).optional()
});
export type AdaptiveMusicPrefs = z.infer<typeof AdaptiveMusicPrefs>;
export const BossGritPrefs = z.object({
  defaultMs: z.number().int().min(30000).max(3600000).optional(), // 30s..60min
  cues: z.boolean().optional(),   // bip + haptics
  tasks: z.array(z.object({ id: z.string(), label: z.string(), done: z.boolean().optional() })).optional()
});
export type BossGritPrefs = z.infer<typeof BossGritPrefs>;
export const BreathConstellationPrefs = z.object({
  pattern: z
    .enum(["coherence-5-5", "4-7-8", "box-4-4-4-4", "triangle-4-6-8"])
    .optional(),
  cycles: z.number().int().min(4).max(16).optional(),
  density: z.number().min(0.3).max(1).optional(),
  soundCues: z.boolean().optional(),
  haptics: z.boolean().optional(),
});
export type BreathConstellationPrefs = z.infer<typeof BreathConstellationPrefs>;
export const BubbleBeatPrefs = z.object({}).optional();
export type BubbleBeatPrefs = z.infer<typeof BubbleBeatPrefs>;
export const CoachPrefs = z.object({
  mode: z.enum(["soft","boost"]).optional(),   // intensité des suggestions
  dailyGoalMin: z.number().int().min(1).max(60).optional()
});
export type CoachPrefs = z.infer<typeof CoachPrefs>;
export const EmotionScanPrefs = z.object({}).optional();
export type EmotionScanPrefs = z.infer<typeof EmotionScanPrefs>;
export const FlashGlowUltraPrefs = z.object({
  bpm: z.number().int().min(2).max(12).optional(),       // sûr pour le visuel
  intensity: z.number().min(0.2).max(1).optional(),
  theme: z.enum(["cyan","violet","amber","emerald"]).optional(),
  shape: z.enum(["ring","full"]).optional(),
  durationMin: z.number().int().min(1).max(10).optional(),
  audioCues: z.boolean().optional()
});
export type FlashGlowUltraPrefs = z.infer<typeof FlashGlowUltraPrefs>;
export const JournalPrefs = z.object({}).optional();
export type JournalPrefs = z.infer<typeof JournalPrefs>;
export const MoodMixerPrefs = z.object({}).optional();
export type MoodMixerPrefs = z.infer<typeof MoodMixerPrefs>;
export const ScanPrefs = z.object({}).optional();
export type ScanPrefs = z.infer<typeof ScanPrefs>;
export const StorySynthPrefs = z.object({
  defaultGenre: z.enum(["calme","aventure","poetique","mysterieux","romance"]).optional(),
  defaultLength: z.number().int().min(3).max(7).optional(),
  defaultStyle: z.enum(["sobre","lyrique","journal","dialogue"]).optional(),
  ambientAudio: z.boolean().optional()
}).optional();
export type StorySynthPrefs = z.infer<typeof StorySynthPrefs>;

export const StoryRecord = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  title: z.string().optional(),
  content: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  mood: z.string().optional()
}).optional();
export type StoryRecord = z.infer<typeof StoryRecord>;

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

export const JournalEntry = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(), // ISO
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  mood: z.string().optional(),
  deleted: z.boolean().optional()
}).optional();

export type JournalEntry = z.infer<typeof JournalEntry>;
export const EmotionScanData = z.object({
  // clés I-PANAS-SF — toutes optionnelles pour compat ascendante
  active: z.number().int().min(1).max(5).optional(),
  determined: z.number().int().min(1).max(5).optional(),
  attentive: z.number().int().min(1).max(5).optional(),
  inspired: z.number().int().min(1).max(5).optional(),
  alert: z.number().int().min(1).max(5).optional(),
  upset: z.number().int().min(1).max(5).optional(),
  hostile: z.number().int().min(1).max(5).optional(),
  ashamed: z.number().int().min(1).max(5).optional(),
  nervous: z.number().int().min(1).max(5).optional(),
  afraid: z.number().int().min(1).max(5).optional(),
  // scores dérivés (facultatifs)
  pa: z.number().optional(),
  na: z.number().optional(),
  balance: z.number().optional()
}).optional();

export type EmotionScanData = z.infer<typeof EmotionScanData>;
