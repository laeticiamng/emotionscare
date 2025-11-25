/**
 * Coach Sessions API Service
 * Service frontend pour se connecter aux endpoints API des sessions de coaching
 */

import { supabase } from '@/integrations/supabase/client';
import { API_URL } from '@/lib/env';
import { fetchWithRetry } from '@/lib/network/fetchWithRetry';
import { logger } from '@/lib/logger';

const API_BASE = API_URL?.replace(/\/$/, '') || '';

interface CoachSessionCreatePayload {
  title?: string;
  coach_mode?: 'empathetic' | 'motivational' | 'analytical';
  topic?: string;
  mood_before?: number;
}

interface CoachSessionUpdatePayload {
  title?: string;
  topic?: string;
  mood_after?: number;
  satisfaction_rating?: number;
  duration_minutes?: number;
}

interface CoachMessagePayload {
  session_id: string;
  sender: 'user' | 'coach';
  content: string;
  message_type?: string;
  emotions_detected?: Record<string, unknown>;
}

interface CoachSessionRecord {
  id: string;
  user_id: string;
  title: string;
  coach_mode: string;
  topic?: string;
  mood_before?: number;
  mood_after?: number;
  satisfaction_rating?: number;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

interface CoachMessageRecord {
  id: string;
  session_id: string;
  user_id: string;
  sender: string;
  content: string;
  message_type: string;
  emotions_detected?: Record<string, unknown>;
  created_at: string;
}

interface CoachAnalytics {
  total_sessions: number;
  total_messages: number;
  average_mood_improvement: number | null;
  average_satisfaction: number | null;
  total_duration_minutes: number;
  mode_distribution: Record<string, number>;
}

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }
  return headers;
}

export const coachSessionsApi = {
  /**
   * Créer une nouvelle session de coaching
   */
  async createSession(payload: CoachSessionCreatePayload = {}): Promise<CoachSessionRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/coach/sessions`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to create coach session', { status: response.status, error }, 'coachSessionsApi');
      throw new Error(error?.error?.message || `Failed to create session: ${response.status}`);
    }

    const result: ApiResponse<CoachSessionRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to create session');
    }

    return result.data;
  },

  /**
   * Lister les sessions de coaching
   */
  async listSessions(filters: { limit?: number; offset?: number } = {}): Promise<CoachSessionRecord[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.offset) params.set('offset', String(filters.offset));

    const url = `${API_BASE}/api/v1/coach/sessions${params.toString() ? `?${params}` : ''}`;
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to list coach sessions', { status: response.status }, 'coachSessionsApi');
      throw new Error(`Failed to list sessions: ${response.status}`);
    }

    const result: ApiResponse<CoachSessionRecord[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Obtenir une session par ID
   */
  async getSession(id: string): Promise<CoachSessionRecord | null> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/coach/sessions/${id}`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      logger.error('Failed to get coach session', { status: response.status }, 'coachSessionsApi');
      throw new Error(`Failed to get session: ${response.status}`);
    }

    const result: ApiResponse<CoachSessionRecord> = await response.json();
    return result.data ?? null;
  },

  /**
   * Mettre à jour une session
   */
  async updateSession(id: string, payload: CoachSessionUpdatePayload): Promise<CoachSessionRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/coach/sessions/${id}`, {
      method: 'PATCH',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to update coach session', { status: response.status, error }, 'coachSessionsApi');
      throw new Error(error?.error?.message || `Failed to update session: ${response.status}`);
    }

    const result: ApiResponse<CoachSessionRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to update session');
    }

    return result.data;
  },

  /**
   * Supprimer une session
   */
  async deleteSession(id: string): Promise<void> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/coach/sessions/${id}`, {
      method: 'DELETE',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok && response.status !== 204) {
      logger.error('Failed to delete coach session', { status: response.status }, 'coachSessionsApi');
      throw new Error(`Failed to delete session: ${response.status}`);
    }
  },

  /**
   * Envoyer un message dans une session
   */
  async sendMessage(payload: CoachMessagePayload): Promise<CoachMessageRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/coach/messages`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to send coach message', { status: response.status, error }, 'coachSessionsApi');
      throw new Error(error?.error?.message || `Failed to send message: ${response.status}`);
    }

    const result: ApiResponse<CoachMessageRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to send message');
    }

    return result.data;
  },

  /**
   * Obtenir les messages d'une session
   */
  async getMessages(sessionId: string): Promise<CoachMessageRecord[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/coach/sessions/${sessionId}/messages`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get coach messages', { status: response.status }, 'coachSessionsApi');
      throw new Error(`Failed to get messages: ${response.status}`);
    }

    const result: ApiResponse<CoachMessageRecord[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Obtenir les analytics de coaching
   */
  async getAnalytics(): Promise<CoachAnalytics> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/coach/analytics`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get coach analytics', { status: response.status }, 'coachSessionsApi');
      throw new Error(`Failed to get analytics: ${response.status}`);
    }

    const result: ApiResponse<CoachAnalytics> = await response.json();
    if (!result.data) {
      throw new Error('No analytics data returned');
    }

    return result.data;
  },
};

export type {
  CoachSessionCreatePayload,
  CoachSessionUpdatePayload,
  CoachMessagePayload,
  CoachSessionRecord,
  CoachMessageRecord,
  CoachAnalytics
};
