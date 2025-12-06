
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

export function useChatMessages(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const addMessage = useCallback((text: string, sender: 'user' | 'assistant', options?: any): ChatMessage => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      content: text, // Ensure both properties are set for compatibility
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

  const sendMessageHandler = useCallback(async (text: string, previousMessages: ChatMessage[] = []) => {
    // Handle sending message logic
    console.log('Sending message:', text, 'Previous messages:', previousMessages);
    return `Response to: ${text}`;
  }, []);

  const analyzeEmotionHandler = useCallback(async (text: string) => {
    // Handle emotion analysis logic
    console.log('Analyzing emotion for:', text);
    return { emotion: 'neutral', score: 0.5 };
  }, []);

  const getRecommendationsHandler = useCallback((category: string) => {
    // Handle getting recommendations logic
    console.log('Getting recommendations for category:', category);
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
