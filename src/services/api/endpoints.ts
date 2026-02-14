/**
 * Configuration centralisée des endpoints API pour EmotionsCare
 * Mise à jour pour intégration backend production
 */

import { ApiRequestError } from '@/lib/errors/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

interface JournalEntryParams {
  page?: string;
  limit?: string;
  sort?: string;
}

interface ConversationMessage {
  role: string;
  content: string;
}

/**
 * Service API unifié pour tous les endpoints - Version Production
 */
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Ajouter le token d'authentification si disponible
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new ApiRequestError(
        `API Error: ${response.status} - ${response.statusText}`,
        response.status
      );
    }

    return response.json();
  }

  // =================== LEGACY METHODS (maintenues pour compatibilité) ===================

  async analyzeEmotion(text: string): Promise<unknown> {
    return this.request('/emotion/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async analyzeVoice(audioBlob: Blob): Promise<unknown> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const token = this.getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}/emotion/voice`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      throw new ApiRequestError(
        `API Error: ${response.status}`,
        response.status
      );
    }

    return response.json();
  }

  async chatWithAI(message: string, conversationHistory?: ConversationMessage[]): Promise<unknown> {
    return this.request('/coach/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        history: conversationHistory || []
      }),
    });
  }

  async getMusicRecommendations(emotion: string): Promise<unknown> {
    return this.request(`/music/recommendations?emotion=${encodeURIComponent(emotion)}`);
  }

  // =================== NOUVEAUX ENDPOINTS PRODUCTION ===================

  // Dashboard unifié
  async getDashboardStats(): Promise<unknown> {
    return this.request('/user/dashboard-stats');
  }

  // Journal avec backend complet
  async getJournalEntries(params?: JournalEntryParams): Promise<unknown> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/journal/entries${queryString}`);
  }

  async saveJournalEntry(content: string, moodScore?: number): Promise<unknown> {
    return this.request('/journal/entries', {
      method: 'POST',
      body: JSON.stringify({
        content,
        mood_score: moodScore,
        is_private: true
      }),
    });
  }

  // Préférences utilisateur avec backend
  async getUserPreferences(): Promise<unknown> {
    return this.request('/user/preferences');
  }

  async updateUserPreferences(preferences: Record<string, unknown>): Promise<unknown> {
    return this.request('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Gamification avec backend
  async getAchievements(): Promise<unknown> {
    return this.request('/gamification/achievements');
  }

  async getUserGamificationStats(): Promise<unknown> {
    return this.request('/gamification/user-stats');
  }

  // Social/Cocon avec backend
  async getSocialGroups(): Promise<unknown> {
    return this.request('/social/groups');
  }

  async joinSocialGroup(groupId: string): Promise<unknown> {
    return this.request(`/social/groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  // VR Sessions avec backend
  async getVRTemplates(): Promise<unknown> {
    return this.request('/vr/templates');
  }

  async createVRSession(templateName: string): Promise<unknown> {
    return this.request('/vr/sessions', {
      method: 'POST',
      body: JSON.stringify({ template_name: templateName }),
    });
  }

  // Admin endpoints avec backend
  async getAdminTeams(): Promise<unknown> {
    return this.request('/admin/teams');
  }

  async getAdminUsers(): Promise<unknown> {
    return this.request('/admin/users');
  }

  async getAdminAnalytics(): Promise<unknown> {
    return this.request('/admin/analytics/overview');
  }

  // Notifications avec backend
  async getNotifications(): Promise<unknown> {
    return this.request('/notifications/user');
  }

  // Health check
  async getHealthStatus(): Promise<unknown> {
    return this.request('/health');
  }
}

// Instance singleton
export const apiService = new ApiService();
export default apiService;
