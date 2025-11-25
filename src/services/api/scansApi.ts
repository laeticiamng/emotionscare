/**
 * Scans API Service
 * Service frontend pour se connecter aux endpoints API de scans émotionnels
 */

import { supabase } from '@/integrations/supabase/client';
import { API_URL } from '@/lib/env';
import { fetchWithRetry } from '@/lib/network/fetchWithRetry';
import { logger } from '@/lib/logger';

const API_BASE = API_URL?.replace(/\/$/, '') || '';

interface ScanCreatePayload {
  emotions: Record<string, number>;
  dominant_emotion: string;
  confidence_score: number;
  scan_type: 'facial' | 'voice' | 'text' | 'manual' | 'emoji';
  context?: Record<string, unknown>;
  notes?: string;
  recommendations?: Record<string, unknown>;
}

interface ScanRecord {
  id: string;
  user_id: string;
  emotions: Record<string, number>;
  dominant_emotion: string;
  confidence_score: number;
  scan_type: string;
  context?: Record<string, unknown>;
  notes?: string;
  recommendations?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

interface ScanListFilters {
  scan_type?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

interface ScanStats {
  period: string;
  total_scans: number;
  emotion_distribution: Record<string, number>;
  scan_type_distribution: Record<string, number>;
  average_confidence: number;
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

export const scansApi = {
  /**
   * Créer un nouveau scan émotionnel
   */
  async createScan(payload: ScanCreatePayload): Promise<ScanRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/scans`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to create scan', { status: response.status, error }, 'scansApi');
      throw new Error(error?.error?.message || `Failed to create scan: ${response.status}`);
    }

    const result: ApiResponse<ScanRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to create scan');
    }

    return result.data;
  },

  /**
   * Lister les scans émotionnels
   */
  async listScans(filters: ScanListFilters = {}): Promise<ScanRecord[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (filters.scan_type) params.set('scan_type', filters.scan_type);
    if (filters.from_date) params.set('from_date', filters.from_date);
    if (filters.to_date) params.set('to_date', filters.to_date);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.offset) params.set('offset', String(filters.offset));

    const url = `${API_BASE}/api/v1/scans${params.toString() ? `?${params}` : ''}`;
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to list scans', { status: response.status }, 'scansApi');
      throw new Error(`Failed to list scans: ${response.status}`);
    }

    const result: ApiResponse<ScanRecord[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Obtenir un scan par ID
   */
  async getScan(id: string): Promise<ScanRecord | null> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/scans/${id}`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      logger.error('Failed to get scan', { status: response.status }, 'scansApi');
      throw new Error(`Failed to get scan: ${response.status}`);
    }

    const result: ApiResponse<ScanRecord> = await response.json();
    return result.data ?? null;
  },

  /**
   * Supprimer un scan
   */
  async deleteScan(id: string): Promise<void> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/scans/${id}`, {
      method: 'DELETE',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok && response.status !== 204) {
      logger.error('Failed to delete scan', { status: response.status }, 'scansApi');
      throw new Error(`Failed to delete scan: ${response.status}`);
    }
  },

  /**
   * Obtenir les statistiques de scans
   */
  async getStats(period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<ScanStats> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/scans/stats?period=${period}`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get scan stats', { status: response.status }, 'scansApi');
      throw new Error(`Failed to get scan stats: ${response.status}`);
    }

    const result: ApiResponse<ScanStats> = await response.json();
    if (!result.data) {
      throw new Error('No stats data returned');
    }

    return result.data;
  },

  /**
   * Obtenir les tendances de scans
   */
  async getTrends(): Promise<Array<{ dominant_emotion: string; created_at: string; confidence_score: number }>> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/scans/trends`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get scan trends', { status: response.status }, 'scansApi');
      throw new Error(`Failed to get scan trends: ${response.status}`);
    }

    const result: ApiResponse<Array<{ dominant_emotion: string; created_at: string; confidence_score: number }>> = await response.json();
    return result.data ?? [];
  },
};

// =====================================================
// Emotions Table API (legacy table support)
// =====================================================

interface EmotionCheckinPayload {
  emojis?: string;
  primary_emotion?: string;
  score?: number;
  intensity?: number;
  text?: string;
  source?: string;
  ai_feedback?: string;
}

interface EmotionRecord {
  id: string;
  user_id: string;
  emojis?: string;
  primary_emotion?: string;
  score?: number;
  intensity?: number;
  text?: string;
  source?: string;
  ai_feedback?: string;
  date: string;
  created_at?: string;
}

export const emotionsApi = {
  /**
   * Quick emotion check-in
   */
  async checkin(payload: EmotionCheckinPayload): Promise<EmotionRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/emotions/checkin`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to create emotion checkin', { status: response.status, error }, 'emotionsApi');
      throw new Error(error?.error?.message || `Failed to create checkin: ${response.status}`);
    }

    const result: ApiResponse<EmotionRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to create checkin');
    }

    return result.data;
  },

  /**
   * Get recent emotion entries
   */
  async getRecent(limit: number = 7): Promise<EmotionRecord[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/emotions/recent?limit=${limit}`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get recent emotions', { status: response.status }, 'emotionsApi');
      throw new Error(`Failed to get recent emotions: ${response.status}`);
    }

    const result: ApiResponse<EmotionRecord[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Create full emotion record (for scanners)
   */
  async create(payload: EmotionCheckinPayload): Promise<EmotionRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/emotions`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to create emotion record', { status: response.status, error }, 'emotionsApi');
      throw new Error(error?.error?.message || `Failed to create emotion: ${response.status}`);
    }

    const result: ApiResponse<EmotionRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to create emotion');
    }

    return result.data;
  },
};

export type { ScanCreatePayload, ScanRecord, ScanListFilters, ScanStats, EmotionCheckinPayload, EmotionRecord };
