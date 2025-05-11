
import { ChatResponse } from '@/types/chat';

export const getChatResponse = async (message: string): Promise<ChatResponse> => {
  // Simulated API response
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    content: `This is a response to your message: "${message}"`,
    emotion: 'neutral' // Using emotion instead of sentiment
  };
};
