
import React, { createContext, useState, useCallback, useContext } from 'react';

interface CoachHandlersOptions {
  sendMessageHandler: (message: string, conversationHistory: any[]) => Promise<string>;
  analyzeEmotionHandler: (text: string) => Promise<{ emotion: string; score: number }>;
  getRecommendationsHandler: (category: string) => string[]; // Changed to match implementation
  processUserMessage?: (message: string) => Promise<void>;
  setIsProcessing?: (isProcessing: boolean) => void;
  coachService?: any; // Add coachService to fix type errors
}

interface CoachContextProps {
  sendMessage: (message: string, conversationHistory: any[]) => Promise<string>;
  analyzeEmotion: (text: string) => Promise<{ emotion: string; score: number }>;
  getRecommendations: (category: string) => string[];
  loading?: boolean; // Add loading property for useCoachChat
  coachService?: any; // Add coachService to fix type errors
}

const CoachContext = createContext<CoachContextProps | undefined>(undefined);

interface CoachContextProviderProps {
  children: React.ReactNode;
  handlers: CoachHandlersOptions;
}

export const CoachContextProvider: React.FC<CoachContextProviderProps> = ({ children, handlers }) => {
  const { sendMessageHandler, analyzeEmotionHandler, getRecommendationsHandler, processUserMessage, setIsProcessing, coachService } = handlers;
  const [loading, setLoading] = useState(false); // Add loading state

  const sendMessage = useCallback(async (message: string, conversationHistory: any[]) => {
    if (!sendMessageHandler) {
      throw new Error('sendMessageHandler is required in handlers');
    }
    setLoading(true);
    try {
      return await sendMessageHandler(message, conversationHistory);
    } finally {
      setLoading(false);
    }
  }, [sendMessageHandler]);

  const analyzeEmotion = useCallback(async (text: string) => {
    if (!analyzeEmotionHandler) {
      throw new Error('analyzeEmotionHandler is required in handlers');
    }
    return analyzeEmotionHandler(text);
  }, [analyzeEmotionHandler]);

  const getRecommendations = useCallback((category: string) => {
    if (!getRecommendationsHandler) {
      throw new Error('getRecommendationsHandler is required in handlers');
    }
    return getRecommendationsHandler(category);
  }, [getRecommendationsHandler]);

  return (
    <CoachContext.Provider value={{ 
      sendMessage, 
      analyzeEmotion, 
      getRecommendations, 
      loading,
      coachService 
    }}>
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = (): CoachContextProps => {
  const context = useContext(CoachContext);
  if (!context) {
    throw new Error('useCoach must be used within a CoachContextProvider');
  }
  return context;
};
