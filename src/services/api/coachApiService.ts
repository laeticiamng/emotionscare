// @ts-nocheck
/**
 * Coach API Service - Coaching IA émotionnel
 *
 * Service unifié pour :
 * - Sessions de coaching (CRUD)
 * - Messages & Chat (conversation)
 * - Programmes de coaching
 * - Insights & Recommandations
 * - Analytics coaching
 *
 * @version 1.0.0
 * @lastUpdated 2025-11-14
 */

import { COACH_ENDPOINTS, buildEndpoint } from './apiEndpoints';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface CoachSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  duration_minutes?: number;
  topic?: string;
  emotions_addressed: string[];
  message_count: number;
  mood_before?: number;
  mood_after?: number;
  satisfaction_score?: number;
  summary?: string;
  metadata?: Record<string, any>;
}

export interface CoachMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  emotion_detected?: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

export interface CoachProgram {
  id: string;
  title: string;
  description: string;
  duration_weeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  sessions_count: number;
  is_premium: boolean;
  thumbnail_url?: string;
}

export interface CoachEnrollment {
  id: string;
  user_id: string;
  program_id: string;
  enrolled_at: string;
  completed_sessions: number;
  progress_percentage: number;
  current_week: number;
  is_completed: boolean;
}

export interface CoachInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'achievement' | 'warning';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  is_read: boolean;
  action_items?: string[];
}

/**
 * Service API Coach
 */
