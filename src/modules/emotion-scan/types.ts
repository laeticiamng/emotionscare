import { z } from 'zod'

export const ScanResultSchema = z.object({
  labels: z.array(z.string().trim().min(1)).min(1),
  valence: z.number().min(-1).max(1).optional(),
  arousal: z.number().min(-1).max(1).optional(),
  mood_score: z.number().optional(),
  raw: z.unknown().optional(),
})

export type ScanResult = z.infer<typeof ScanResultSchema>

export const PersistedScanSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  mood_score: z.number().nullable().optional(),
  payload: ScanResultSchema,
})

export type PersistedScan = z.infer<typeof PersistedScanSchema>
