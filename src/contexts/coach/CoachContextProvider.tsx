
import React, { createContext, useContext, ReactNode } from 'react';
import { ChatMessage } from '@/types/coach';
import { useCoachHandlers } from './useCoachHandlers';
import { useCoachLocalStorage } from './useLocalStorage';

interface CoachContextType {
  messages: ChatMessage[];
  sendMessage: (text: string, sender: string) => void;
  clearMessages: () => void;
  isProcessing: boolean;
  currentEmotion: string | null;
  detectEmotion: (text: string) => Promise<string>;
  suggestActivity: (emotion: string) => Promise<string>;
  hasUnreadMessages: boolean;
  markAllAsRead: () => void;
}

// Create the context with default values
export const CoachContext = createContext<CoachContextType>({
  messages: [],
  sendMessage: () => {},
  clearMessages: () => {},
  isProcessing: false,
  currentEmotion: null,
  detectEmotion: async () => '',
  suggestActivity: async () => '',
  hasUnreadMessages: false,
  markAllAsRead: () => {}
});

export const CoachProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    messages,
    setMessages,
    isProcessing,
    currentEmotion,
    hasUnreadMessages,
    sendMessage,
    clearMessages,
    detectEmotion,
    suggestActivity,
    markAllAsRead
  } = useCoachHandlers();

  // Use local storage to persist messages
  useCoachLocalStorage(messages, setMessages);
  
  // Context value object
  const value = {
    messages,
    sendMessage,
    clearMessages,
    isProcessing,
    currentEmotion,
    detectEmotion,
    suggestActivity,
    hasUnreadMessages,
    markAllAsRead
  };

  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
};

// Custom hook to use the coach context
export const useCoach = () => useContext(CoachContext);
