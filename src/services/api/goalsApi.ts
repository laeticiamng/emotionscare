/**
 * Goals API Service
 * Service frontend pour se connecter aux endpoints API des objectifs personnels
 */

import { supabase } from '@/integrations/supabase/client';
import { API_URL } from '@/lib/env';
import { fetchWithRetry } from '@/lib/network/fetchWithRetry';
import { logger } from '@/lib/logger';

const API_BASE = API_URL?.replace(/\/$/, '') || '';

interface GoalCreatePayload {
  title: string;
  description?: string;
  category?: string;
  target_date?: string;
  target_value?: number;
  unit?: string;
}

interface GoalUpdatePayload {
  title?: string;
  description?: string;
  category?: string;
  target_date?: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  completed?: boolean;
}

interface GoalProgressPayload {
  current_value: number;
  notes?: string;
}

interface GoalRecord {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  target_date?: string;
  target_value?: number;
  current_value: number;
  unit?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

interface GoalStats {
  total: number;
  completed: number;
  active: number;
  completion_rate: number;
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

export const goalsApi = {
  /**
   * Créer un nouvel objectif
   */
  async createGoal(payload: GoalCreatePayload): Promise<GoalRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/goals`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to create goal', { status: response.status, error }, 'goalsApi');
      throw new Error(error?.error?.message || `Failed to create goal: ${response.status}`);
    }

    const result: ApiResponse<GoalRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to create goal');
    }

    return result.data;
  },

  /**
   * Lister les objectifs
   */
  async listGoals(filters: { status?: 'all' | 'active' | 'completed'; limit?: number; offset?: number } = {}): Promise<GoalRecord[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.offset) params.set('offset', String(filters.offset));

    const url = `${API_BASE}/api/v1/goals${params.toString() ? `?${params}` : ''}`;
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to list goals', { status: response.status }, 'goalsApi');
      throw new Error(`Failed to list goals: ${response.status}`);
    }

    const result: ApiResponse<GoalRecord[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Obtenir un objectif par ID
   */
  async getGoal(id: string): Promise<GoalRecord | null> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/goals/${id}`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      logger.error('Failed to get goal', { status: response.status }, 'goalsApi');
      throw new Error(`Failed to get goal: ${response.status}`);
    }

    const result: ApiResponse<GoalRecord> = await response.json();
    return result.data ?? null;
  },

  /**
   * Mettre à jour un objectif
   */
  async updateGoal(id: string, payload: GoalUpdatePayload): Promise<GoalRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/goals/${id}`, {
      method: 'PATCH',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to update goal', { status: response.status, error }, 'goalsApi');
      throw new Error(error?.error?.message || `Failed to update goal: ${response.status}`);
    }

    const result: ApiResponse<GoalRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to update goal');
    }

    return result.data;
  },

  /**
   * Supprimer un objectif
   */
  async deleteGoal(id: string): Promise<void> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/goals/${id}`, {
      method: 'DELETE',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok && response.status !== 204) {
      logger.error('Failed to delete goal', { status: response.status }, 'goalsApi');
      throw new Error(`Failed to delete goal: ${response.status}`);
    }
  },

  /**
   * Marquer un objectif comme terminé
   */
  async completeGoal(id: string): Promise<GoalRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/goals/${id}/complete`, {
      method: 'POST',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to complete goal', { status: response.status, error }, 'goalsApi');
      throw new Error(error?.error?.message || `Failed to complete goal: ${response.status}`);
    }

    const result: ApiResponse<GoalRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to complete goal');
    }

    return result.data;
  },

  /**
   * Mettre à jour la progression d'un objectif
   */
  async updateProgress(id: string, payload: GoalProgressPayload): Promise<GoalRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/goals/${id}/progress`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to update goal progress', { status: response.status, error }, 'goalsApi');
      throw new Error(error?.error?.message || `Failed to update goal progress: ${response.status}`);
    }

    const result: ApiResponse<GoalRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to update goal progress');
    }

    return result.data;
  },

  /**
   * Obtenir les statistiques des objectifs
   */
  async getStats(): Promise<GoalStats> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/goals/stats`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get goal stats', { status: response.status }, 'goalsApi');
      throw new Error(`Failed to get goal stats: ${response.status}`);
    }

    const result: ApiResponse<GoalStats> = await response.json();
    if (!result.data) {
      throw new Error('No stats data returned');
    }

    return result.data;
  },
};

export type { GoalCreatePayload, GoalUpdatePayload, GoalRecord, GoalStats };
