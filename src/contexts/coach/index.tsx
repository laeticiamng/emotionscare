
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage } from '@/types/coach';
import { EmotionResult } from '@/types/emotion';
import { v4 as uuidv4 } from 'uuid';

export interface CoachContextType {
  messages: ChatMessage[];
  isTyping: boolean;
  conversations: { id: string; title: string }[];
  activeConversationId: string | null;
  lastEmotion: string | null;
  emotionHistory: EmotionResult[];
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearConversation: () => void;
  startNewConversation: (title?: string) => string;
  setActiveConversation: (id: string) => void;
  updateLastEmotion: (emotion: string) => void;
  sendMessage: (content: string) => Promise<void>;
}

const defaultContext: CoachContextType = {
  messages: [],
  isTyping: false,
  conversations: [],
  activeConversationId: null,
  lastEmotion: null,
  emotionHistory: [],
  addMessage: () => {},
  clearConversation: () => {},
  startNewConversation: () => '',
  setActiveConversation: () => {},
  updateLastEmotion: () => {},
  sendMessage: async () => {}
};

export const CoachContext = createContext<CoachContextType>(defaultContext);

export const useCoach = () => useContext(CoachContext);

export const CoachProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<{ id: string; title: string }[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);

  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    const newMessage = { ...message, id: uuidv4() };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const startNewConversation = (title = "Nouvelle conversation") => {
    const id = uuidv4();
    setConversations(prev => [...prev, { id, title }]);
    setActiveConversationId(id);
    clearConversation();
    return id;
  };

  const setActiveConversation = (id: string) => {
    setActiveConversationId(id);
    // Charger les messages de cette conversation (à implémenter avec API)
  };

  const updateLastEmotion = (emotion: string) => {
    setLastEmotion(emotion);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Ajouter le message de l'utilisateur
    addMessage({
      content,
      sender: 'user',
      role: 'user',
      timestamp: new Date().toISOString()
    });
    
    // Simuler la réponse du coach
    setIsTyping(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler la latence
      
      addMessage({
        content: `Je comprends ce que vous dites à propos de "${content}". Comment puis-je vous aider davantage ?`,
        sender: 'coach',
        role: 'assistant',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <CoachContext.Provider
      value={{
        messages,
        isTyping,
        conversations,
        activeConversationId,
        lastEmotion,
        emotionHistory,
        addMessage,
        clearConversation,
        startNewConversation,
        setActiveConversation,
        updateLastEmotion,
        sendMessage
      }}
    >
      {children}
    </CoachContext.Provider>
  );
};

export default CoachContext;
