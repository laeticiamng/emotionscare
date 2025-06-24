
/**
 * Configuration centralisée des endpoints API pour EmotionsCare
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Service API unifié pour tous les endpoints
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

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Analyse d'émotion via texte
  async analyzeEmotion(text: string) {
    return this.request('/emotion/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Analyse d'émotion via voix
  async analyzeVoice(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    return fetch(`${this.baseUrl}/emotion/voice`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return response.json();
    });
  }

  // Chat avec l'IA coach
  async chatWithAI(message: string, conversationHistory?: any[]) {
    return this.request('/coach/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        history: conversationHistory || [] 
      }),
    });
  }

  // Données du dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Journal - récupérer les entrées
  async getJournalEntries() {
    return this.request('/journal/entries');
  }

  // Journal - sauvegarder une entrée
  async saveJournalEntry(content: string) {
    return this.request('/journal/entry', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Musique - recommandations basées sur l'émotion
  async getMusicRecommendations(emotion: string) {
    return this.request(`/music/recommendations?emotion=${encodeURIComponent(emotion)}`);
  }

  // Paramètres utilisateur
  async getUserPreferences() {
    return this.request('/user/preferences');
  }

  async updateUserPreferences(preferences: any) {
    return this.request('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }
}

// Instance singleton
export const apiService = new ApiService();
export default apiService;
