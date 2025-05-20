
import React, { createContext, useState, useCallback, useContext } from 'react';
import { ChatMessage } from '@/types/chat';
import { EmotionResult } from '@/types/emotion';
import { CoachContextType } from './types';

interface CoachHandlersOptions {
  sendMessageHandler: (message: string, conversationHistory?: any[]) => Promise<string>;
  analyzeEmotionHandler: (text: string) => Promise<{ emotion: string; score: number }>;
  getRecommendationsHandler: (category: string) => string[];
  processUserMessage?: (message: string) => Promise<void>;
  setIsProcessing?: (isProcessing: boolean) => void;
  coachService?: any;
}

export const CoachContext = createContext<CoachContextType | undefined>(undefined);

interface CoachContextProviderProps {
  children: React.ReactNode;
  handlers: CoachHandlersOptions;
}

export const CoachContextProvider: React.FC<CoachContextProviderProps> = ({ children, handlers }) => {
  const { sendMessageHandler, analyzeEmotionHandler, getRecommendationsHandler, processUserMessage, setIsProcessing, coachService } = handlers;
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessingState] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, sender: 'user' | 'assistant' | 'system' | 'coach' = 'user') => {
    if (!sendMessageHandler) {
      throw new Error('sendMessageHandler is required in handlers');
    }
    
    setIsProcessingState(true);
    setLoading(true);
    
    try {
      // Add the user message to the chat
      const newUserMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        sender,
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      
      // Get response from the handler
      const response = await sendMessageHandler(message, messages);
      
      // Add the assistant response to the chat
      const newAssistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
      
      return response;
    } finally {
      setIsProcessingState(false);
      setLoading(false);
    }
  }, [sendMessageHandler, messages]);

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

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  const updateLastEmotion = useCallback((emotion: string) => {
    setLastEmotion(emotion);
  }, []);

  const startNewConversation = useCallback((title: string = "New Conversation") => {
    const id = `conv-${Date.now()}`;
    const newConversation = {
      id,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    setActiveConversationId(id);
    setMessages([]);
    
    return id;
  }, []);
  
  const setActiveConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    const conversation = conversations.find(conv => conv.id === id) || null;
    setCurrentConversation(conversation);
    if (conversation) {
      setMessages(conversation.messages || []);
    }
  }, [conversations]);

  return (
    <CoachContext.Provider value={{ 
      sendMessage, 
      analyzeEmotion,
      getRecommendations, 
      loading,
      isTyping,
      isProcessing,
      messages,
      clearMessages,
      conversations,
      currentConversation,
      activeConversationId,
      lastEmotion,
      emotionHistory,
      currentEmotion: lastEmotion,
      addMessage,
      startNewConversation,
      setActiveConversation,
      updateLastEmotion,
      coachService
    }}>
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = (): CoachContextType => {
  const context = useContext(CoachContext);
  if (!context) {
    throw new Error('useCoach must be used within a CoachContextProvider');
  }
  return context;
};
export { CoachContextProvider as CoachProvider };
