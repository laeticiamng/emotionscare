import { z } from "zod";

export const FlashGlowPrefs = z.object({
  intensity: z.number().min(0).max(10).optional(),
  enabled: z.boolean().optional(),
});
export type FlashGlowPrefs = z.infer<typeof FlashGlowPrefs>;
