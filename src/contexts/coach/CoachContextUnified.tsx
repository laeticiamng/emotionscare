import React, { createContext, useContext, useState } from 'react';

export interface CoachContextType {
  // Core chat functionality
  messages: any[];
  sendMessage: (content: string, sender?: 'user' | 'assistant' | 'system') => Promise<string>;
  isProcessing: boolean;
  loading: boolean;
  clearMessages: () => void;
  addMessage: (text: string, sender: 'user' | 'assistant' | 'system') => void;
  
  // Enhanced features
  currentEmotion?: string;
  emotionConfidence?: number;
  recommendations: string[];
  conversationId: string;
  
  // Analysis capabilities
  analyzeEmotion: (text: string) => Promise<{ emotion: string; confidence: number }>;
  generateRecommendations: (emotion: string) => Promise<string[]>;
}

const CoachContext = createContext<CoachContextType | null>(null);

export const CoachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages] = useState([]);
  const [isProcessing] = useState(false);
  const [loading] = useState(false);
  const [currentEmotion] = useState<string>();
  const [emotionConfidence] = useState<number>();
  const [recommendations] = useState<string[]>([]);
  const [conversationId] = useState('default-conversation');

  const analyzeEmotion = async (text: string) => {
    return { emotion: 'neutral', confidence: 0.5 };
  };

  const generateRecommendations = async (emotion: string) => {
    return ['Prenez soin de vous', 'Restez positif'];
  };

  const sendMessage = async (content: string, sender: 'user' | 'assistant' | 'system' = 'user'): Promise<string> => {
    return 'Message reçu';
  };

  const addMessage = (text: string, sender: 'user' | 'assistant' | 'system') => {
    // Simplified implementation
  };

  const clearMessages = () => {
    // Simplified implementation
  };

  const value: CoachContextType = {
    messages,
    sendMessage,
    isProcessing,
    loading,
    clearMessages,
    addMessage,
    currentEmotion,
    emotionConfidence,
    recommendations,
    conversationId,
    analyzeEmotion,
    generateRecommendations
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

export default CoachProvider;