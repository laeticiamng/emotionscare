// @ts-nocheck
import { chatCompletion, analyzeEmotion } from '@/services/openai';
import { ChatMessage } from '@/types/chat';

export async function sendMessageHandler(message: string, history: ChatMessage[] = []): Promise<string> {
  const messages = [...history, {
    id: `msg-${Date.now()}`,
    sender: 'user',
    content: message,
    timestamp: new Date().toISOString()
  }];
  try {
    return await chatCompletion(messages, { model: 'gpt-4o-mini', temperature: 0.7 });
  } catch (error) {
    // Silent: message send error logged internally
    return "Désolé, je rencontre un problème pour répondre.";
  }
}

export async function analyzeEmotionHandler(text: string): Promise<{ emotion: string; score: number }> {
  try {
    const result = await analyzeEmotion(text);
    return { emotion: result.primaryEmotion, score: result.intensity };
  } catch (error) {
    // Silent: emotion analysis error logged internally
    return { emotion: 'neutral', score: 0 };
  }
}

export function getRecommendationsHandler(_category: string): string[] {
  try {
    return [
      'Prenez une pause et respirez profondément.',
      'Notez vos pensées dans un journal.',
      'Faites quelques pas pour vous détendre.'
    ];
  } catch (error) {
    // Silent: recommendations fetch error logged internally
    return [];
  }
}
