// @ts-nocheck
/**
 * SERVICE API UNIFIÉ EMOTIONSCARE - Version Premium
 * Service centralisé pour toutes les interactions API de la plateforme
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  EmotionAnalysisResult,
  MusicGenerationRequest,
  TherapySession,
  AICoachInteraction,
  WellbeingMetrics,
  ApiResponse,
  PaginatedResponse
} from '@/types';

class UnifiedApiService {
  private baseUrl: string;
  private version: string = 'v1';

  constructor() {
    this.baseUrl = `https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1`;
  }

  // === UTILITAIRES DE BASE ===
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur API');
      }

      return {
        success: true,
        data: data.data || data,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: response.headers.get('x-request-id') || '',
          version: this.version,
        },
      };
    } catch (error) {
      // Silent: API error logged internally
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Erreur inconnue',
          details: error,
        },
      };
    }
  }

  // === ANALYSE ÉMOTIONNELLE ===
  async analyzeEmotion(params: {
    type: 'facial' | 'voice' | 'text';
    data: string | Blob;
    userId: string;
  }): Promise<ApiResponse<EmotionAnalysisResult>> {
    const endpoint = params.type === 'facial' ? 'hume-face' :
                   params.type === 'voice' ? 'hume-voice' :
                   'hume-emotion-analysis';

    const formData = new FormData();
    
    if (params.data instanceof Blob) {
      formData.append('file', params.data);
    } else {
      formData.append('text', params.data);
    }
    
    formData.append('userId', params.userId);

    return this.makeRequest<EmotionAnalysisResult>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Pas de Content-Type pour FormData
    });
  }

  async getEmotionHistory(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      startDate?: string;
      endDate?: string;
      source?: 'facial' | 'voice' | 'text';
    } = {}
  ): Promise<PaginatedResponse<EmotionAnalysisResult>> {
    const params = new URLSearchParams({
      userId,
      limit: options.limit?.toString() || '20',
      offset: options.offset?.toString() || '0',
      ...(options.startDate && { startDate: options.startDate }),
      ...(options.endDate && { endDate: options.endDate }),
      ...(options.source && { source: options.source }),
    });

    return this.makeRequest<EmotionAnalysisResult[]>(`emotion-analytics?${params}`);
  }

  // === GÉNÉRATION MUSICALE ===
  async generateMusic(request: MusicGenerationRequest): Promise<ApiResponse<{ trackId: string; url: string }>> {
    return this.makeRequest<{ trackId: string; url: string }>('suno-music', {
      method: 'POST',
      body: JSON.stringify({
        action: 'generate',
        ...request,
        mood: request.emotion || 'calm'
      }),
    });
  }

  async getMusicLibrary(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      emotion?: string;
      style?: string;
    } = {}
  ): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      userId,
      limit: options.limit?.toString() || '20',
      offset: options.offset?.toString() || '0',
      ...(options.emotion && { emotion: options.emotion }),
      ...(options.style && { style: options.style }),
    });

    return this.makeRequest<any[]>(`music-library?${params}`);
  }

  async getMusicRecommendations(
    userId: string,
    currentEmotion: string
  ): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('music-adaptation-engine', {
      method: 'POST',
      body: JSON.stringify({ userId, currentEmotion }),
    });
  }

  // === COACH IA ===
  async chatWithCoach(params: {
    message: string;
    sessionId?: string;
    userId: string;
    context?: any;
  }): Promise<ApiResponse<AICoachInteraction>> {
    return this.makeRequest<AICoachInteraction>('ai-coach-chat', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getCoachSessions(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      userId,
      limit: options.limit?.toString() || '10',
      offset: options.offset?.toString() || '0',
      ...(options.startDate && { startDate: options.startDate }),
      ...(options.endDate && { endDate: options.endDate }),
    });

    return this.makeRequest<any[]>(`coach-sessions?${params}`);
  }

  // === SÉANCES DE THÉRAPIE ===
  async startTherapySession(params: {
    type: 'music' | 'breathing' | 'vr' | 'coaching';
    userId: string;
    config?: any;
  }): Promise<ApiResponse<TherapySession>> {
    return this.makeRequest<TherapySession>('therapy-session/start', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async endTherapySession(params: {
    sessionId: string;
    userId: string;
    effectiveness: number;
    notes?: string;
  }): Promise<ApiResponse<TherapySession>> {
    return this.makeRequest<TherapySession>('therapy-session/end', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getTherapySessions(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      type?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<PaginatedResponse<TherapySession>> {
    const params = new URLSearchParams({
      userId,
      limit: options.limit?.toString() || '20',
      offset: options.offset?.toString() || '0',
      ...(options.type && { type: options.type }),
      ...(options.startDate && { startDate: options.startDate }),
      ...(options.endDate && { endDate: options.endDate }),
    });

    return this.makeRequest<TherapySession[]>(`therapy-sessions?${params}`);
  }

  // === JOURNAL & NOTES ===
  async createJournalEntry(params: {
    userId: string;
    content: string;
    emotion?: string;
    isPrivate?: boolean;
    tags?: string[];
  }): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('journal-entry', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getJournalEntries(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      startDate?: string;
      endDate?: string;
      tags?: string[];
    } = {}
  ): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      userId,
      limit: options.limit?.toString() || '20',
      offset: options.offset?.toString() || '0',
      ...(options.startDate && { startDate: options.startDate }),
      ...(options.endDate && { endDate: options.endDate }),
      ...(options.tags && { tags: options.tags.join(',') }),
    });

    return this.makeRequest<any[]>(`journal-entries?${params}`);
  }

  async analyzeJournal(params: {
    userId: string;
    entryId: string;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('analyze-journal', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // === MÉTRIQUES & ANALYTICS ===
  async getWellbeingMetrics(
    userId: string,
    period: 'day' | 'week' | 'month' | 'year' = 'week'
  ): Promise<ApiResponse<WellbeingMetrics[]>> {
    return this.makeRequest<WellbeingMetrics[]>(`metrics?userId=${userId}&period=${period}`);
  }

  async getDashboardData(userId: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`dashboard-data?userId=${userId}`);
  }

  async getPersonalizedInsights(userId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>(`insights?userId=${userId}`);
  }

  // === NOTIFICATIONS ===
  async getNotifications(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
    } = {}
  ): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      userId,
      limit: options.limit?.toString() || '20',
      offset: options.offset?.toString() || '0',
      ...(options.unreadOnly && { unreadOnly: 'true' }),
    });

    return this.makeRequest<any[]>(`notifications?${params}`);
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  // === VR & EXPÉRIENCES IMMERSIVES ===
  async startVRSession(params: {
    userId: string;
    type: 'breathing' | 'meditation' | 'therapy';
    environment: string;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('vr-session/start', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getVREnvironments(): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>('vr-environments');
  }

  // === ENTREPRISE (B2B) ===
  async getOrganizationAnalytics(
    organizationId: string,
    period: string = 'month'
  ): Promise<ApiResponse<any>> {
    return this.makeRequest<any>(`organization/${organizationId}/analytics?period=${period}`);
  }

  async getTeamWellbeing(
    organizationId: string,
    teamId?: string
  ): Promise<ApiResponse<any>> {
    const endpoint = teamId 
      ? `organization/${organizationId}/teams/${teamId}/wellbeing`
      : `organization/${organizationId}/wellbeing`;
    
    return this.makeRequest<any>(endpoint);
  }

  async generateOrganizationReport(params: {
    organizationId: string;
    reportType: 'wellbeing' | 'engagement' | 'productivity';
    period: string;
    departments?: string[];
  }): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('organization/reports/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // === INTÉGRATIONS EXTERNES ===
  async syncWithCalendar(params: {
    userId: string;
    provider: 'google' | 'outlook';
    accessToken: string;
  }): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('integrations/calendar/sync', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async connectWearableDevice(params: {
    userId: string;
    deviceType: 'fitbit' | 'apple_watch' | 'garmin';
    accessToken: string;
  }): Promise<ApiResponse<void>> {
    return this.makeRequest<void>('integrations/wearables/connect', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // === SYSTÈME & SANTÉ ===
  async getSystemHealth(): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('health-check');
  }

  async reportBug(params: {
    userId: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    attachments?: File[];
  }): Promise<ApiResponse<void>> {
    const formData = new FormData();
    formData.append('userId', params.userId);
    formData.append('title', params.title);
    formData.append('description', params.description);
    formData.append('severity', params.severity);
    formData.append('category', params.category);

    params.attachments?.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });

    return this.makeRequest<void>('support/bug-report', {
      method: 'POST',
      body: formData,
      headers: {}, // Pas de Content-Type pour FormData
    });
  }
}

// Instance singleton
export const unifiedApi = new UnifiedApiService();
export default unifiedApi;