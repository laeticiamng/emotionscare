import { z } from 'zod'
import * as Sentry from '@sentry/react'

import { fetchWithRetry } from '@/lib/network/fetchWithRetry'
import { supabase } from '@/integrations/supabase/client'
import { ScanResultSchema, PersistedScanSchema, type ScanResult, type PersistedScan } from '@/modules/emotion-scan/types'

const AnalyzePayloadSchema = z.object({
  text: z.string().min(1),
  lang: z.string().min(2).max(10).default('fr'),
  transcript: z.string().min(1).optional(),
})

const RawLabelSchema = z.union([
  z.string(),
  z.object({ label: z.string(), score: z.number().optional() }),
])

const RawScanResponseSchema = z.object({
  labels: z.array(z.string()).optional(),
  top_labels: z.array(RawLabelSchema).optional(),
  dominantEmotion: z.string().optional(),
  dominant_label: z.string().optional(),
  mood: z.string().optional(),
  valence: z.number().optional(),
  arousal: z.number().optional(),
  mood_score: z.number().optional(),
  emotionalBalance: z.number().optional(),
  emotions: z.record(z.number()).optional(),
  confidence: z.number().optional(),
  insights: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
})
  .passthrough()

type AnalyzePayload = z.input<typeof AnalyzePayloadSchema>
type RawScanResponse = z.infer<typeof RawScanResponseSchema>

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const normaliseLabels = (data: RawScanResponse): string[] => {
  const collected = new Set<string>()

  const direct = data.labels ?? []
  direct.forEach((label) => {
    if (typeof label === 'string' && label.trim()) {
      collected.add(label.trim())
    }
  })

  const topLabels = data.top_labels ?? []
  topLabels.forEach((entry) => {
    if (typeof entry === 'string') {
      if (entry.trim()) {
        collected.add(entry.trim())
      }
      return
    }

    if (entry.label.trim()) {
      collected.add(entry.label.trim())
    }
  })

  if (data.dominantEmotion?.trim()) {
    collected.add(data.dominantEmotion.trim())
  }

  if (data.dominant_label?.trim()) {
    collected.add(data.dominant_label.trim())
  }

  if (data.mood?.trim()) {
    collected.add(data.mood.trim())
  }

  if (!collected.size && data.emotions) {
    Object.entries(data.emotions)
      .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
      .forEach(([label]) => {
        if (label.trim()) {
          collected.add(label.trim())
        }
      })
  }

  return Array.from(collected)
}

const deriveValence = (data: RawScanResponse): number | undefined => {
  if (typeof data.valence === 'number' && Number.isFinite(data.valence)) {
    return clamp(data.valence, -1, 1)
  }

  if (typeof data.emotionalBalance === 'number' && Number.isFinite(data.emotionalBalance)) {
    const normalised = (data.emotionalBalance - 50) / 50
    return clamp(Number(normalised.toFixed(2)), -1, 1)
  }

  return undefined
}

const deriveMoodScore = (data: RawScanResponse): number | undefined => {
  if (typeof data.mood_score === 'number' && Number.isFinite(data.mood_score)) {
    return data.mood_score
  }

  if (typeof data.emotionalBalance === 'number' && Number.isFinite(data.emotionalBalance)) {
    return Math.round(data.emotionalBalance)
  }

  return undefined
}

export const mapScanResponse = (raw: RawScanResponse): ScanResult => {
  const labels = normaliseLabels(raw)

  if (!labels.length) {
    throw new Error('invalid_scan_payload')
  }

  const result = {
    labels,
    valence: deriveValence(raw),
    arousal: typeof raw.arousal === 'number' && Number.isFinite(raw.arousal)
      ? clamp(Number(raw.arousal.toFixed(2)), -1, 1)
      : undefined,
    mood_score: deriveMoodScore(raw),
    raw,
  }

  return ScanResultSchema.parse(result)
}

