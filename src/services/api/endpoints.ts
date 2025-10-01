// @ts-nocheck

/**
 * Configuration centralisée des endpoints API pour EmotionsCare
 * Mise à jour pour intégration backend production
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Service API unifié pour tous les endpoints - Version Production
 */
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // =================== LEGACY METHODS (maintenues pour compatibilité) ===================
  
  async analyzeEmotion(text: string) {
    return this.request('/emotion/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async analyzeVoice(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    return fetch(`${this.baseUrl}/emotion/voice`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return response.json();
    });
  }

  async chatWithAI(message: string, conversationHistory?: any[]) {
    return this.request('/coach/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        history: conversationHistory || [] 
      }),
    });
  }

  async getMusicRecommendations(emotion: string) {
    return this.request(`/music/recommendations?emotion=${encodeURIComponent(emotion)}`);
  }

  // =================== NOUVEAUX ENDPOINTS PRODUCTION ===================
  
  // Dashboard unifié
  async getDashboardStats() {
    return this.request('/user/dashboard-stats');
  }

  // Journal avec backend complet
  async getJournalEntries(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/journal/entries${queryString}`);
  }

  async saveJournalEntry(content: string, moodScore?: number) {
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
  async getUserPreferences() {
    return this.request('/user/preferences');
  }

  async updateUserPreferences(preferences: any) {
    return this.request('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Gamification avec backend
  async getAchievements() {
    return this.request('/gamification/achievements');
  }

  async getUserGamificationStats() {
    return this.request('/gamification/user-stats');
  }

  // Social/Cocon avec backend
  async getSocialGroups() {
    return this.request('/social/groups');
  }

  async joinSocialGroup(groupId: string) {
    return this.request(`/social/groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  // VR Sessions avec backend
  async getVRTemplates() {
    return this.request('/vr/templates');
  }

  async createVRSession(templateName: string) {
    return this.request('/vr/sessions', {
      method: 'POST',
      body: JSON.stringify({ template_name: templateName }),
    });
  }

  // Admin endpoints avec backend
  async getAdminTeams() {
    return this.request('/admin/teams');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async getAdminAnalytics() {
    return this.request('/admin/analytics/overview');
  }

  // Notifications avec backend
  async getNotifications() {
    return this.request('/notifications/user');
  }

  // Health check
  async getHealthStatus() {
    return this.request('/health');
  }
}

// Instance singleton
export const apiService = new ApiService();
export default apiService;
