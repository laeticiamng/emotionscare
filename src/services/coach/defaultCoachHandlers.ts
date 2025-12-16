import { chatCompletion, analyzeEmotion } from '@/services/openai';
import { ChatMessage } from '@/types/chat';
import { logger } from '@/lib/logger';

export async function sendMessageHandler(message: string, history: ChatMessage[] = []): Promise<string> {
  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: 'user',
    content: message,
    text: message,
    conversationId: history[0]?.conversationId || `conv-${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  const messages = [...history, newMessage];
  try {
    return await chatCompletion(messages, { model: 'gpt-4o-mini', temperature: 0.7 });
  } catch (error) {
    logger.error('Coach message send failed', error as Error, 'COACH');
    return "Désolé, je rencontre un problème pour répondre. Réessayez dans quelques instants.";
  }
}

export async function analyzeEmotionHandler(text: string): Promise<{ emotion: string; score: number }> {
  try {
    const result = await analyzeEmotion(text);
    return { emotion: result.primaryEmotion, score: result.intensity };
  } catch (error) {
    logger.warn('Emotion analysis failed', error, 'COACH');
    return { emotion: 'neutral', score: 0.5 };
  }
}

const RECOMMENDATIONS_BY_CATEGORY: Record<string, string[]> = {
  stress: [
    'Pratiquez la respiration 4-7-8 pendant 2 minutes.',
    'Faites une pause de 5 minutes loin des écrans.',
    'Écoutez une session de musique apaisante.'
  ],
  anxiety: [
    'Ancrez-vous : nommez 5 choses que vous voyez.',
    'Respirez lentement par le ventre.',
    'Notez vos pensées anxieuses dans le journal.'
  ],
  fatigue: [
    'Faites une micro-sieste de 10-20 minutes.',
    'Hydratez-vous et prenez une collation légère.',
    'Marchez 5 minutes à l\'extérieur si possible.'
  ],
  tristesse: [
    'Écrivez ce que vous ressentez dans votre journal.',
    'Contactez un proche de confiance.',
    'Écoutez une musique qui vous réconforte.'
  ],
  default: [
    'Prenez une pause et respirez profondément.',
    'Notez vos pensées dans un journal.',
    'Faites quelques pas pour vous détendre.',
    'Essayez une session de cohérence cardiaque.'
  ]
};

export function getRecommendationsHandler(category: string): string[] {
  const normalizedCategory = category.toLowerCase().trim();
  return RECOMMENDATIONS_BY_CATEGORY[normalizedCategory] || RECOMMENDATIONS_BY_CATEGORY.default;
}
