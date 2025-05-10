
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export type MessageSender = 'user' | 'bot';

interface UseMessageHandlingOptions {
  initialMessages?: ChatMessage[];
}

export function useMessageHandling({ initialMessages = [] }: UseMessageHandlingOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  
  // Add a new message to the chat
  const addMessage = useCallback((content: string, sender: MessageSender, metadata?: Record<string, any>) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content,
      text: content,
      sender,
      sender_id: sender === 'user' ? 'user-1' : 'bot-1',
      conversation_id: 'default',
      is_read: true,
      timestamp: new Date(),
      ...metadata
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Replace all messages
  const replaceMessages = useCallback((newMessages: ChatMessage[]) => {
    setMessages(newMessages);
  }, []);
  
  // Get the last message from a specific sender
  const getLastMessageFrom = useCallback((sender: MessageSender): ChatMessage | undefined => {
    return [...messages].reverse().find(msg => msg.sender === sender);
  }, [messages]);
  
  // Format time display for a message
  const formatMessageTime = useCallback((timestamp: Date | string): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);
  
  // Export
  return {
    messages,
    addMessage,
    clearMessages,
    replaceMessages,
    getLastMessageFrom,
    formatMessageTime
  };
}

export default useMessageHandling;
