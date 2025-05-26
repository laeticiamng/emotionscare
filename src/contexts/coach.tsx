
import React, { createContext, useContext, useState } from 'react';
import { ChatMessage } from '@/types/chat';

interface CoachContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, sender?: 'user' | 'coach') => Promise<ChatMessage>;
  isProcessing: boolean;
  clearMessages: () => void;
}

const CoachContext = createContext<CoachContextType | null>(null);

export const CoachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (content: string, sender: 'user' | 'coach' = 'user'): Promise<ChatMessage> => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);

    if (sender === 'user') {
      setIsProcessing(true);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Merci pour votre message. Comment puis-je vous aider ?',
          sender: 'assistant',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsProcessing(false);
      }, 1000);
    }

    return message;
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value: CoachContextType = {
    messages,
    sendMessage,
    isProcessing,
    clearMessages
  };

  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (!context) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
};
