
import { EmotionResult } from '@/types/emotion';
import OpenAIClient from '../api/openAIClient';

// Define the EnhancedEmotionResult type to include all required fields
export interface EnhancedEmotionResult extends EmotionResult {
  emotions: {[key: string]: number};
  dominantEmotion: {
    name: string;
    score: number;
  };
}

export async function enhanceEmotionAnalysis(
  baseResult: EmotionResult
): Promise<EnhancedEmotionResult> {
  try {
    // Initialize our enhanced result with the base result properties
    const enhancedResult: EnhancedEmotionResult = {
      ...baseResult,
      emotions: {},
      dominantEmotion: {
        name: baseResult.primaryEmotion?.name || baseResult.emotion || 'neutral',
        score: baseResult.score || 0
      }
    };

    // Process the emotion data to extract insights, triggers, recommendations
    const emotionText = baseResult.text || '';
    const primaryEmotion = baseResult.primaryEmotion?.name || baseResult.emotion || 'neutral';

    // Generate insights about the emotion if text is available
    if (emotionText.length > 0) {
      try {
        // Here you would typically call an AI service to analyze the text
        // This is a simplified version
        enhancedResult.emotions = {
          joy: 0.2,
          sadness: 0.1,
          anger: 0.05,
          fear: 0.1,
          surprise: 0.15,
          [primaryEmotion]: baseResult.score || 0.4
        };

        // Add recommendations based on the emotion
        enhancedResult.recommendations = generateRecommendations(primaryEmotion);
      } catch (error) {
        console.error('Error enhancing emotion analysis:', error);
      }
    }

    return enhancedResult;
  } catch (error) {
    console.error('Error in enhanceEmotionAnalysis:', error);
    throw error;
  }
}

function generateRecommendations(emotion: string): string[] {
  // Simple recommendation generator based on the emotion
  const recommendations: {[key: string]: string[]} = {
    joy: [
      'Partagez votre bonheur avec un ami',
      'Notez cette expérience positive dans votre journal',
      'Utilisez cette énergie pour une activité créative'
    ],
    sadness: [
      'Écoutez une playlist apaisante',
      'Parlez à un ami de confiance',
      'Prenez un moment pour méditer'
    ],
    anger: [
      'Faites une courte marche pour vous calmer',
      'Pratiquez des exercices de respiration profonde',
      'Écrivez vos pensées pour les extérioriser'
    ],
    fear: [
      'Pratiquez la technique 5-4-3-2-1 de pleine conscience',
      'Contactez un proche pour du soutien',
      'Notez vos peurs spécifiques pour les rationaliser'
    ],
    neutral: [
      'Essayez une séance de méditation guidée',
      'Explorez une nouvelle activité créative',
      'Planifiez une activité qui vous rend heureux'
    ]
  };

  // Return the recommendations for the emotion, or default recommendations if not found
  return recommendations[emotion.toLowerCase()] || recommendations.neutral;
}