class CoachApiService {
  private baseUrl: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || '/api/v1') {
    this.baseUrl = baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

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
      logger.error('Coach API error', error, 'coachApiService');
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * SESSIONS DE COACHING
   * ════════════════════════════════════════════════════════════════
   */

  async createSession(data: {
    topic?: string;
    emotions_addressed?: string[];
    mood_before?: number;
    metadata?: Record<string, any>;
  }): Promise<CoachSession> {
    return this.request<CoachSession>(COACH_ENDPOINTS.CREATE_SESSION, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listSessions(filters?: {
    page?: number;
    limit?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<{
    sessions: CoachSession[];
    total: number;
  }> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${COACH_ENDPOINTS.LIST_SESSIONS}?${queryString}`
      : COACH_ENDPOINTS.LIST_SESSIONS;

    return this.request(endpoint);
  }

  async getSession(sessionId: string): Promise<CoachSession> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.GET_SESSION, {
      id: sessionId,
    });
    return this.request(endpoint);
  }

  async updateSession(
    sessionId: string,
    data: {
      emotions_addressed?: string[];
      mood_after?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<CoachSession> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.UPDATE_SESSION, {
      id: sessionId,
    });
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async closeSession(
    sessionId: string,
    data: {
      mood_after: number;
      satisfaction_score?: number;
      summary?: string;
    }
  ): Promise<CoachSession> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.CLOSE_SESSION, {
      id: sessionId,
    });
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSession(sessionId: string): Promise<void> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.DELETE_SESSION, {
      id: sessionId,
    });
    return this.request(endpoint, { method: 'DELETE' });
  }

  async getSessionSummary(sessionId: string): Promise<{
    session: CoachSession;
    key_points: string[];
    emotions_worked_on: string[];
    progress_made: string;
    next_steps: string[];
  }> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.GET_SUMMARY, {
      id: sessionId,
    });
    return this.request(endpoint);
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * MESSAGES & CHAT
   * ════════════════════════════════════════════════════════════════
   */

  async sendMessage(data: {
    session_id?: string;
    message: string;
    context?: {
      emotion?: string;
      situation?: string;
      urgency?: 'low' | 'medium' | 'high';
    };
  }): Promise<CoachMessage> {
    return this.request<CoachMessage>(COACH_ENDPOINTS.SEND_MESSAGE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(filters?: {
    session_id?: string;
    limit?: number;
  }): Promise<CoachMessage[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.session_id) params.append('session_id', filters.session_id);
      if (filters.limit) params.append('limit', String(filters.limit));
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${COACH_ENDPOINTS.GET_MESSAGES}?${queryString}`
      : COACH_ENDPOINTS.GET_MESSAGES;

    return this.request(endpoint);
  }

  async getSessionMessages(sessionId: string): Promise<CoachMessage[]> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.GET_SESSION_MESSAGES, {
      id: sessionId,
    });
    return this.request(endpoint);
  }

  async deleteMessage(messageId: string): Promise<void> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.DELETE_MESSAGE, {
      id: messageId,
    });
    return this.request(endpoint, { method: 'DELETE' });
  }

  /**
   * Chat direct (service existant)
   * Compatible avec l'ancien système
   */
  async chat(message: string, conversationHistory?: CoachMessage[]): Promise<{
    response: string;
    emotion_detected?: string;
    suggestions?: string[];
  }> {
    return this.request(COACH_ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify({
        message,
        history: conversationHistory || [],
      }),
    });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * PROGRAMMES DE COACHING
   * ════════════════════════════════════════════════════════════════
   */

  async listPrograms(filters?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    topic?: string;
    is_premium?: boolean;
  }): Promise<CoachProgram[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.topic) params.append('topic', filters.topic);
      if (filters.is_premium !== undefined)
        params.append('is_premium', String(filters.is_premium));
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${COACH_ENDPOINTS.LIST_PROGRAMS}?${queryString}`
      : COACH_ENDPOINTS.LIST_PROGRAMS;

    return this.request(endpoint);
  }

  async getProgram(programId: string): Promise<CoachProgram> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.GET_PROGRAM, {
      id: programId,
    });
    return this.request(endpoint);
  }

  async enrollProgram(programId: string): Promise<CoachEnrollment> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.ENROLL_PROGRAM, {
      id: programId,
    });
    return this.request(endpoint, {
      method: 'POST',
    });
  }

  async getProgramProgress(programId: string): Promise<CoachEnrollment> {
    const endpoint = buildEndpoint(COACH_ENDPOINTS.GET_PROGRESS, {
      id: programId,
    });
    return this.request(endpoint);
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * INSIGHTS & RECOMMANDATIONS
   * ════════════════════════════════════════════════════════════════
   */

  async getInsights(filters?: {
    type?: 'pattern' | 'recommendation' | 'achievement' | 'warning';
    is_read?: boolean;
    limit?: number;
  }): Promise<CoachInsight[]> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.type) params.append('type', filters.type);
      if (filters.is_read !== undefined)
        params.append('is_read', String(filters.is_read));
      if (filters.limit) params.append('limit', String(filters.limit));
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${COACH_ENDPOINTS.GET_INSIGHTS}?${queryString}`
      : COACH_ENDPOINTS.GET_INSIGHTS;

    return this.request(endpoint);
  }

  async getRecommendations(): Promise<{
    next_session_topic: string;
    suggested_techniques: string[];
    resources: Array<{
      title: string;
      type: 'article' | 'video' | 'exercise';
      url: string;
    }>;
    goals_to_set: string[];
  }> {
    return this.request(COACH_ENDPOINTS.GET_RECOMMENDATIONS);
  }

  async sendFeedback(data: {
    session_id?: string;
    message_id?: string;
    rating: number;
    comment?: string;
    feedback_type: 'helpful' | 'not_helpful' | 'inaccurate' | 'other';
  }): Promise<void> {
    return this.request(COACH_ENDPOINTS.SEND_FEEDBACK, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * ════════════════════════════════════════════════════════════════
   * ANALYTICS
   * ════════════════════════════════════════════════════════════════
   */

  async getAnalytics(): Promise<{
    total_sessions: number;
    total_messages: number;
    average_session_duration: number;
    most_addressed_emotions: Array<{
      emotion: string;
      count: number;
    }>;
    mood_improvement_avg: number;
    satisfaction_avg: number;
    programs_enrolled: number;
    programs_completed: number;
    insights_generated: number;
  }> {
    return this.request(COACH_ENDPOINTS.GET_ANALYTICS);
  }
}

/**
 * Instance singleton
 */
export const coachApiService = new CoachApiService();
export default coachApiService;
