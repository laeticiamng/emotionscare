
import { apiService } from '@/services/api/endpoints';

/**
 * Service API spécialisé pour EmotionsCare
 * Utilise les nouveaux endpoints créés par le backend
 */
class EmotionsCareApiService {
  
  /**
   * Analyse une émotion à partir d'un texte
   */
  async analyzeEmotion(text: string) {
    try {
      const response = await apiService.analyzeEmotion(text);
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'analyse d\'émotion:', error);
      throw error;
    }
  }

  /**
   * Analyse vocale d'émotion
   */
  async analyzeVoiceEmotion(audioBlob: Blob) {
    try {
      const response = await apiService.analyzeVoice(audioBlob);
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'analyse vocale:', error);
      throw error;
    }
  }

  /**
   * Chat avec l'IA coach
   */
  async chatWithCoach(message: string, conversationHistory?: any[]) {
    try {
      const response = await apiService.chatWithAI(message, conversationHistory);
      return response;
    } catch (error) {
      console.error('Erreur lors du chat avec le coach:', error);
      throw error;
    }
  }

  /**
   * Récupère les données du tableau de bord
   */
  async getDashboardData() {
    try {
      // Utilise les endpoints existants ou futurs du backend
      const response = await fetch('/api/v1/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données du tableau de bord');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur dashboard:', error);
      throw error;
    }
  }

  /**
   * Sauvegarde une entrée de journal
   */
  async saveJournalEntry(content: string) {
    try {
      const response = await fetch('/api/v1/journal/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de l\'entrée de journal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur sauvegarde journal:', error);
      throw error;
    }
  }
}

// Instance singleton du service
export const emotionsCareApi = new EmotionsCareApiService();
export default emotionsCareApi;
