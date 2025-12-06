/**
 * COACH CONTEXT UNIFIÉ - EmotionsCare
 * Fusion optimisée de toutes les versions de CoachContext
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChatMessage, ChatConversation } from '@/types/chat';
import { Suggestion } from '@/types/coach';

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
  // État principal
  currentConversation: ChatConversation | null;
  conversations: ChatConversation[];
  messages: ChatMessage[];
  loading: boolean;
  isProcessing: boolean;
  error: string | null;
  lastActivity: string;

  // Gestion des conversations
  createConversation: () => ChatConversation;
  setCurrentConversation: (conversation: ChatConversation | null) => void;
  getConversations: () => Promise<ChatConversation[]>;
  saveConversation: (conversation: ChatConversation) => Promise<void>;
  deleteConversation: (id: string) => Promise<boolean>;
  clearConversations: () => void;

  // Messages et communication
  sendMessage: (content: string, sender?: 'user' | 'assistant' | 'system') => Promise<string>;
  addMessage: (text: string, sender: 'user' | 'assistant' | 'system') => void;
  clearMessages: () => void;

  // Analyse émotionnelle
  currentEmotion?: string;
  emotionConfidence?: number;
  recommendations: string[];
  analyzeEmotion: (text: string) => Promise<EmotionAnalysis>;
  generateRecommendations: (emotion: string) => Promise<string[]>;

  // Suggestions et aide
  getSuggestions: () => Suggestion[];
  
  // Service coach
  coachService: CoachService | null;
  conversationId: string;
}

// Contexte unifié
const UnifiedCoachContext = createContext<UnifiedCoachContextType | null>(null);

// Mock initial conversation
const createInitialConversation = (): ChatConversation => ({
  id: `conv-${Date.now()}`,
  title: 'Nouvelle conversation',
  messages: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true
});

// Service coach mock
const createCoachService = (): CoachService => ({
  askQuestion: async (question: string): Promise<string> => {
    // Simulation d'une réponse IA
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Je comprends votre question : "${question}". Laissez-moi vous aider à explorer cela ensemble.`;
  },

  analyzeEmotion: async (text: string): Promise<EmotionAnalysis> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple analyse basée sur des mots-clés
    const emotions = {
      stress: ['stress', 'anxieux', 'tendu', 'pression'],
      joie: ['heureux', 'joyeux', 'content', 'satisfait'],
      tristesse: ['triste', 'déprimé', 'mélancolique', 'abattu'],
      colère: ['colère', 'énervé', 'frustré', 'agacé'],
      peur: ['peur', 'anxiété', 'inquiet', 'angoisse']
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

    const recommendations = await this.generateRecommendations(detectedEmotion);

    return {
      emotion: detectedEmotion,
      confidence,
      recommendations
    };
  },

  generateRecommendations: async (emotion: string): Promise<string[]> => {
    const recommendationsMap: Record<string, string[]> = {
      stress: [
        'Prenez quelques respirations profondes',
        'Essayez une courte méditation de 5 minutes',
        'Faites une pause et sortez prendre l\'air'
      ],
      joie: [
        'Profitez de ce moment positif',
        'Partagez votre joie avec vos proches',
        'Notez ce qui vous rend heureux'
      ],
      tristesse: [
        'Accordez-vous de la bienveillance',
        'Contactez un proche de confiance',
        'Considérez une activité qui vous réconforte'
      ],
      colère: [
        'Prenez du recul avant de réagir',
        'Exprimez vos sentiments de manière constructive',
        'Faites de l\'exercice pour évacuer la tension'
      ],
      peur: [
        'Identifiez ce qui déclenche votre anxiété',
        'Pratiquez des techniques de relaxation',
        'Parlez de vos peurs avec quelqu\'un de confiance'
      ],
      neutre: [
        'Restez à l\'écoute de vos émotions',
        'Maintenez un équilibre dans votre journée',
        'Pratiquez la gratitude'
      ]
    };

    return recommendationsMap[emotion] || recommendationsMap.neutre;
  }
});

// Provider unifié
export const UnifiedCoachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // États
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

  // Service coach
  const [coachService] = useState<CoachService>(createCoachService());

  // Charger les conversations au démarrage
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const saved = localStorage.getItem('unified_coach_conversations');
        if (saved) {
          const parsed = JSON.parse(saved) as ChatConversation[];
          setConversations(parsed);
          
          const active = parsed.find(c => c.isActive);
          if (active) {
            setCurrentConversation(active);
            setMessages(active.messages);
          }
        }
      } catch (err) {
        console.error('Erreur chargement conversations:', err);
        setError('Impossible de charger l\'historique');
      }
    };

    loadConversations();
  }, []);

  // Sauvegarder les conversations
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('unified_coach_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Créer une nouvelle conversation
  const createConversation = useCallback(() => {
    const newConv = createInitialConversation();
    
    const updatedConversations = conversations.map(c => ({
      ...c,
      isActive: false
    }));
    
    setConversations([...updatedConversations, newConv]);
    setCurrentConversation(newConv);
    setMessages([]);
    
    return newConv;
  }, [conversations]);

  // Envoyer un message
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

      // Message utilisateur
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content,
        sender,
        isUser: sender === 'user',
        timestamp: new Date().toISOString()
      };

      // Analyser l'émotion si c'est un message utilisateur
      if (sender === 'user') {
        try {
          const analysis = await coachService.analyzeEmotion(content);
          setCurrentEmotion(analysis.emotion);
          setEmotionConfidence(analysis.confidence);
          setRecommendations(analysis.recommendations);
        } catch (err) {
          console.warn('Erreur analyse émotion:', err);
        }
      }

      // Obtenir la réponse du coach
      const response = await coachService.askQuestion(content);
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: response,
        sender: 'assistant',
        isUser: false,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...conversation.messages, userMessage, aiMessage];
      const updatedConversation = {
        ...conversation,
        messages: updatedMessages,
        updatedAt: new Date().toISOString()
      };

      // Mettre à jour les états
      setMessages(updatedMessages);
      setCurrentConversation(updatedConversation);
      setConversations(prev => 
        prev.map(c => c.id === updatedConversation.id ? updatedConversation : c)
      );
      setLastActivity(new Date().toISOString());

      return response;
    } catch (err) {
      const errorMsg = 'Erreur lors de l\'envoi du message';
      setError(errorMsg);
      console.error('Erreur sendMessage:', err);
      return 'Désolé, une erreur s\'est produite.';
    } finally {
      setIsProcessing(false);
    }
  }, [currentConversation, createConversation, coachService]);

  // Autres méthodes
  const addMessage = useCallback((text: string, sender: 'user' | 'assistant' | 'system') => {
    sendMessage(text, sender);
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (currentConversation) {
      const clearedConv = { ...currentConversation, messages: [] };
      setCurrentConversation(clearedConv);
    }
  }, [currentConversation]);

  const getConversations = useCallback(async () => {
    return conversations;
  }, [conversations]);

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
    return true;
  }, [currentConversation]);

  const clearConversations = useCallback(() => {
    setConversations([]);
    setCurrentConversation(null);
    setMessages([]);
    localStorage.removeItem('unified_coach_conversations');
  }, []);

  const analyzeEmotion = useCallback(async (text: string) => {
    return coachService.analyzeEmotion(text);
  }, [coachService]);

  const generateRecommendations = useCallback(async (emotion: string) => {
    return coachService.generateRecommendations(emotion);
  }, [coachService]);

  const getSuggestions = useCallback((): Suggestion[] => {
    return [
      { id: '1', text: 'Comment gérer le stress au travail ?', type: 'question' },
      { id: '2', text: 'J\'ai besoin d\'aide pour l\'équilibre vie-travail', type: 'reflection' },
      { id: '3', text: 'Proposez-moi un exercice de pleine conscience', type: 'action' },
      { id: '4', text: 'Comment améliorer ma confiance en moi ?', type: 'question' }
    ];
  }, []);

  const value: UnifiedCoachContextType = {
    // État
    currentConversation,
    conversations,
    messages,
    loading,
    isProcessing,
    error,
    lastActivity,

    // Conversations
    createConversation,
    setCurrentConversation,
    getConversations,
    saveConversation,
    deleteConversation,
    clearConversations,

    // Messages
    sendMessage,
    addMessage,
    clearMessages,

    // Émotions
    currentEmotion,
    emotionConfidence,
    recommendations,
    analyzeEmotion,
    generateRecommendations,

    // Utilitaires
    getSuggestions,
    coachService,
    conversationId
  };

  return (
    <UnifiedCoachContext.Provider value={value}>
      {children}
    </UnifiedCoachContext.Provider>
  );
};

// Hook unifié
export const useUnifiedCoach = () => {
  const context = useContext(UnifiedCoachContext);
  if (!context) {
    throw new Error('useUnifiedCoach must be used within UnifiedCoachProvider');
  }
  return context;
};

// Hook pour requêtes avec React Query
export const useCoachQueries = () => {
  const coach = useUnifiedCoach();

  const askQuestion = (question: string) => {
    return useQuery({
      queryKey: ['coach', 'askQuestion', question],
      queryFn: () => coach.sendMessage(question),
      enabled: !!question,
      staleTime: 0, // Toujours fresh
    });
  };

  const analyzeEmotion = (text: string) => {
    return useQuery({
      queryKey: ['coach', 'emotion', text],
      queryFn: () => coach.analyzeEmotion(text),
      enabled: !!text,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    askQuestion,
    analyzeEmotion,
  };
};

// Exports pour compatibilité
export const CoachProvider = UnifiedCoachProvider;
export const useCoach = useUnifiedCoach;
export const CoachContext = UnifiedCoachContext;