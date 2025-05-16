
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useCoachHandlers } from './useCoachHandlers';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  isLoading?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface CoachContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isTyping: boolean;
  loadingMessage: string | null;
  coachCharacter: {
    name: string;
    avatar: string;
    personality: string;
    expertise: string[];
  };
  sendMessage: (content: string) => Promise<void>;
  startNewConversation: () => void;
  selectConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  setCoachCharacter: (character: CoachContextType['coachCharacter']) => void;
  getRecommendations: (category: string) => string[];
  analyzeEmotion: (text: string) => Promise<{ emotion: string; score: number }>;
}

const defaultCoachCharacter = {
  name: 'Emma',
  avatar: '/images/coach/emma.png',
  personality: 'empathetic',
  expertise: ['emotional intelligence', 'stress management', 'well-being']
};

export const CoachContext = createContext<CoachContextType>({
  conversations: [],
  currentConversation: null,
  isTyping: false,
  loadingMessage: null,
  coachCharacter: defaultCoachCharacter,
  sendMessage: async () => {},
  startNewConversation: () => {},
  selectConversation: () => {},
  renameConversation: () => {},
  deleteConversation: () => {},
  setCoachCharacter: () => {},
  getRecommendations: () => [],
  analyzeEmotion: async () => ({ emotion: 'neutral', score: 0 })
});

export const CoachProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // We use localStorage to persist conversations
  const [storedConversations, setStoredConversations] = useLocalStorage<Conversation[]>('coach_conversations', []);
  const [conversations, setConversations] = useState<Conversation[]>(storedConversations || []);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [coachCharacter, setCoachCharacter] = useState(defaultCoachCharacter);

  const { sendMessageHandler, analyzeEmotionHandler, getRecommendationsHandler } = useCoachHandlers({
    coachCharacter,
    setIsTyping,
    setLoadingMessage
  });

  // Set current conversation object based on ID
  const currentConversation = conversations.find(conv => conv.id === currentConversationId) || null;

  // Sync local state with localStorage when conversations change
  useEffect(() => {
    setStoredConversations(conversations);
  }, [conversations, setStoredConversations]);

  // Initialize with a default conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      startNewConversation();
    } else if (!currentConversationId) {
      // Set the most recent conversation as current
      const mostRecent = [...conversations].sort(
        (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      )[0];
      setCurrentConversationId(mostRecent.id);
    }
  }, [conversations, currentConversationId]);

  // Start a new conversation
  const startNewConversation = useCallback(() => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: 'Nouvelle conversation',
      messages: [],
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);

    // Add welcome message from coach
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        content: `Bonjour ! Je suis ${coachCharacter.name}, votre coach personnel. Comment puis-je vous aider aujourd'hui ?`,
        sender: 'coach',
        timestamp: new Date()
      };

      setConversations(prev =>
        prev.map(conv =>
          conv.id === newId
            ? {
                ...conv,
                messages: [...conv.messages, welcomeMessage],
                lastUpdated: new Date()
              }
            : conv
        )
      );
    }, 500);
  }, [coachCharacter.name]);

  // Send a new message
  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentConversationId) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-u-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };

    // Create temporary loading message
    const tempMessage: Message = {
      id: `msg-c-${Date.now()}`,
      content: '...',
      sender: 'coach',
      timestamp: new Date(),
      isLoading: true
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage, tempMessage],
              lastUpdated: new Date()
            }
          : conv
      )
    );

    setIsTyping(true);

    // Process the message with AI
    try {
      const response = await sendMessageHandler(content, currentConversation?.messages || []);

      // Update with the real response
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === tempMessage.id
                    ? {
                        ...msg,
                        content: response,
                        isLoading: false
                      }
                    : msg
                ),
                lastUpdated: new Date()
              }
            : conv
        )
      );

      // Update conversation title if this is the first exchange
      if (currentConversation && currentConversation.messages.length <= 2 && currentConversation.title === 'Nouvelle conversation') {
        renameConversation(currentConversationId, `Conversation sur ${content.substring(0, 20)}...`);
      }
    } catch (error) {
      console.error('Error getting coach response:', error);
      
      // Replace loading message with error
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === tempMessage.id
                    ? {
                        ...msg,
                        content: "Désolé, je n'ai pas pu traiter votre message. Veuillez réessayer.",
                        isLoading: false
                      }
                    : msg
                )
              }
            : conv
        )
      );
    } finally {
      setIsTyping(false);
      setLoadingMessage(null);
    }
  };

  // Select an existing conversation
  const selectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  // Rename a conversation
  const renameConversation = (id: string, title: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id
          ? {
              ...conv,
              title
            }
          : conv
      )
    );
  };

  // Delete a conversation
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversationId === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      if (remaining.length > 0) {
        setCurrentConversationId(remaining[0].id);
      } else {
        startNewConversation();
      }
    }
  };

  // Get emotional recommendations by category
  const getRecommendations = (category: string) => {
    return getRecommendationsHandler(category);
  };

  // Analyze emotion from text
  const analyzeEmotion = async (text: string) => {
    return await analyzeEmotionHandler(text);
  };

  const value = {
    conversations,
    currentConversation,
    isTyping,
    loadingMessage,
    coachCharacter,
    sendMessage,
    startNewConversation,
    selectConversation,
    renameConversation,
    deleteConversation,
    setCoachCharacter,
    getRecommendations,
    analyzeEmotion
  };

  return <CoachContext.Provider value={value}>{children}</CoachContext.Provider>;
};
