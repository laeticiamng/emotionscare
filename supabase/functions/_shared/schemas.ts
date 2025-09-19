import { z } from './zod.ts';

export const MBreakSchema = z.object({
  ts: z.string().datetime().optional(),
  hr_pre: z.number().int().min(30).max(220).nullable(),
  hr_post: z.number().int().min(30).max(220).nullable(),
  valence_pre: z.number().min(-1).max(1).nullable(),
  valence_post: z.number().min(-1).max(1).nullable(),
  pss1: z.number().int().min(0).max(4).nullable(),
});

export const BubbleSchema = z.object({
  ts: z.string().datetime().optional(),
  bpm: z.number().int().min(4).max(30),
  smile_amp: z.number().min(0).max(1),
  hr_sdnn: z.number().int().min(0).max(200),
  panas_pa: z.number().int().min(10).max(50),
});

export const SilkSchema = z.object({
  ts: z.string().datetime().optional(),
  hr_1min: z.number().int().min(30).max(220),
  tap_len_ms: z.number().int().min(1).max(8000),
  sms1: z.number().int().min(0).max(4),
});
