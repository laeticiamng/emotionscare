import { httpClient } from './httpClient';
import { mockServer } from './mockServer';
import { ApiResponse, EmotionAnalysisResult, UserProfile, JournalEntry } from '@/types/api';

/**
 * Services API avec fallback vers le mock server
 * Point 5: Services API Foundation - Endpoints organisés
 */
class ApiService {
  /**
   * Service d'analyse d'émotion
   */
  async analyzeEmotion(text: string): Promise<ApiResponse<EmotionAnalysisResult>> {
    if (mockServer.isActive()) {
      return mockServer.analyzeEmotion(text);
    }
    
    return httpClient.post<EmotionAnalysisResult>('analyze-emotion', { text });
  }

  /**
   * Service d'analyse vocale
   */
  async analyzeVoice(audioBlob: Blob): Promise<ApiResponse<EmotionAnalysisResult>> {
    if (mockServer.isActive()) {
      return mockServer.analyzeVoice(audioBlob);
    }

    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    return httpClient.post<EmotionAnalysisResult>('voice-analysis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Service de chat avec l'IA coach
   */
  async chatWithAI(message: string, conversationHistory?: any[]): Promise<ApiResponse<{ response: string; conversationId: string }>> {
    return httpClient.post<{ response: string; conversationId: string }>('chat-with-ai', {
      message,
      conversationHistory,
      userContext: 'Utilisateur EmotionsCare',
    });
  }
}

// Instance singleton du service API
export const apiService = new ApiService();
export default apiService;