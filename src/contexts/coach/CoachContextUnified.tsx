import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export interface CoachContextType {
  // Core chat functionality
  messages: ChatMessage[];
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>();
  const [emotionConfidence, setEmotionConfidence] = useState<number>();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [conversationId] = useState(() => uuidv4());

  const analyzeEmotion = useCallback(async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
        body: { text, mode: 'text' }
      });
      
      if (error) throw error;
      
      const result = {
        emotion: data.emotion || 'neutral',
        confidence: data.confidence || 0.5
      };
      
      setCurrentEmotion(result.emotion);
      setEmotionConfidence(result.confidence);
      
      return result;
    } catch (error) {
      console.error('Emotion analysis failed:', error);
      return { emotion: 'neutral', confidence: 0.5 };
    }
  }, []);

  const generateRecommendations = useCallback(async (emotion: string) => {
    try {
      const defaultRecommendations = [
        'Prenez quelques respirations profondes',
        'Écoutez de la musique apaisante',
        'Faites une courte méditation'
      ];
      
      // In production, this would call an AI service
      const emotionBasedRecommendations = {
        happy: ['Partagez cette joie avec vos proches', 'Profitez de cette énergie positive', 'Fixez-vous de nouveaux objectifs'],
        sad: ['Accordez-vous du temps pour ressentir', 'Contactez un proche', 'Faites une activité réconfortante'],
        angry: ['Prenez du recul avant d\'agir', 'Faites de l\'exercice', 'Pratiquez la respiration profonde'],
        anxious: ['Concentrez-vous sur le moment présent', 'Pratiquez la relaxation', 'Organisez vos pensées'],
        neutral: defaultRecommendations
      };
      
      const recs = emotionBasedRecommendations[emotion as keyof typeof emotionBasedRecommendations] || defaultRecommendations;
      setRecommendations(recs);
      return recs;
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      return ['Prenez soin de vous', 'Restez à l\'écoute de vos besoins'];
    }
  }, []);

  const sendMessage = useCallback(async (content: string, sender: 'user' | 'assistant' | 'system' = 'user'): Promise<string> => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      conversationId,
      sender,
      text: content,
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    if (sender === 'user') {
      setIsProcessing(true);
      
      try {
        // Analyze emotion first
        const emotionResult = await analyzeEmotion(content);
        
        // Generate AI response using edge function
        const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
          body: { 
            text: content, 
            mode: 'chat',
            emotion: emotionResult.emotion,
            conversationHistory: messages.slice(-5) // Last 5 messages for context
          }
        });
        
        if (error) throw error;
        
        const aiResponse = data.response || 'Je suis là pour vous accompagner. Pouvez-vous me dire comment vous vous sentez ?';
        
        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          conversationId,
          sender: 'assistant',
          text: aiResponse,
          content: aiResponse,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Generate recommendations based on emotion
        await generateRecommendations(emotionResult.emotion);
        
        return aiResponse;
      } catch (error) {
        console.error('AI response failed:', error);
        
        const fallbackMessage: ChatMessage = {
          id: uuidv4(),
          conversationId,
          sender: 'assistant',
          text: 'Je rencontre une difficulté technique. Comment puis-je vous aider autrement ?',
          content: 'Je rencontre une difficulté technique. Comment puis-je vous aider autrement ?',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, fallbackMessage]);
        return fallbackMessage.text;
      } finally {
        setIsProcessing(false);
      }
    }
    
    return content;
  }, [conversationId, messages, analyzeEmotion, generateRecommendations]);

  const addMessage = useCallback((text: string, sender: 'user' | 'assistant' | 'system') => {
    const message: ChatMessage = {
      id: uuidv4(),
      conversationId,
      sender,
      text,
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, message]);
  }, [conversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentEmotion(undefined);
    setEmotionConfidence(undefined);
    setRecommendations([]);
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage(
        '👋 Bonjour ! Je suis votre coach émotionnel IA. Comment vous sentez-vous aujourd\'hui ?',
        'assistant'
      );
    }
  }, [messages.length, addMessage]);

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