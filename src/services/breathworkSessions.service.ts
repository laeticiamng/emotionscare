import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { sessionsService, SessionsAuthError } from './sessions.service';

type BreathworkSessionInsert = Database['public']['Tables']['breathwork_sessions']['Insert'];
type BreathworkSessionRow = Database['public']['Tables']['breathwork_sessions']['Row'];

type NormalizedPayload = {
  duration: number;
  cyclesPlanned: number;
  cyclesCompleted: number;
  density: number;
  cadence: number;
};

export interface BreathworkLogPayload {
  technique: string;
  durationSec: number;
  startedAt: string;
  endedAt: string;
  cyclesPlanned: number;
  cyclesCompleted: number;
  density: number;
  completed: boolean;
  cadence: number;
  soundCues: boolean;
  haptics: boolean;
}

export class BreathworkSessionAuthError extends Error {
  constructor(message = 'Utilisateur non authentifié') {
    super(message);
    this.name = 'BreathworkSessionAuthError';
  }
}

export class BreathworkSessionPersistError extends Error {
  constructor(message = "Impossible d'enregistrer la session de respiration") {
    super(message);
    this.name = 'BreathworkSessionPersistError';
  }
}

const clampDuration = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.min(3600, Math.max(1, Math.round(value)));
};

const clampCycles = (value: number): number => {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(200, Math.max(0, Math.round(value)));
};

const sanitizeDensity = (value: number): number => {
  if (!Number.isFinite(value)) return 0.5;
  return Math.min(1, Math.max(0.1, Number.parseFloat(value.toFixed(2))));
};

const sanitizeCadence = (value: number): number => {
  if (!Number.isFinite(value) || value <= 0) return 6;
  return Number.parseFloat(Math.min(20, Math.max(1, value)).toFixed(2));
};

const normalizePayload = (payload: BreathworkLogPayload): NormalizedPayload => ({
  duration: clampDuration(payload.durationSec),
  cyclesPlanned: clampCycles(payload.cyclesPlanned),
  cyclesCompleted: clampCycles(payload.cyclesCompleted),
  density: sanitizeDensity(payload.density),
  cadence: sanitizeCadence(payload.cadence),
});

const buildInsertPayload = (
  userId: string,
  payload: BreathworkLogPayload,
): BreathworkSessionInsert => ({
  user_id: userId,
  technique_type: payload.technique,
  duration: clampDuration(payload.durationSec),
  target_bpm: null,
  actual_bpm: null,
  coherence_score: null,
  stress_level_before: null,
  stress_level_after: null,
  session_data: {
    started_at: payload.startedAt,
    ended_at: payload.endedAt,
    cycles_planned: clampCycles(payload.cyclesPlanned),
    cycles_completed: clampCycles(payload.cyclesCompleted),
    density: sanitizeDensity(payload.density),
    completed: payload.completed,
    cadence: sanitizeCadence(payload.cadence),
    cues: {
      sound: payload.soundCues,
      haptics: payload.haptics,
    },
  },
});

const logUnifiedSession = async (
  userId: string,
  payload: BreathworkLogPayload,
  normalized: NormalizedPayload,
) => {
  try {
    await sessionsService.logSession({
      type: 'breath',
      durationSec: normalized.duration,
      meta: {
        technique: payload.technique,
        startedAt: payload.startedAt,
        endedAt: payload.endedAt,
        cyclesPlanned: normalized.cyclesPlanned,
        cyclesCompleted: normalized.cyclesCompleted,
        density: normalized.density,
        cadence: normalized.cadence,
        completed: payload.completed,
        cues: {
          sound: payload.soundCues,
          haptics: payload.haptics,
        },
      },
      userId,
    });
  } catch (error) {
    if (error instanceof SessionsAuthError) {
      throw new BreathworkSessionAuthError();
    }

    throw new BreathworkSessionPersistError(
      error instanceof Error ? error.message : "Impossible d'enregistrer la session de respiration",
    );
  }
};

export async function logBreathworkSession(payload: BreathworkLogPayload): Promise<BreathworkSessionRow> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new BreathworkSessionPersistError(authError.message ?? "Erreur d'authentification Supabase");
  }

  if (!user) {
    throw new BreathworkSessionAuthError();
  }

  const normalized = normalizePayload(payload);
  const insertPayload = buildInsertPayload(user.id, payload);

  const { data, error } = await supabase
    .from('breathwork_sessions')
    .insert(insertPayload)
    .select('*')
    .single();

  if (error) {
    throw new BreathworkSessionPersistError(error.message);
  }

  await logUnifiedSession(user.id, payload, normalized);

  return data;
}

export type { BreathworkSessionRow };
