/**
 * COACH CONTEXT UNIFIÉ - EmotionsCare
 * Persistance Supabase (coach_conversations + coach_messages)
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChatMessage, ChatConversation } from '@/types/chat';
import { Suggestion } from '@/types/coach';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Types unifiés
export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  recommendations: string[];
}

export interface CoachService {
  askQuestion: (question: string) => Promise<string>;
  analyzeEmotion: (text: string) => Promise<EmotionAnalysis>;
  generateRecommendations: (emotion: string) => Promise<string[]>;
}

export interface UnifiedCoachContextType {
  currentConversation: ChatConversation | null;
  conversations: ChatConversation[];
  messages: ChatMessage[];
  loading: boolean;
  isProcessing: boolean;
  error: string | null;
  lastActivity: string;
  createConversation: () => ChatConversation;
  setCurrentConversation: (conversation: ChatConversation | null) => void;
  getConversations: () => Promise<ChatConversation[]>;
  saveConversation: (conversation: ChatConversation) => Promise<void>;
  deleteConversation: (id: string) => Promise<boolean>;
  clearConversations: () => void;
  sendMessage: (content: string, sender?: 'user' | 'assistant' | 'system') => Promise<string>;
  addMessage: (text: string, sender: 'user' | 'assistant' | 'system') => void;
  clearMessages: () => void;
  currentEmotion?: string;
  emotionConfidence?: number;
  recommendations: string[];
  analyzeEmotion: (text: string) => Promise<EmotionAnalysis>;
  generateRecommendations: (emotion: string) => Promise<string[]>;
  getSuggestions: () => Suggestion[];
  coachService: CoachService | null;
  conversationId: string;
}

const UnifiedCoachContext = createContext<UnifiedCoachContextType | null>(null);

const createInitialConversation = (userId: string = 'anonymous'): ChatConversation => ({
  id: `conv-${Date.now()}`,
  title: 'Nouvelle conversation',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  userId,
  isActive: true
});

// Real coach service using edge function
const createCoachService = (): CoachService => ({
  askQuestion: async (question: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message: question,
          conversationHistory: [],
          userEmotion: 'neutral',
          coachPersonality: 'empathetic',
        },
      });
      if (error) {
        logger.error('Coach API error', error, 'COACH');
        return "Je suis là pour t'écouter. Comment puis-je t'aider?";
      }
      return data?.response || "Je comprends. Dis-m'en plus.";
    } catch (err) {
      logger.error('Coach request failed', err as Error, 'COACH');
      return "Désolé, je rencontre un problème. Réessaie dans quelques instants.";
    }
  },

  analyzeEmotion: async (text: string): Promise<EmotionAnalysis> => {
    const emotions: Record<string, string[]> = {
      stress: ['stress', 'anxieux', 'tendu', 'pression', 'nerveux'],
      joie: ['heureux', 'joyeux', 'content', 'satisfait', 'bien'],
      tristesse: ['triste', 'déprimé', 'mélancolique', 'abattu', 'mal'],
      colère: ['colère', 'énervé', 'frustré', 'agacé', 'fâché'],
      peur: ['peur', 'anxiété', 'inquiet', 'angoisse', 'effrayé']
    };

    const lowerText = text.toLowerCase();
    let detectedEmotion = 'neutre';
    let confidence = 0.5;

    for (const [emotion, keywords] of Object.entries(emotions)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword));
      if (matches.length > 0) {
        detectedEmotion = emotion;
        confidence = Math.min(0.9, 0.6 + (matches.length * 0.1));
        break;
      }
    }

    const recommendations = await createCoachService().generateRecommendations(detectedEmotion);
    return { emotion: detectedEmotion, confidence, recommendations };
  },

  generateRecommendations: async (emotion: string): Promise<string[]> => {
    const map: Record<string, string[]> = {
      stress: ['Prenez quelques respirations profondes', 'Essayez une courte méditation de 5 minutes', 'Faites une pause et sortez prendre l\'air'],
      joie: ['Profitez de ce moment positif', 'Partagez votre joie avec vos proches', 'Notez ce qui vous rend heureux'],
      tristesse: ['Accordez-vous de la bienveillance', 'Contactez un proche de confiance', 'Considérez une activité qui vous réconforte'],
      colère: ['Prenez du recul avant de réagir', 'Exprimez vos sentiments de manière constructive', 'Faites de l\'exercice pour évacuer la tension'],
      peur: ['Identifiez ce qui déclenche votre anxiété', 'Pratiquez des techniques de relaxation', 'Parlez de vos peurs avec quelqu\'un de confiance'],
      neutre: ['Restez à l\'écoute de vos émotions', 'Maintenez un équilibre dans votre journée', 'Pratiquez la gratitude']
    };
    return map[emotion] || map.neutre;
  }
});

// Provider unifié
export const UnifiedCoachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState(new Date().toISOString());
  const [currentEmotion, setCurrentEmotion] = useState<string>();
  const [emotionConfidence, setEmotionConfidence] = useState<number>();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [conversationId] = useState(`conv-${Date.now()}`);
  const [coachService] = useState<CoachService>(createCoachService());

  // Load conversations from Supabase
  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('coach_conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('last_message_at', { ascending: false })
          .limit(50);

        if (fetchError) throw fetchError;

        const convs: ChatConversation[] = (data || []).map(c => ({
          id: c.id,
          title: c.title || 'Conversation',
          messages: [],
          createdAt: new Date(c.created_at),
          updatedAt: new Date(c.last_message_at || c.created_at),
          userId: c.user_id,
          isActive: false
        }));

        setConversations(convs);

        // Load the most recent conversation's messages
        if (convs.length > 0) {
          const latest = convs[0];
          const { data: msgs } = await supabase
            .from('coach_messages')
            .select('*')
            .eq('conversation_id', latest.id)
            .order('created_at', { ascending: true });

          const parsedMessages: ChatMessage[] = (msgs || []).map(m => ({
            id: m.id,
            content: m.content,
            text: m.content,
            conversationId: m.conversation_id,
            sender: m.sender as 'user' | 'assistant' | 'system',
            timestamp: m.created_at
          }));

          latest.messages = parsedMessages;
          latest.isActive = true;
          setCurrentConversation(latest);
          setMessages(parsedMessages);
        }

        // Migrate from localStorage if data exists and Supabase is empty
        if (convs.length === 0) {
          const saved = localStorage.getItem('unified_coach_conversations');
          if (saved) {
            try {
              const parsed = JSON.parse(saved) as ChatConversation[];
              if (parsed.length > 0) {
                setConversations(parsed);
                const active = parsed.find(c => c.isActive) || parsed[0];
                if (active) {
                  setCurrentConversation(active);
                  setMessages(active.messages || []);
                }
                // Clean up localStorage after migration
                localStorage.removeItem('unified_coach_conversations');
              }
            } catch {}
          }
        }
      } catch (err) {
        logger.error('Error loading coach conversations', err as Error, 'COACH');
        // Fallback to localStorage
        const saved = localStorage.getItem('unified_coach_conversations');
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as ChatConversation[];
            setConversations(parsed);
            const active = parsed.find(c => c.isActive);
            if (active) {
              setCurrentConversation(active);
              setMessages(active.messages || []);
            }
          } catch {}
        }
      }
    };

    loadConversations();
  }, [user?.id]);

  const createConversation = useCallback((): ChatConversation => {
    const userId = user?.id || 'anonymous';
    const newConv = createInitialConversation(userId);

    // Persist to Supabase
    if (user) {
      supabase
        .from('coach_conversations')
        .insert({ id: newConv.id, user_id: user.id, title: newConv.title })
        .then(({ error }) => {
          if (error) logger.error('Failed to persist conversation', error, 'COACH');
        });
    }

    const updatedConversations = conversations.map(c => ({ ...c, isActive: false }));
    setConversations([...updatedConversations, newConv]);
    setCurrentConversation(newConv);
    setMessages([]);
    return newConv;
  }, [conversations, user]);

  const sendMessage = useCallback(async (
    content: string,
    sender: 'user' | 'assistant' | 'system' = 'user'
  ): Promise<string> => {
    setIsProcessing(true);
    setError(null);

    try {
      let conversation = currentConversation;
      if (!conversation) {
        conversation = createConversation();
      }

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content,
        text: content,
        conversationId: conversation.id,
        sender,
        timestamp: new Date().toISOString()
      };

      if (sender === 'user') {
        try {
          const analysis = await coachService.analyzeEmotion(content);
          setCurrentEmotion(analysis.emotion);
          setEmotionConfidence(analysis.confidence);
          setRecommendations(analysis.recommendations);
        } catch (err) {
          logger.warn('Emotion analysis failed', err as Error, 'COACH');
        }
      }

      const response = await coachService.askQuestion(content);

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: response,
        text: response,
        conversationId: conversation.id,
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...conversation.messages, userMessage, aiMessage];
      const updatedConversation: ChatConversation = {
        ...conversation,
        messages: updatedMessages,
        updatedAt: new Date()
      };

      setMessages(updatedMessages);
      setCurrentConversation(updatedConversation);
      setConversations(prev =>
        prev.map(c => c.id === updatedConversation.id ? updatedConversation : c)
      );
      setLastActivity(new Date().toISOString());

      // Persist messages to Supabase
      if (user) {
        const messagesToInsert = [
          { conversation_id: conversation.id, content: userMessage.content, sender: userMessage.sender, message_type: 'text' },
          { conversation_id: conversation.id, content: aiMessage.content, sender: aiMessage.sender, message_type: 'text' }
        ];
        supabase.from('coach_messages').insert(messagesToInsert).then(({ error }) => {
          if (error) logger.error('Failed to persist messages', error, 'COACH');
        });
        supabase.from('coach_conversations').update({
          last_message_at: new Date().toISOString(),
          message_count: updatedMessages.length
        }).eq('id', conversation.id).then(({ error }) => {
          if (error) logger.error('Failed to update conversation', error, 'COACH');
        });
      }

      return response;
    } catch (err) {
      const errorMsg = 'Erreur lors de l\'envoi du message';
      setError(errorMsg);
      logger.error('sendMessage error', err as Error, 'COACH');
      return 'Désolé, une erreur s\'est produite.';
    } finally {
      setIsProcessing(false);
    }
  }, [currentConversation, createConversation, coachService, user]);

  const addMessage = useCallback((text: string, sender: 'user' | 'assistant' | 'system') => {
    sendMessage(text, sender);
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (currentConversation) {
      setCurrentConversation({ ...currentConversation, messages: [] });
    }
  }, [currentConversation]);

  const getConversations = useCallback(async () => conversations, [conversations]);

  const saveConversation = useCallback(async (conversation: ChatConversation) => {
    setConversations(prev =>
      prev.map(c => c.id === conversation.id ? conversation : c)
    );
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
      setMessages([]);
    }

    if (user) {
      supabase.from('coach_conversations').delete().eq('id', id).then(({ error }) => {
        if (error) logger.error('Failed to delete conversation', error, 'COACH');
      });
    }

    return true;
  }, [currentConversation, user]);

  const clearConversations = useCallback(() => {
    setConversations([]);
    setCurrentConversation(null);
    setMessages([]);
    localStorage.removeItem('unified_coach_conversations');

    if (user) {
      supabase.from('coach_conversations').delete().eq('user_id', user.id).then(({ error }) => {
        if (error) logger.error('Failed to clear conversations', error, 'COACH');
      });
    }
  }, [user]);

  const analyzeEmotion = useCallback(async (text: string) => coachService.analyzeEmotion(text), [coachService]);
  const generateRecommendations = useCallback(async (emotion: string) => coachService.generateRecommendations(emotion), [coachService]);

  const getSuggestions = useCallback((): Suggestion[] => [
    { id: '1', text: 'Comment gérer le stress au travail ?', type: 'question' },
    { id: '2', text: 'J\'ai besoin d\'aide pour l\'équilibre vie-travail', type: 'reflection' },
    { id: '3', text: 'Proposez-moi un exercice de pleine conscience', type: 'action' },
    { id: '4', text: 'Comment améliorer ma confiance en moi ?', type: 'question' }
  ], []);

  const value: UnifiedCoachContextType = {
    currentConversation, conversations, messages, loading, isProcessing, error, lastActivity,
    createConversation, setCurrentConversation, getConversations, saveConversation, deleteConversation, clearConversations,
    sendMessage, addMessage, clearMessages,
    currentEmotion, emotionConfidence, recommendations, analyzeEmotion, generateRecommendations,
    getSuggestions, coachService, conversationId
  };

  return (
    <UnifiedCoachContext.Provider value={value}>
      {children}
    </UnifiedCoachContext.Provider>
  );
};

export const useUnifiedCoach = () => {
  const context = useContext(UnifiedCoachContext);
  if (!context) throw new Error('useUnifiedCoach must be used within UnifiedCoachProvider');
  return context;
};

export const useCoachAskQuestion = (question: string) => {
  const coach = useUnifiedCoach();
  return useQuery({
    queryKey: ['coach', 'askQuestion', question],
    queryFn: () => coach.sendMessage(question),
    enabled: !!question,
    staleTime: 0,
  });
};

export const useCoachAnalyzeEmotion = (text: string) => {
  const coach = useUnifiedCoach();
  return useQuery({
    queryKey: ['coach', 'emotion', text],
    queryFn: () => coach.analyzeEmotion(text),
    enabled: !!text,
    staleTime: 5 * 60 * 1000,
  });
};

export const CoachProvider = UnifiedCoachProvider;
export const useCoach = useUnifiedCoach;
export const CoachContext = UnifiedCoachContext;
