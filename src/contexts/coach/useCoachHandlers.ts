
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

// Function to create a timestamp string for the current time
const createTimestamp = () => new Date().toISOString();

export const useCoachHandlers = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: "Bonjour, je suis votre coach virtuel. Comment puis-je vous aider aujourd'hui ?",
      sender: "assistant",
      timestamp: createTimestamp(),
    },
  ]);

  // Function to add a new message
  const addMessage = useCallback((content: string, sender: 'user' | 'assistant', options: any = {}) => {
    const newMessage: ChatMessage = {
      id: options.id || uuidv4(),
      content,
      sender,
      timestamp: options.timestamp || createTimestamp(),
      ...options,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Function to initialize messages
  const setInitialMessages = useCallback((initialMessages: any[]) => {
    // Ensure all messages have required properties
    const validMessages: ChatMessage[] = initialMessages.map(msg => ({
      id: msg.id || uuidv4(),
      content: msg.content || msg.text || '',
      sender: msg.sender || 'user',
      timestamp: msg.timestamp || createTimestamp(),
      conversationId: msg.conversationId || msg.conversation_id,
    }));
    
    setMessages(validMessages);
  }, []);

  return {
    messages,
    addMessage,
    setMessages,
    setInitialMessages,
  };
};

export default useCoachHandlers;
