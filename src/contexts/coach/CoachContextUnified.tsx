import React, { createContext, useContext, ReactNode } from 'react';
import { CoachContextType } from './types';

const CoachContext = createContext<CoachContextType | null>(null);

interface CoachProviderProps {
  children: ReactNode;
}

export const CoachProvider: React.FC<CoachProviderProps> = ({ children }) => {
  // Mock implementation
  const contextValue: CoachContextType = {
    messages: [],
    isTyping: false,
    isProcessing: false,
    loading: false,
    conversations: [],
    currentConversation: null,
    activeConversationId: null,
    sendMessage: async () => '',
    clearMessages: () => {},
    isOpen: false,
    setIsOpen: () => {},
    toggleChat: () => {},
    characterName: 'Coach AI',
    characterImage: '/placeholder-avatar.png',
    characterRole: 'assistant',
    currentEmotion: null,
    lastEmotion: null,
    emotionHistory: [],
    addMessage: () => {},
    startNewConversation: () => '',
    setActiveConversation: () => {},
    updateLastEmotion: () => {},
    analyzeEmotion: async () => ({ emotion: 'neutral', score: 0.5 }),
    getRecommendations: () => [],
    setIsPlaying: () => {},
    coachService: null,
  };

  return (
    <CoachContext.Provider value={contextValue}>
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

export default CoachContext;