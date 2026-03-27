// @ts-nocheck
/**
 * Scan API Service - Gestion complète des scans émotionnels
 *
 * Service unifié pour toutes les opérations de scan émotionnel
 * Inclut les services d'analyse existants (text, voice, facial, emoji)
 * + nouveaux endpoints CRUD pour persistance et historique
 *
 * @version 1.0.0
 * @lastUpdated 2025-11-14
 */

import { SCAN_ENDPOINTS, buildEndpoint } from './apiEndpoints';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ScanResult {
  id: string;
  user_id: string;
  scan_type: 'text' | 'voice' | 'facial' | 'emoji';
  created_at: string;
  emotions: {
    primary: string;
    secondary?: string;
    confidence: number;
    scores: Record<string, number>;
  };
  mood_score?: number;
  metadata?: Record<string, any>;
}

export interface ScanFilters {
  scan_type?: 'text' | 'voice' | 'facial' | 'emoji';
  date_from?: string;
  date_to?: string;
  emotion?: string;
  page?: number;
  limit?: number;
}

export interface ScanStats {
  total_scans: number;
  scans_by_type: Record<string, number>;
  most_frequent_emotion: string;
  average_mood_score: number;
  emotions_distribution: Record<string, number>;
}

export interface ScanTrends {
  period: 'daily' | 'weekly' | 'monthly';
  data_points: Array<{
    date: string;
    emotion: string;
    count: number;
    avg_mood_score: number;
  }>;
}

/**
 * Service API Scan - CRUD complet + services d'analyse
 */
