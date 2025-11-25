/**
 * Breathwork API Service
 * Service frontend pour se connecter aux endpoints API des sessions de respiration
 */

import { supabase } from '@/integrations/supabase/client';
import { API_URL } from '@/lib/env';
import { fetchWithRetry } from '@/lib/network/fetchWithRetry';
import { logger } from '@/lib/logger';

const API_BASE = API_URL?.replace(/\/$/, '') || '';

interface BreathworkSessionCreatePayload {
  technique_type: string;
  duration?: number;
  target_bpm?: number;
  stress_level_before?: number;
  session_data?: Record<string, unknown>;
}

interface BreathworkSessionUpdatePayload {
  duration?: number;
  actual_bpm?: number;
  coherence_score?: number;
  stress_level_after?: number;
  session_data?: Record<string, unknown>;
}

interface BreathworkSessionRecord {
  id: string;
  user_id: string;
  technique_type: string;
  duration: number;
  target_bpm?: number;
  actual_bpm?: number;
  coherence_score?: number;
  stress_level_before?: number;
  stress_level_after?: number;
  session_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface BreathworkTechnique {
  id: string;
  name: string;
  description: string;
  inhale_seconds: number;
  hold_seconds: number;
  exhale_seconds: number;
  cycles: number;
  category: string;
}

interface BreathworkStats {
  total_sessions: number;
  total_duration_seconds: number;
  average_coherence: number | null;
  average_stress_reduction: number | null;
  techniques_used: Record<string, number>;
  sessions_this_week: number;
  sessions_this_month: number;
  current_streak_days: number;
}

interface BreathworkWeeklyMetrics {
  week_start: string;
  total_sessions: number;
  total_duration: number;
  avg_coherence?: number;
  techniques_used: Record<string, number>;
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

interface BreathworkFeedbackPayload {
  session_id?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  felt_calm?: boolean;
  felt_focused?: boolean;
  felt_relaxed?: boolean;
  notes?: string;
}

export const breathworkApi = {
  /**
   * Soumettre le feedback d'une session de respiration
   */
  async submitFeedback(payload: BreathworkFeedbackPayload): Promise<void> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/breath/feedback`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to submit breathwork feedback', { status: response.status, error }, 'breathworkApi');
      throw new Error(error?.error?.message || `Failed to submit feedback: ${response.status}`);
    }
  },

  /**
   * Créer une nouvelle session de respiration
   */
  async createSession(payload: BreathworkSessionCreatePayload): Promise<BreathworkSessionRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/breath/sessions`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to create breathwork session', { status: response.status, error }, 'breathworkApi');
      throw new Error(error?.error?.message || `Failed to create session: ${response.status}`);
    }

    const result: ApiResponse<BreathworkSessionRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to create session');
    }

    return result.data;
  },

  /**
   * Lister les sessions de respiration
   */
  async listSessions(filters: { technique?: string; limit?: number; offset?: number } = {}): Promise<BreathworkSessionRecord[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (filters.technique) params.set('technique', filters.technique);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.offset) params.set('offset', String(filters.offset));

    const url = `${API_BASE}/api/v1/breath/sessions${params.toString() ? `?${params}` : ''}`;
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to list breathwork sessions', { status: response.status }, 'breathworkApi');
      throw new Error(`Failed to list sessions: ${response.status}`);
    }

    const result: ApiResponse<BreathworkSessionRecord[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Obtenir une session par ID
   */
  async getSession(id: string): Promise<BreathworkSessionRecord | null> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/breath/sessions/${id}`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      logger.error('Failed to get breathwork session', { status: response.status }, 'breathworkApi');
      throw new Error(`Failed to get session: ${response.status}`);
    }

    const result: ApiResponse<BreathworkSessionRecord> = await response.json();
    return result.data ?? null;
  },

  /**
   * Mettre à jour une session
   */
  async updateSession(id: string, payload: BreathworkSessionUpdatePayload): Promise<BreathworkSessionRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/breath/sessions/${id}`, {
      method: 'PATCH',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to update breathwork session', { status: response.status, error }, 'breathworkApi');
      throw new Error(error?.error?.message || `Failed to update session: ${response.status}`);
    }

    const result: ApiResponse<BreathworkSessionRecord> = await response.json();
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
    const response = await fetchWithRetry(`${API_BASE}/api/v1/breath/sessions/${id}`, {
      method: 'DELETE',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok && response.status !== 204) {
      logger.error('Failed to delete breathwork session', { status: response.status }, 'breathworkApi');
      throw new Error(`Failed to delete session: ${response.status}`);
    }
  },

  /**
   * Obtenir les statistiques de respiration
   */
  async getStats(): Promise<BreathworkStats> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/breath/stats`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get breathwork stats', { status: response.status }, 'breathworkApi');
      throw new Error(`Failed to get stats: ${response.status}`);
    }

    const result: ApiResponse<BreathworkStats> = await response.json();
    if (!result.data) {
      throw new Error('No stats data returned');
    }

    return result.data;
  },

  /**
   * Obtenir les métriques hebdomadaires
   */
  async getWeeklyMetrics(): Promise<BreathworkWeeklyMetrics[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/breath/weekly`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get breathwork weekly metrics', { status: response.status }, 'breathworkApi');
      throw new Error(`Failed to get weekly metrics: ${response.status}`);
    }

    const result: ApiResponse<BreathworkWeeklyMetrics[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Obtenir les techniques de respiration disponibles
   */
  async getTechniques(): Promise<BreathworkTechnique[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/breath/techniques`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get breathwork techniques', { status: response.status }, 'breathworkApi');
      throw new Error(`Failed to get techniques: ${response.status}`);
    }

    const result: ApiResponse<BreathworkTechnique[]> = await response.json();
    return result.data ?? [];
  },
};

export type {
  BreathworkSessionCreatePayload,
  BreathworkSessionUpdatePayload,
  BreathworkSessionRecord,
  BreathworkTechnique,
  BreathworkStats,
  BreathworkWeeklyMetrics,
  BreathworkFeedbackPayload
};
