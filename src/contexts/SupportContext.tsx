// @ts-nocheck
import React, { createContext, useContext, useState } from 'react';
import { Message, ChatResponse } from '@/types/support';
import { getSupportResponse } from '@/services/chatService';
import { v4 as uuidv4 } from 'uuid';

interface SupportContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<ChatResponse | null>;
  clearHistory: () => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (content: string): Promise<ChatResponse | null> => {
    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await getSupportResponse(content);
      const assistantMessage: Message = {
        id: response.id || uuidv4(),
        sender: 'assistant',
        content: response.content || '',
        emotion: response.emotion,
        timestamp: response.timestamp || new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      return response;
    } catch (error) {
      // Support message error - silent
      return null;
    }
  };

  const clearHistory = () => setMessages([]);

  return (
    <SupportContext.Provider value={{ messages, sendMessage, clearHistory }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = (): SupportContextType => {
  const ctx = useContext(SupportContext);
  if (!ctx) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return ctx;
};
