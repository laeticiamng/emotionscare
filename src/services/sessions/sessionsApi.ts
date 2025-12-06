import * as Sentry from '@sentry/react'

import { supabase } from '@/integrations/supabase/client'

export type SessionType =
  | 'flash_glow'
  | 'breath'
  | 'music'
  | 'scan'
  | 'vr_breath'
  | 'vr_galaxy'
  | 'ambition'
  | 'grit'
  | 'bubble'
  | 'custom'
  | 'community'
  | 'social_cocon'
  | 'auras'
  | 'coach'
  | 'story_synth'
  | 'activity'
  | 'screen_silk'
  | 'weekly_bars'

export type SessionRecord = {
  id: string
  type: SessionType
  duration_sec: number
  mood_delta: number | null
  meta: Record<string, unknown>
  created_at: string
}

export type CreateSessionInput = {
  type: SessionType
  duration_sec: number
  mood_delta?: number | null
  meta?: Record<string, unknown>
}

export type ListMySessionsParams = {
  type?: SessionType
  limit?: number
  offset?: number
}

const toLatency = (startedAt: number) => Math.max(0, Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - startedAt))

const sanitizeDuration = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return 0
  }
  return Math.max(0, Math.floor(value))
}

const sanitizeMoodDelta = (value: number | null | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return null
  }
  return Math.max(-10, Math.min(10, Math.round(value)))
}

export async function createSession(input: CreateSessionInput): Promise<SessionRecord> {
  const startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now()
  Sentry.addBreadcrumb({
    category: 'session',
    message: 'session:create',
    level: 'info',
    data: { type: input.type }
  })

  const payload = {
    type: input.type,
    duration_sec: sanitizeDuration(input.duration_sec),
    mood_delta: sanitizeMoodDelta(input.mood_delta ?? null),
    meta: input.meta ?? {}
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert(payload)
    .select('id, type, duration_sec, mood_delta, meta, created_at')
    .single()

  if (error || !data) {
    throw error ?? new Error('session insert failed')
  }

  const latency = toLatency(startedAt)
  Sentry.addBreadcrumb({
    category: 'session',
    message: 'session:create:complete',
    level: 'info',
    data: { type: input.type, latency_ms: latency }
  })

  const moodDeltaFromDb = (() => {
    if (Object.prototype.hasOwnProperty.call(data, 'mood_delta')) {
      return data.mood_delta as number | null | undefined
    }
    return undefined
  })()

  return {
    id: data.id,
    type: data.type as SessionType,
    duration_sec: data.duration_sec ?? payload.duration_sec,
    mood_delta:
      typeof moodDeltaFromDb === 'number'
        ? moodDeltaFromDb
        : moodDeltaFromDb === null
          ? null
          : payload.mood_delta ?? null,
    meta: (data.meta as Record<string, unknown> | null) ?? payload.meta,
    created_at: data.created_at ?? new Date().toISOString()
  }
}

export async function listMySessions(params: ListMySessionsParams = {}): Promise<SessionRecord[]> {
  const { type, limit = 20, offset = 0 } = params
  let query = supabase
    .from('sessions')
    .select('id, type, duration_sec, mood_delta, meta, created_at')
    .order('created_at', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }

  if (Number.isFinite(limit) && Number.isFinite(offset)) {
    const safeLimit = Math.max(1, Math.min(200, Math.floor(limit)))
    const safeOffset = Math.max(0, Math.floor(offset))
    query = query.range(safeOffset, safeOffset + safeLimit - 1)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return (data ?? []).map(row => ({
    id: row.id as string,
    type: row.type as SessionType,
    duration_sec: row.duration_sec ?? 0,
    mood_delta: row.mood_delta ?? null,
    meta: (row.meta as Record<string, unknown> | null) ?? {},
    created_at: row.created_at ?? new Date().toISOString()
  }))
}

export type LogAndJournalInput = {
  type: SessionType
  duration_sec: number
  mood_delta?: number | null
  journalText?: string
  meta?: Record<string, unknown>
}

const mkDefaultText = (input: { type: SessionType; mood_delta?: number | null }) => {
  const label =
    input.type === 'flash_glow'
      ? 'Séance FlashGlow terminée.'
      : input.type === 'breath'
        ? 'Respiration guidée terminée.'
        : input.type === 'music'
          ? 'Voyage sonore clôturé.'
          : input.type === 'scan'
            ? 'Exploration sensorielle finalisée.'
            : input.type === 'story_synth'
              ? 'Conte apaisant consigné.'
              : input.type === 'activity'
                ? 'Moments ressources consignés.'
                : input.type === 'screen_silk'
                  ? 'Pause Screen Silk notée.'
                  : input.type === 'weekly_bars'
                    ? 'Lecture hebdomadaire enregistrée.'
                    : 'Séance terminée.'
  const change = input.mood_delta != null ? "Je me sens un peu différent·e qu'avant." : 'Je prends note de mon ressenti présent.'
  return `${label} ${change}`
}

export async function logAndJournal(params: LogAndJournalInput): Promise<SessionRecord> {
  const session = await createSession({
    type: params.type,
    duration_sec: params.duration_sec,
    mood_delta: params.mood_delta ?? null,
    meta: params.meta
  })

  const text = params.journalText?.trim().length ? params.journalText.trim() : mkDefaultText(params)

  try {
    const startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now()
    const { data: auth } = await supabase.auth.getUser()

    if (auth?.user?.id) {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: auth.user.id,
          content: text,
          date: new Date().toISOString(),
          ai_feedback: null
        })

      if (error) {
        throw error
      }

      const latency = toLatency(startedAt)
      Sentry.addBreadcrumb({
        category: 'journal',
        message: 'journal:auto:insert',
        level: 'info',
        data: { type: params.type, latency_ms: latency }
      })
    }
  } catch (error) {
    Sentry.captureException(error)
  }

  return session
}