const linkAbortSignals = (timeoutMs: number, externalSignal?: AbortSignal) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(new DOMException('Timeout', 'AbortError')), timeoutMs)

  let cleanupExternal: (() => void) | undefined
  if (externalSignal) {
    if (externalSignal.aborted) {
      clearTimeout(timeoutId)
      controller.abort(externalSignal.reason ?? new DOMException('Aborted', 'AbortError'))
    } else {
      const onAbort = () => {
        clearTimeout(timeoutId)
        controller.abort(externalSignal.reason ?? new DOMException('Aborted', 'AbortError'))
      }
      externalSignal.addEventListener('abort', onAbort, { once: true })
      cleanupExternal = () => externalSignal.removeEventListener('abort', onAbort)
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId)
      cleanupExternal?.()
    },
  }
}

export interface AnalyzeEmotionInput {
  text: string
  lang?: string
  transcript?: string
  signal?: AbortSignal
}

export async function analyzeEmotion({ text, lang = 'fr', transcript, signal }: AnalyzeEmotionInput): Promise<ScanResult> {
  const payload: AnalyzePayload = AnalyzePayloadSchema.parse({
    text: text.trim(),
    lang,
    transcript: transcript?.trim() ? transcript.trim() : undefined,
  })

  const startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now()
  const { signal: mergedSignal, cleanup } = linkAbortSignals(15_000, signal)

  try {
    Sentry.addBreadcrumb({
      category: 'scan',
      message: 'scan:start',
      level: 'info',
      data: {
        lang: payload.lang,
        hasTranscript: Boolean(payload.transcript),
      },
    })

    const response = await fetchWithRetry('/functions/v1/ai-emotion-analysis', {
      method: 'POST',
      signal: mergedSignal,
      timeoutMs: 15_000,
      retries: 2,
      retryDelayMs: 700,
      json: payload,
      payloadSchema: AnalyzePayloadSchema,
    })

    if (!response.ok) {
      throw new Error(`analysis_failed_${response.status}`)
    }

    const json = await response.json()
    const parsed = RawScanResponseSchema.safeParse(json)
    if (!parsed.success) {
      throw new Error('invalid_scan_payload')
    }

    const result = mapScanResponse(parsed.data)
    const duration = Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - startedAt)

    Sentry.addBreadcrumb({
      category: 'scan',
      message: 'scan:success',
      level: 'info',
      data: {
        durationMs: duration,
        label: result.labels[0],
      },
    })

    return result
  } catch (error) {
    const duration = Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - startedAt)

    if (error instanceof DOMException && error.name === 'AbortError') {
      Sentry.addBreadcrumb({
        category: 'scan',
        message: 'scan:aborted',
        level: 'warning',
        data: { durationMs: duration },
      })
      throw error
    }

    Sentry.addBreadcrumb({
      category: 'scan',
      message: 'scan:error',
      level: 'error',
      data: {
        durationMs: duration,
        reason: error instanceof Error ? error.name : 'unknown',
      },
    })
    Sentry.captureException(error)

    if (error instanceof Error) {
      throw error
    }

    throw new Error('analysis_failed')
  } finally {
    cleanup()
  }
}

export async function persistScan(result: ScanResult): Promise<PersistedScan> {
  const validated = ScanResultSchema.parse(result)

  const { data: auth } = await supabase.auth.getUser()
  const userId = auth?.user?.id

  if (!userId) {
    throw new Error('user_not_authenticated')
  }

  const { data, error } = await supabase
    .from('emotion_scans')
    .insert({
      user_id: userId,
      payload: validated,
      mood_score: validated.mood_score ?? null,
    })
    .select('id, created_at, payload, mood_score')
    .single()

  if (error) {
    Sentry.captureException(error)
    throw new Error(error.message || 'persist_failed')
  }

  const parsed = PersistedScanSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error('invalid_persisted_scan')
  }

  return parsed.data
}

const ScanRowSchema = PersistedScanSchema

export async function fetchRecentScans(limit = 5): Promise<PersistedScan[]> {
  const { data, error } = await supabase
    .from('emotion_scans')
    .select('id, created_at, payload, mood_score')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(error.message || 'fetch_recent_failed')
  }

  const parsed = z.array(ScanRowSchema).safeParse(data ?? [])
  if (!parsed.success) {
    throw new Error('invalid_scan_records')
  }

  return parsed.data
}

export async function fetchScanHistory(limit = 10): Promise<PersistedScan[]> {
  return fetchRecentScans(limit)
}
