/**
 * Assessments API Service
 * Service frontend pour se connecter aux endpoints API des évaluations cliniques
 */

import { supabase } from '@/integrations/supabase/client';
import { API_URL } from '@/lib/env';
import { fetchWithRetry } from '@/lib/network/fetchWithRetry';
import { logger } from '@/lib/logger';

const API_BASE = API_URL?.replace(/\/$/, '') || '';

interface AssessmentCreatePayload {
  instrument: string;
  score_json?: Record<string, unknown>;
}

interface AssessmentSubmitPayload {
  answers: Record<string, number>;
}

interface AssessmentRecord {
  id: string;
  user_id: string;
  instrument: string;
  score_json: Record<string, unknown>;
  submitted_at?: string;
  ts: string;
}

interface ClinicalInstrument {
  id: string;
  code: string;
  name: string;
  description?: string;
  questions: Array<{
    id: string;
    text: string;
    min: number;
    max: number;
    reverse?: boolean;
  }>;
  scoring: {
    method: string;
    multiplier?: number;
    max: number;
  };
  thresholds?: Record<string, unknown>;
  category?: string;
  created_at: string;
}

interface AssessmentResult {
  assessment: AssessmentRecord;
  score: number;
  interpretation?: string;
  recommendations?: string[];
}

interface AssessmentStats {
  total_assessments: number;
  by_instrument: Record<string, number>;
  recent_scores: Array<{
    instrument: string;
    score: number;
    ts: string;
  }>;
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

export const assessmentsApi = {
  /**
   * Créer une nouvelle évaluation
   */
  async createAssessment(payload: AssessmentCreatePayload): Promise<AssessmentRecord> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/assessments`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to create assessment', { status: response.status, error }, 'assessmentsApi');
      throw new Error(error?.error?.message || `Failed to create assessment: ${response.status}`);
    }

    const result: ApiResponse<AssessmentRecord> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to create assessment');
    }

    return result.data;
  },

  /**
   * Lister les évaluations
   */
  async listAssessments(filters: { instrument?: string; limit?: number; offset?: number } = {}): Promise<AssessmentRecord[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (filters.instrument) params.set('instrument', filters.instrument);
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.offset) params.set('offset', String(filters.offset));

    const url = `${API_BASE}/api/v1/assessments${params.toString() ? `?${params}` : ''}`;
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to list assessments', { status: response.status }, 'assessmentsApi');
      throw new Error(`Failed to list assessments: ${response.status}`);
    }

    const result: ApiResponse<AssessmentRecord[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Obtenir une évaluation par ID
   */
  async getAssessment(id: string): Promise<AssessmentRecord | null> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/assessments/${id}`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      logger.error('Failed to get assessment', { status: response.status }, 'assessmentsApi');
      throw new Error(`Failed to get assessment: ${response.status}`);
    }

    const result: ApiResponse<AssessmentRecord> = await response.json();
    return result.data ?? null;
  },

  /**
   * Soumettre les réponses d'une évaluation
   */
  async submitAnswers(id: string, payload: AssessmentSubmitPayload): Promise<AssessmentResult> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/assessments/${id}/submit`, {
      method: 'POST',
      headers,
      json: payload,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      logger.error('Failed to submit assessment answers', { status: response.status, error }, 'assessmentsApi');
      throw new Error(error?.error?.message || `Failed to submit answers: ${response.status}`);
    }

    const result: ApiResponse<AssessmentResult> = await response.json();
    if (!result.ok || !result.data) {
      throw new Error(result.error?.message || 'Failed to submit answers');
    }

    return result.data;
  },

  /**
   * Obtenir les résultats d'une évaluation
   */
  async getResults(id: string): Promise<AssessmentResult> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/assessments/${id}/results`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get assessment results', { status: response.status }, 'assessmentsApi');
      throw new Error(`Failed to get results: ${response.status}`);
    }

    const result: ApiResponse<AssessmentResult> = await response.json();
    if (!result.data) {
      throw new Error('No results data returned');
    }

    return result.data;
  },

  /**
   * Supprimer une évaluation
   */
  async deleteAssessment(id: string): Promise<void> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/assessments/${id}`, {
      method: 'DELETE',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok && response.status !== 204) {
      logger.error('Failed to delete assessment', { status: response.status }, 'assessmentsApi');
      throw new Error(`Failed to delete assessment: ${response.status}`);
    }
  },

  /**
   * Obtenir les instruments cliniques disponibles
   */
  async getInstruments(): Promise<ClinicalInstrument[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/assessments/instruments`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get clinical instruments', { status: response.status }, 'assessmentsApi');
      throw new Error(`Failed to get instruments: ${response.status}`);
    }

    const result: ApiResponse<ClinicalInstrument[]> = await response.json();
    return result.data ?? [];
  },

  /**
   * Obtenir un instrument clinique par code
   */
  async getInstrument(code: string): Promise<ClinicalInstrument | null> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const response = await fetchWithRetry(`${API_BASE}/api/v1/assessments/instruments/${code}`, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      logger.error('Failed to get clinical instrument', { status: response.status }, 'assessmentsApi');
      throw new Error(`Failed to get instrument: ${response.status}`);
    }

    const result: ApiResponse<ClinicalInstrument> = await response.json();
    return result.data ?? null;
  },

  /**
   * Obtenir l'historique des évaluations
   */
  async getHistory(filters: { instrument?: string; from_date?: string; to_date?: string } = {}): Promise<AssessmentRecord[]> {
    if (!API_BASE) {
      throw new Error('API_URL non configurée');
    }

    const headers = await getAuthHeaders();
    const params = new URLSearchParams();
    if (filters.instrument) params.set('instrument', filters.instrument);
    if (filters.from_date) params.set('from_date', filters.from_date);
    if (filters.to_date) params.set('to_date', filters.to_date);

    const url = `${API_BASE}/api/v1/assessments/history${params.toString() ? `?${params}` : ''}`;
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers,
      timeoutMs: 10000,
      retries: 2,
    });

    if (!response.ok) {
      logger.error('Failed to get assessment history', { status: response.status }, 'assessmentsApi');
      throw new Error(`Failed to get history: ${response.status}`);
    }

    const result: ApiResponse<AssessmentRecord[]> = await response.json();
    return result.data ?? [];
  },
};

export type {
  AssessmentCreatePayload,
  AssessmentSubmitPayload,
  AssessmentRecord,
  ClinicalInstrument,
  AssessmentResult,
  AssessmentStats
};
