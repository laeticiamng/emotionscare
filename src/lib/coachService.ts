import { v4 as uuidv4 } from 'uuid';
import emotionalDataService from '@/lib/coach/emotional-data-service';
import { generateRecommendation } from '@/lib/coach/recommender';
import { EmotionalData } from '@/types/emotional-data';

interface CoachResponse {
  message: string;
  recommendations?: any[];
  suggestions?: string[];
}

class CoachService {
  async processMessage(userId: string, message: string): Promise<CoachResponse> {
    // Analyse simplifiée du message pour la démo
    const lowerMessage = message.toLowerCase();
    
    // Créer une entrée émotionnelle basée sur le message
    let emotionalData: EmotionalData | null = null;
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxieux') || lowerMessage.includes('inquiet')) {
      emotionalData = await this.recordEmotion(userId, 'stressed', 7);
    } else if (lowerMessage.includes('triste') || lowerMessage.includes('déprimé')) {
      emotionalData = await this.recordEmotion(userId, 'sad', 6);
    } else if (lowerMessage.includes('heureux') || lowerMessage.includes('content') || lowerMessage.includes('joyeux')) {
      emotionalData = await this.recordEmotion(userId, 'happy', 8);
    } else if (lowerMessage.includes('fatigué') || lowerMessage.includes('épuisé')) {
      emotionalData = await this.recordEmotion(userId, 'tired', 5);
    } else {
      emotionalData = await this.recordEmotion(userId, 'neutral', 3);
    }
    
    // Générer une réponse avec des recommandations
    const recommendations = generateRecommendation(emotionalData);
    
    // Répondre en fonction du message
    let responseMessage = '';
    
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      responseMessage = 'Bonjour ! Comment vous sentez-vous aujourd\'hui ?';
    } else if (lowerMessage.includes('merci')) {
      responseMessage = 'Je vous en prie. Je suis là pour vous aider.';
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('anxieux') || lowerMessage.includes('inquiet')) {
      responseMessage = 'Je comprends que vous vous sentez stressé. Voici quelques recommandations pour vous aider à vous détendre.';
    } else if (lowerMessage.includes('triste') || lowerMessage.includes('déprimé')) {
      responseMessage = 'Je suis désolé d\'apprendre que vous vous sentez triste. Voici quelques suggestions qui pourraient vous aider.';
    } else if (lowerMessage.includes('heureux') || lowerMessage.includes('content') || lowerMessage.includes('joyeux')) {
      responseMessage = 'C\'est formidable que vous vous sentiez bien ! Voici quelques idées pour maintenir cette énergie positive.';
    } else if (lowerMessage.includes('fatigué') || lowerMessage.includes('épuisé')) {
      responseMessage = 'Je comprends que vous vous sentez fatigué. Voici quelques recommandations qui pourraient vous aider à récupérer.';
    } else {
      responseMessage = 'Merci de partager cela avec moi. Comment puis-je vous aider aujourd\'hui ?';
    }
    
    return {
      message: responseMessage,
      recommendations: recommendations
    };
  }
  
  private async recordEmotion(userId: string, emotion: string, intensity: number): Promise<EmotionalData> {
    return emotionalDataService.addEmotionalData({
      user_id: userId,
      emotion,
      value: intensity * 10, // Convertir sur une échelle de 0-100
      intensity,
      timestamp: new Date().toISOString()
    });
  }
}

export const coachService = new CoachService();
export default coachService;
