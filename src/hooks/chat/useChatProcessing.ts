
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatResponse } from '@/types/chat';

export function useChatProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [responses, setResponses] = useState<ChatResponse[]>([]);

  const processMessage = async (message: string): Promise<ChatResponse> => {
    setIsProcessing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulated response generation
      const emotionalTones = ['neutral', 'happy', 'concerned', 'encouraging'];
      const randomTone = emotionalTones[Math.floor(Math.random() * emotionalTones.length)];
      
      const response: ChatResponse = {
        message: `Here is a response to your message: "${message}"`,
        emotion: randomTone,
        confidence: 0.8 + Math.random() * 0.2,
        text: `Here is a response to your message: "${message}"`,
        follow_up_questions: [
          'Would you like to know more about this topic?',
          'How are you feeling today?',
          'Would you like some recommendations?'
        ],
        recommendations: [
          'Try a 5-minute mindfulness exercise',
          'Consider journaling about your feelings',
          'Take a short walk outside to refresh your mind'
        ]
      };
      
      setResponses(prev => [...prev, response]);
      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorResponse: ChatResponse = {
        message: 'Sorry, I was unable to process your message.',
        emotion: 'neutral',
        confidence: 0,
        recommendations: []
      };
      
      return errorResponse;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    responses,
    processMessage
  };
}
