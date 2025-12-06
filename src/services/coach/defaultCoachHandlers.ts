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
    console.error('sendMessageHandler error:', error);
    return "D\u00E9sol\u00E9, je rencontre un probl\u00E8me pour r\u00E9pondre.";
  }
}

export async function analyzeEmotionHandler(text: string): Promise<{ emotion: string; score: number }> {
  try {
    const result = await analyzeEmotion(text);
    return { emotion: result.primaryEmotion, score: result.intensity };
  } catch (error) {
    console.error('analyzeEmotionHandler error:', error);
    return { emotion: 'neutral', score: 0 };
  }
}

export function getRecommendationsHandler(_category: string): string[] {
  try {
    return [
      'Prenez une pause et respirez profond\u00E9ment.',
      'Notez vos pens\u00E9es dans un journal.',
      'Faites quelques pas pour vous d\u00E9tendre.'
    ];
  } catch (error) {
    console.error('getRecommendationsHandler error:', error);
    return [];
  }
}
