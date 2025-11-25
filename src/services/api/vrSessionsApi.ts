/**
 * VR Sessions API Service
 * Service frontend pour se connecter aux endpoints API des sessions VR
 */

import { supabase } from '@/integrations/supabase/client';
import { API_URL } from '@/lib/env';
import { fetchWithRetry } from '@/lib/network/fetchWithRetry';
import { logger } from '@/lib/logger';

const API_BASE = API_URL?.replace(/\/$/, '') || '';

interface VRSessionCreatePayload {
  experience_type: 'nebula' | 'dome' | 'galaxy' | 'breath';
  duration_seconds?: number;
  vr_tier?: 'low' | 'mid' | 'high';
  profile?: Record<string, unknown>;
  mood_before?: number;
  session_data?: Record<string, unknown>;
}

interface VRSessionUpdatePayload {
  duration_seconds?: number;
  mood_after?: number;
  completed?: boolean;
  session_data?: Record<string, unknown>;
}

interface VRSessionRecord {
  id: string;
  user_id: string;
  experience_type?: string;
  experience_id?: string;
  experience_title?: string;
  duration_seconds?: number;
  duration_minutes?: number;
  category?: string;
  vr_tier?: string;
  profile?: Record<string, unknown>;
  mood_before?: number;
  mood_after?: number;
  completed: boolean;
  rating?: number;
  session_data?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

interface VRExperience {
  id: string;
  title: string;
  description: string;
  duration_seconds: number;
  category: string;
  thumbnail_url?: string;
}

interface VRStats {
  total_sessions: number;
  completed_sessions: number;
  completion_rate: number;
  total_duration_seconds: number;
  experiences_used: Record<string, number>;
  average_mood_change: number | null;
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

export const vrSessionsApi = {
  /**
   * Créer une nouvelle session VR
   */
  async createSession(payload: VRSessionCreatePayload): Promise<VRSessionRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/vr/sessions`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to create VR session', { status: response.status, error }, 'vrSessionsApi');
      throw new Error(error?.error?.message || `Failed to create session: ${response.status}`);
    }

    const result: ApiResponse<VRSessionRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to create session');
    }

    return result.data;
  },

  /**
   * Lister les sessions VR
   */
  async listSessions(filters: { experience_type?: string; limit?: number; offset?: number } = {}): Promise<VRSessionRecord[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (filters.experience_type) params.set('experience_type', filters.experience_type);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.offset) params.set('offset', String(filters.offset));

    const url = `${API_BASE}/api/v1/vr/sessions${params.toString() ? `?${params}` : ''}`;
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to list VR sessions', { status: response.status }, 'vrSessionsApi');
      throw new Error(`Failed to list sessions: ${response.status}`);
    }

    const result: ApiResponse<VRSessionRecord[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Obtenir une session par ID
   */
  async getSession(id: string): Promise<VRSessionRecord | null> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/vr/sessions/${id}`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      logger.error('Failed to get VR session', { status: response.status }, 'vrSessionsApi');
      throw new Error(`Failed to get session: ${response.status}`);
    }

    const result: ApiResponse<VRSessionRecord> = await response.json();
    return result.data ?? null;
  },

  /**
   * Mettre à jour une session
   */
  async updateSession(id: string, payload: VRSessionUpdatePayload): Promise<VRSessionRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/vr/sessions/${id}`, {
      method: 'PATCH',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to update VR session', { status: response.status, error }, 'vrSessionsApi');
      throw new Error(error?.error?.message || `Failed to update session: ${response.status}`);
    }

    const result: ApiResponse<VRSessionRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to update session');
    }

    return result.data;
  },

  /**
   * Compléter une session VR
   */
  async completeSession(id: string, payload: { mood_after?: number; rating?: number } = {}): Promise<VRSessionRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/vr/sessions/${id}/complete`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to complete VR session', { status: response.status, error }, 'vrSessionsApi');
      throw new Error(error?.error?.message || `Failed to complete session: ${response.status}`);
    }

    const result: ApiResponse<VRSessionRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to complete session');
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
    const response = await fetchWithRetry(`${API_BASE}/api/v1/vr/sessions/${id}`, {
      method: 'DELETE',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok && response.status !== 204) {
      logger.error('Failed to delete VR session', { status: response.status }, 'vrSessionsApi');
      throw new Error(`Failed to delete session: ${response.status}`);
    }
  },

  /**
   * Obtenir les statistiques VR
   */
  async getStats(): Promise<VRStats> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/vr/stats`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get VR stats', { status: response.status }, 'vrSessionsApi');
      throw new Error(`Failed to get stats: ${response.status}`);
    }

    const result: ApiResponse<VRStats> = await response.json();
    if (!result.data) {
      throw new Error('No stats data returned');
    }

    return result.data;
  },

  /**
   * Obtenir les expériences VR disponibles
   */
  async getExperiences(): Promise<VRExperience[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/vr/experiences`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get VR experiences', { status: response.status }, 'vrSessionsApi');
      throw new Error(`Failed to get experiences: ${response.status}`);
    }

    const result: ApiResponse<VRExperience[]> = await response.json();
    return result.data ?? [];
  },
};

export type {
  VRSessionCreatePayload,
  VRSessionUpdatePayload,
  VRSessionRecord,
  VRExperience,
  VRStats
};
