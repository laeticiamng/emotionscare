// @ts-nocheck
import { Sentry } from '@/lib/errors/sentry-compat'
import { supabase } from '@/integrations/supabase/client'
import { logger } from '@/lib/logger'

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

/**
 * Mapping des types de session vers les tables spécialisées
 */
const SESSION_TABLE_MAP: Record<SessionType, string> = {
  flash_glow: 'flash_lite_sessions',
  breath: 'breathing_vr_sessions',
  music: 'music_sessions',
  scan: 'user_activity_sessions',
  vr_breath: 'breathing_vr_sessions',
  vr_galaxy: 'vr_sessions',
  ambition: 'user_activity_sessions',
  grit: 'user_activity_sessions',
  bubble: 'bubble_beat_sessions',
  custom: 'user_activity_sessions',
  community: 'user_activity_sessions',
  social_cocon: 'user_activity_sessions',
  auras: 'user_activity_sessions',
  coach: 'ai_coach_sessions',
  story_synth: 'story_synth_sessions',
  activity: 'user_activity_sessions',
  screen_silk: 'screen_silk_sessions',
  weekly_bars: 'user_activity_sessions'
}

/**
 * Créer une session dans la table appropriée
 */
export async function createSession(input: CreateSessionInput): Promise<SessionRecord> {
  const startedAt = typeof performance !== 'undefined' ? performance.now() : Date.now()
  Sentry.addBreadcrumb({
    category: 'session',
    message: 'session:create',
    level: 'info',
    data: { type: input.type }
  })

  const duration = sanitizeDuration(input.duration_sec)
  const moodDelta = sanitizeMoodDelta(input.mood_delta ?? null)
  
  try {
    // Pour les sessions de respiration, utiliser breathing_vr_sessions
    if (input.type === 'breath' || input.type === 'vr_breath') {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('breathing_vr_sessions')
        .insert({
          user_id: user.id,
          pattern: input.meta?.pattern || 'default',
          duration_seconds: duration,
          mood_before: input.meta?.mood_before ?? null,
          mood_after: input.meta?.mood_after ?? null,
          notes: input.meta?.notes ?? null,
          vr_mode: input.type === 'vr_breath',
          started_at: new Date().toISOString()
        })
        .select('id, created_at')
        .single()

      if (error) {
        throw error
      }

      const latency = toLatency(startedAt)
      logger.info('session:breath:create:complete', { type: input.type, latency_ms: latency }, 'SESSION')

      return {
        id: data.id,
        type: input.type,
        duration_sec: duration,
        mood_delta: moodDelta,
        meta: input.meta ?? {},
        created_at: data.created_at
      }
    }

    // Pour les autres types, utiliser user_activity_sessions comme fallback
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('user_activity_sessions')
      .insert({
        user_id: user.id,
        activity_type: input.type,
        duration_minutes: Math.round(duration / 60),
        mood_score: moodDelta ? Math.round((moodDelta + 10) / 2) : null,
        notes: JSON.stringify(input.meta ?? {}),
        started_at: new Date().toISOString()
      })
      .select('id, created_at')
      .single()

    if (error) {
      throw error
    }

    const latency = toLatency(startedAt)
    Sentry.addBreadcrumb({
      category: 'session',
      message: 'session:create:complete',
      level: 'info',
      data: { type: input.type, latency_ms: latency }
    })

    return {
      id: data.id,
      type: input.type,
      duration_sec: duration,
      mood_delta: moodDelta,
      meta: input.meta ?? {},
      created_at: data.created_at
    }
  } catch (error) {
    logger.error('session:create:error', error as Error, 'SESSION')
    Sentry.captureException(error)
    
    // Retourner un objet session factice pour ne pas bloquer l'UI
    return {
      id: `local-${Date.now()}`,
      type: input.type,
      duration_sec: duration,
      mood_delta: moodDelta,
      meta: input.meta ?? {},
      created_at: new Date().toISOString()
    }
  }
}

/**
 * Lister les sessions de l'utilisateur
 */
export async function listMySessions(params: ListMySessionsParams = {}): Promise<SessionRecord[]> {
  const { type, limit = 20, offset = 0 } = params

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return []
    }

    // Pour les sessions de respiration
    if (type === 'breath' || type === 'vr_breath') {
      const { data, error } = await supabase
        .from('breathing_vr_sessions')
        .select('id, pattern, duration_seconds, mood_before, mood_after, notes, vr_mode, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        throw error
      }

      return (data ?? []).map(row => ({
        id: row.id,
        type: row.vr_mode ? 'vr_breath' : 'breath',
        duration_sec: row.duration_seconds ?? 0,
        mood_delta: row.mood_after && row.mood_before ? row.mood_after - row.mood_before : null,
        meta: { pattern: row.pattern, notes: row.notes },
        created_at: row.created_at
      }))
    }

    // Pour les autres types, utiliser user_activity_sessions
    let query = supabase
      .from('user_activity_sessions')
      .select('id, activity_type, duration_minutes, mood_score, notes, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('activity_type', type)
    }

    const safeLimit = Math.max(1, Math.min(200, Math.floor(limit)))
    const safeOffset = Math.max(0, Math.floor(offset))
    query = query.range(safeOffset, safeOffset + safeLimit - 1)

    const { data, error } = await query

    if (error) {
      throw error
    }

    return (data ?? []).map(row => ({
      id: row.id,
      type: (row.activity_type as SessionType) ?? 'custom',
      duration_sec: (row.duration_minutes ?? 0) * 60,
      mood_delta: row.mood_score ? (row.mood_score * 2) - 10 : null,
      meta: row.notes ? JSON.parse(row.notes) : {},
      created_at: row.created_at
    }))
  } catch (error) {
    logger.error('session:list:error', error as Error, 'SESSION')
    return []
  }
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
