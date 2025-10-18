// @ts-nocheck

import { v4 as uuid } from 'uuid';
import { logger } from '@/lib/logger';

// Types for the mock service
interface CoachResponse {
  id: string;
  message: string;
  suggestions?: string[];
  timestamp: string;
}

// Mock coach service
export const mockCoachService = {
  // Ask a question to the coach
  askQuestion: async (question: string): Promise<CoachResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a mock response
    return {
      id: uuid(),
      message: `En réponse à "${question}", je vous suggère de prendre quelques instants pour réfléchir à vos émotions actuelles et comment elles influencent votre perception.`,
      suggestions: [
        "Pratiquez 5 minutes de respiration profonde",
        "Notez vos pensées dans un journal",
        "Prenez une pause courte et marchez"
      ],
      timestamp: new Date().toISOString()
    };
  },
  
  // Get personalized recommendations
  getRecommendations: async (emotionData: any): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Return generic recommendations
    return [
      "Prenez 10 minutes pour méditer",
      "Écoutez une musique apaisante",
      "Faites une courte marche à l'extérieur",
      "Pratiquez la gratitude en notant 3 choses positives"
    ];
  },
  
  // Log an emotional event for coaching
  logEmotionalEvent: async (emotion: string, intensity: number, context: string): Promise<void> => {
    logger.info(`Logged emotional event: ${emotion} (${intensity}/10)`, { context }, 'API');
    await new Promise(resolve => setTimeout(resolve, 300));
    return;
  }
};

export default mockCoachService;
