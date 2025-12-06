import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type BreathworkSessionInsert = Database['public']['Tables']['breathwork_sessions']['Insert'];
type BreathworkSessionRow = Database['public']['Tables']['breathwork_sessions']['Row'];
type ActivitySessionInsert = Database['public']['Tables']['user_activity_sessions']['Insert'];
type ActivitySessionRow = Database['public']['Tables']['user_activity_sessions']['Row'];

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

const computeCompletionScore = (cyclesPlanned: number, cyclesCompleted: number, completed: boolean): number | null => {
  if (!Number.isFinite(cyclesPlanned) || cyclesPlanned <= 0) {
    return completed ? 5 : 3;
  }

  const ratio = Math.max(0, Math.min(1, cyclesCompleted / cyclesPlanned));
  if (ratio >= 0.95) return 5;
  if (ratio >= 0.75) return 4;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
};

const buildActivityPayload = (
  userId: string,
  payload: BreathworkLogPayload,
  insert: BreathworkSessionInsert,
): ActivitySessionInsert => ({
  user_id: userId,
  activity_type: "breath_constellation",
  duration_seconds: insert.duration ?? clampDuration(payload.durationSec),
  completed_at: payload.endedAt,
  mood_before: null,
  mood_after: null,
  satisfaction_score: computeCompletionScore(payload.cyclesPlanned, payload.cyclesCompleted, payload.completed),
  session_data: {
    technique: payload.technique,
    cycles_planned: insert.session_data?.cycles_planned ?? clampCycles(payload.cyclesPlanned),
    cycles_completed: insert.session_data?.cycles_completed ?? clampCycles(payload.cyclesCompleted),
    density: insert.session_data?.density ?? sanitizeDensity(payload.density),
    cadence: insert.session_data?.cadence ?? sanitizeCadence(payload.cadence),
    completed: payload.completed,
    cues: insert.session_data?.cues ?? {
      sound: payload.soundCues,
      haptics: payload.haptics,
    },
    started_at: payload.startedAt,
    ended_at: payload.endedAt,
  },
});

export interface BreathworkSessionLogResult {
  session: BreathworkSessionRow;
  activity: ActivitySessionRow;
}

export async function logBreathworkSession(payload: BreathworkLogPayload): Promise<BreathworkSessionLogResult> {
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

  const insertPayload = buildInsertPayload(user.id, payload);

  const { data, error } = await supabase
    .from('breathwork_sessions')
    .insert(insertPayload)
    .select('*')
    .single();

  if (error) {
    throw new BreathworkSessionPersistError(error.message);
  }

  const activityPayload = buildActivityPayload(user.id, payload, insertPayload);

  const { data: activityData, error: activityError } = await supabase
    .from('user_activity_sessions')
    .insert(activityPayload)
    .select('*')
    .single();

  if (activityError || !activityData) {
    throw new BreathworkSessionPersistError(activityError?.message ?? 'Impossible de journaliser la session');
  }

  return {
    session: data,
    activity: activityData,
  };
}

export type { BreathworkSessionRow };