class ScanApiService {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || '/api/v1') {
    this.baseUrl = baseUrl;
  }

  /**
   * Récupère le token d'authentification
   */
  private async getAuthToken(): Promise<string | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  /**
   * Helper pour les requêtes HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Network error',
      }));
      logger.error('Scan API error', error, 'scanApiService');
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * CRUD SCANS - Persistance et récupération
   * ════════════════════════════════════════════════════════════════
   */

  /**
   * Créer un nouveau scan (après analyse)
   */
  async createScan(scanData: {
    scan_type: 'text' | 'voice' | 'facial' | 'emoji';
    emotions: {
      primary: string;
      secondary?: string;
      confidence: number;
      scores: Record<string, number>;
    };
    mood_score?: number;
    raw_data?: any;
    metadata?: Record<string, any>;
  }): Promise<ScanResult> {
    return this.request<ScanResult>(SCAN_ENDPOINTS.CREATE_SCAN, {
      method: 'POST',
      body: JSON.stringify(scanData),
    });
  }

  /**
   * Récupérer la liste des scans avec filtres
   */
  async listScans(filters?: ScanFilters): Promise<{
    scans: ScanResult[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.scan_type) params.append('scan_type', filters.scan_type);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.emotion) params.append('emotion', filters.emotion);
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${SCAN_ENDPOINTS.LIST_SCANS}?${queryString}`
      : SCAN_ENDPOINTS.LIST_SCANS;

    return this.request(endpoint);
  }

  /**
   * Récupérer un scan spécifique
   */
  async getScan(scanId: string): Promise<ScanResult> {
    const endpoint = buildEndpoint(SCAN_ENDPOINTS.GET_SCAN, { id: scanId });
    return this.request(endpoint);
  }

  /**
   * Supprimer un scan
   */
  async deleteScan(scanId: string): Promise<void> {
    const endpoint = buildEndpoint(SCAN_ENDPOINTS.DELETE_SCAN, { id: scanId });
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * ANALYSE ÉMOTIONNELLE - Services existants intégrés
   * ════════════════════════════════════════════════════════════════
   */

  /**
   * Analyser du texte (service existant)
   * Après analyse, le scan est automatiquement sauvegardé
   */
  async analyzeText(text: string, options?: {
    save?: boolean;
    metadata?: Record<string, any>;
  }): Promise<ScanResult> {
    const response = await this.request<any>(SCAN_ENDPOINTS.ANALYZE_TEXT, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });

    // Si save = true (par défaut), persister le scan
    if (options?.save !== false) {
      return this.createScan({
        scan_type: 'text',
        emotions: response.emotions,
        mood_score: response.mood_score,
        raw_data: { text },
        metadata: options?.metadata,
      });
    }

    return response;
  }

  /**
   * Analyser de la voix (service existant)
   */
  async analyzeVoice(audioBlob: Blob, options?: {
    save?: boolean;
    metadata?: Record<string, any>;
  }): Promise<ScanResult> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const token = await this.getAuthToken();

    const response = await fetch(
      `${this.baseUrl}${SCAN_ENDPOINTS.ANALYZE_VOICE}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Voice analysis failed: ${response.status}`);
    }

    const result = await response.json();

    // Persister si demandé
    if (options?.save !== false) {
      return this.createScan({
        scan_type: 'voice',
        emotions: result.emotions,
        mood_score: result.mood_score,
        metadata: options?.metadata,
      });
    }

    return result;
  }

  /**
   * Analyser une expression faciale (service existant)
   */
  async analyzeFacial(imageBlob: Blob, options?: {
    save?: boolean;
    metadata?: Record<string, any>;
  }): Promise<ScanResult> {
    const formData = new FormData();
    formData.append('image', imageBlob);

    const token = await this.getAuthToken();

    const response = await fetch(
      `${this.baseUrl}${SCAN_ENDPOINTS.ANALYZE_FACIAL}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Facial analysis failed: ${response.status}`);
    }

    const result = await response.json();

    if (options?.save !== false) {
      return this.createScan({
        scan_type: 'facial',
        emotions: result.emotions,
        mood_score: result.mood_score,
        metadata: options?.metadata,
      });
    }

    return result;
  }

  /**
   * Analyser avec emoji
   */
  async analyzeEmoji(emoji: string, options?: {
    save?: boolean;
    intensity?: number;
    metadata?: Record<string, any>;
  }): Promise<ScanResult> {
    const response = await this.request<any>(SCAN_ENDPOINTS.ANALYZE_EMOJI, {
      method: 'POST',
      body: JSON.stringify({ emoji, intensity: options?.intensity }),
    });

    if (options?.save !== false) {
      return this.createScan({
        scan_type: 'emoji',
        emotions: response.emotions,
        mood_score: response.mood_score,
        raw_data: { emoji, intensity: options?.intensity },
        metadata: options?.metadata,
      });
    }

    return response;
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * STATISTIQUES & INSIGHTS
   * ════════════════════════════════════════════════════════════════
   */

  /**
   * Récupérer les statistiques globales
   */
  async getStats(): Promise<ScanStats> {
    return this.request(SCAN_ENDPOINTS.GET_STATS);
  }

  /**
   * Récupérer les tendances émotionnelles
   */
  async getTrends(period: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<ScanTrends> {
    return this.request(`${SCAN_ENDPOINTS.GET_TRENDS}?period=${period}`);
  }

  /**
   * Détection de patterns comportementaux
   */
  async getPatterns(): Promise<{
    recurring_emotions: Array<{
      emotion: string;
      frequency: number;
      typical_time: string;
    }>;
    mood_patterns: Array<{
      day_of_week: string;
      avg_mood: number;
    }>;
    triggers: Array<{
      context: string;
      associated_emotion: string;
    }>;
  }> {
    return this.request(SCAN_ENDPOINTS.GET_PATTERNS);
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * HISTORIQUE
   * ════════════════════════════════════════════════════════════════
   */

  /**
   * Scans du jour
   */
  async getDailyScans(date?: string): Promise<ScanResult[]> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.request(`${SCAN_ENDPOINTS.GET_DAILY}?date=${targetDate}`);
  }

  /**
   * Scans de la semaine
   */
  async getWeeklyScans(): Promise<ScanResult[]> {
    return this.request(SCAN_ENDPOINTS.GET_WEEKLY);
  }

  /**
   * Scans du mois
   */
  async getMonthlyScans(): Promise<ScanResult[]> {
    return this.request(SCAN_ENDPOINTS.GET_MONTHLY);
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * EXPORT & BATCH
   * ════════════════════════════════════════════════════════════════
   */

  /**
   * Exporter l'historique des scans
   */
  async exportScans(format: 'json' | 'csv' | 'pdf' = 'json'): Promise<Blob> {
    const token = await this.getAuthToken();

    const response = await fetch(
      `${this.baseUrl}${SCAN_ENDPOINTS.EXPORT_SCANS}?format=${format}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    return response.blob();
  }

  /**
   * Analyse batch (plusieurs scans en une seule requête)
   */
  async batchAnalyze(items: Array<{
    type: 'text' | 'emoji';
    data: string;
  }>): Promise<ScanResult[]> {
    return this.request(SCAN_ENDPOINTS.BATCH_ANALYZE, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }
}

/**
 * Instance singleton du service
 */
export const scanApiService = new ScanApiService();
export default scanApiService;
