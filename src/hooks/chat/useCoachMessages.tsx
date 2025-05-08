
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { useChatHistory } from '@/hooks/chat/useChatHistory';

/**
 * Hook for managing chat messages
 */
export function useCoachMessages(initialQuestion?: string) {
  // State for messages in the current conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  // Chat history integration
  const { saveMessages } = useChatHistory();
  
  // Save messages when they change
  useEffect(() => {
    if (messages.length > 1) { // Only save if there are user messages
      saveMessages(messages);
    }
  }, [messages, saveMessages]);

  // Adding a message
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  // Reset messages to initial state
  const resetMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: 'Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);
  
  return {
    messages,
    setMessages,
    addMessage,
    resetMessages
  };
}
