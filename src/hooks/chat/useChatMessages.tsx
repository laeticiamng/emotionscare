
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

export function useChatMessages(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const addMessage = useCallback((text: string, sender: 'user' | 'assistant', options?: any): ChatMessage => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender,
      timestamp: new Date().toISOString(),
      ...options
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  }, []);

  const setInitialMessages = useCallback((initialMessages: ChatMessage[]) => {
    setMessages(initialMessages);
  }, []);

  // Fonctions supplémentaires pour gérer les messages
  const sendMessageHandler = useCallback(async (text: string) => {
    // Handle sending message logic
    const userMessage = addMessage(text, 'user');
    return userMessage;
  }, [addMessage]);

  const analyzeEmotionHandler = useCallback(async (text: string) => {
    // Handle emotion analysis logic
    console.log('Analyzing emotion for:', text);
    return { emotion: 'neutral', confidence: 0.5 };
  }, []);

  const getRecommendationsHandler = useCallback(async (emotion: string) => {
    // Handle getting recommendations logic
    console.log('Getting recommendations for emotion:', emotion);
    return ['Recommendation 1', 'Recommendation 2'];
  }, []);

  return {
    messages,
    addMessage,
    setMessages,
    setInitialMessages,
    sendMessageHandler,
    analyzeEmotionHandler,
    getRecommendationsHandler,
  };
}

export default useChatMessages;
