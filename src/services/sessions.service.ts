import { supabase } from '@/integrations/supabase/client';

export class SessionsAuthError extends Error {
  constructor(message = "Utilisateur non authentifié") {
    super(message);
    this.name = 'SessionsAuthError';
  }
}

interface SessionLogPayload {
  type: string;
  durationSec: number;
  moodBefore?: number | null;
  moodAfter?: number | null;
  moodDelta?: number | null;
  meta?: Record<string, unknown>;
  userId?: string;
}

interface SessionRecord {
  id: string;
  created_at: string;
  type: string;
  duration_sec: number | null;
  mood_delta: number | null;
  meta: Record<string, unknown> | null;
}

class SessionsService {
  private async resolveUserId(explicitUserId?: string): Promise<string> {
    if (explicitUserId) {
      return explicitUserId;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message || "Impossible de récupérer l'utilisateur authentifié");
    }

    if (!data?.user) {
      throw new SessionsAuthError();
    }

    return data.user.id;
  }

  private normalizeMood(value?: number | null): number | null {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return null;
    }

    return Math.max(0, Math.min(100, Math.round(value)));
  }

  async logSession(payload: SessionLogPayload): Promise<SessionRecord | null> {
    try {
      const userId = await this.resolveUserId(payload.userId);

      const safeDuration = Math.max(0, Math.round(payload.durationSec));
      const moodBefore = this.normalizeMood(payload.moodBefore ?? null);
      const moodAfter = this.normalizeMood(payload.moodAfter ?? null);
      const hasExplicitDelta = typeof payload.moodDelta === 'number' && !Number.isNaN(payload.moodDelta);
      const computedDelta = hasExplicitDelta
        ? Math.round(payload.moodDelta)
        : moodBefore !== null && moodAfter !== null
          ? Math.round(moodAfter - moodBefore)
          : null;

      const meta = {
        ...payload.meta,
        moodBefore: payload.meta && 'moodBefore' in payload.meta ? (payload.meta as any).moodBefore : moodBefore,
        moodAfter: payload.meta && 'moodAfter' in payload.meta ? (payload.meta as any).moodAfter : moodAfter,
      } as Record<string, unknown>;

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: userId,
          type: payload.type,
          duration_sec: safeDuration,
          mood_delta: computedDelta,
          meta,
        })
        .select('id, created_at, type, duration_sec, mood_delta, meta')
        .single();

      if (error) {
        throw new Error(error.message || "Échec de l'enregistrement de la session");
      }

      return data as SessionRecord;
    } catch (error) {
      if (error instanceof SessionsAuthError) {
        throw error;
      }

      console.error('sessionsService.logSession error', error);
      throw error instanceof Error ? error : new Error('Échec inattendu lors de la création de la session');
    }
  }
}

export const sessionsService = new SessionsService();

export type { SessionRecord, SessionLogPayload };
