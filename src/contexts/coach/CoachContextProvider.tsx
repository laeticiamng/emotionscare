
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from './useLocalStorage';
import { useCoachHandlers } from './useCoachHandlers';

// Types
export type MessageSender = 'user' | 'coach' | 'system';

export interface CoachMessage {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
  read?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: CoachMessage[];
  lastMessage?: string;
  lastMessageTimestamp?: string;
  isArchived?: boolean;
}

export interface CoachContextType {
  messages: CoachMessage[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isProcessing: boolean;
  currentEmotion: string | null;
  sendMessage: (content: string, sender: MessageSender) => void;
  newConversation: () => void;
  loadConversation: (conversationId: string) => void;
  archiveConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  clearMessages: () => void;
  setCurrentEmotion: (emotion: string | null) => void;
}

// Create the context with default values
export const CoachContext = createContext<CoachContextType>({
  messages: [],
  conversations: [],
  currentConversation: null,
  isProcessing: false,
  currentEmotion: null,
  sendMessage: () => {},
  newConversation: () => {},
  loadConversation: () => {},
  archiveConversation: () => {},
  deleteConversation: () => {},
  clearMessages: () => {},
  setCurrentEmotion: () => {},
});

export const CoachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('coach-conversations', []);
  const [currentConversationId, setCurrentConversationId] = useLocalStorage<string | null>('current-conversation-id', null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  
  const { processUserMessage } = useCoachHandlers({ 
    setIsProcessing,
    setMessages,
    currentEmotion
  });

  // Initialize or load conversation
  useEffect(() => {
    if (conversations.length === 0) {
      const initialConversation: Conversation = {
        id: uuidv4(),
        title: 'Nouvelle conversation',
        messages: [],
      };
      setConversations([initialConversation]);
      setCurrentConversationId(initialConversation.id);
    } else if (currentConversationId) {
      const conversation = conversations.find(c => c.id === currentConversationId);
      if (conversation) {
        setCurrentConversation(conversation);
        setMessages(conversation.messages);
      } else {
        // If conversation not found, set the first one as current
        setCurrentConversationId(conversations[0].id);
      }
    } else {
      // If no current conversation, set the first one
      setCurrentConversationId(conversations[0].id);
    }
  }, [currentConversationId, conversations, setConversations, setCurrentConversationId]);

  // Update conversation when messages change
  useEffect(() => {
    if (currentConversation && JSON.stringify(currentConversation.messages) !== JSON.stringify(messages)) {
      const updatedConversation = {
        ...currentConversation,
        messages,
        lastMessage: messages.length > 0 ? messages[messages.length - 1].content : undefined,
        lastMessageTimestamp: messages.length > 0 ? messages[messages.length - 1].timestamp : undefined,
      };
      
      setCurrentConversation(updatedConversation);
      
      setConversations(prevConversations => 
        prevConversations.map(c => 
          c.id === updatedConversation.id ? updatedConversation : c
        )
      );
    }
  }, [messages, currentConversation, setConversations]);

  const sendMessage = useCallback((content: string, sender: MessageSender) => {
    if (!content.trim()) return;
    
    const newMessage: CoachMessage = {
      id: uuidv4(),
      content,
      sender,
      timestamp: new Date().toISOString(),
      read: true,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (sender === 'user') {
      setIsProcessing(true);
      processUserMessage(content, setMessages);
    }
  }, [processUserMessage]);

  const newConversation = useCallback(() => {
    const initialConversation: Conversation = {
      id: uuidv4(),
      title: 'Nouvelle conversation',
      messages: [],
    };
    
    setConversations(prev => [initialConversation, ...prev]);
    setCurrentConversationId(initialConversation.id);
    setMessages([]);
    
    // Add welcome message
    setTimeout(() => {
      sendMessage("Bonjour, je suis votre coach EmotionsCare. Comment puis-je vous aider aujourd'hui ?", 'coach');
    }, 300);
  }, [sendMessage, setConversations, setCurrentConversationId]);

  const loadConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setMessages(conversation.messages);
    } else {
      toast({
        title: "Conversation non trouvée",
        description: "La conversation demandée n'existe pas ou a été supprimée.",
        variant: "destructive"
      });
    }
  }, [conversations, setCurrentConversationId, toast]);

  const archiveConversation = useCallback((conversationId: string) => {
    setConversations(prev => 
      prev.map(c => 
        c.id === conversationId 
          ? { ...c, isArchived: true } 
          : c
      )
    );
    
    if (currentConversationId === conversationId) {
      const activeConversations = conversations.filter(c => !c.isArchived && c.id !== conversationId);
      if (activeConversations.length > 0) {
        setCurrentConversationId(activeConversations[0].id);
      } else {
        newConversation();
      }
    }
    
    toast({
      title: "Conversation archivée",
      description: "La conversation a été archivée avec succès."
    });
  }, [conversations, currentConversationId, setCurrentConversationId, setConversations, newConversation, toast]);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    if (currentConversationId === conversationId) {
      const remainingConversations = conversations.filter(c => c.id !== conversationId);
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id);
      } else {
        newConversation();
      }
    }
    
    toast({
      title: "Conversation supprimée",
      description: "La conversation a été supprimée avec succès."
    });
  }, [conversations, currentConversationId, setCurrentConversationId, setConversations, newConversation, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (currentConversation) {
      const updatedConversation = {
        ...currentConversation,
        messages: [],
        lastMessage: undefined,
        lastMessageTimestamp: undefined,
      };
      
      setConversations(prevConversations => 
        prevConversations.map(c => 
          c.id === updatedConversation.id ? updatedConversation : c
        )
      );
    }
  }, [currentConversation, setConversations]);

  // Context value
  const contextValue: CoachContextType = {
    messages,
    conversations,
    currentConversation,
    isProcessing,
    currentEmotion,
    sendMessage,
    newConversation,
    loadConversation,
    archiveConversation,
    deleteConversation,
    clearMessages,
    setCurrentEmotion,
  };

  return (
    <CoachContext.Provider value={contextValue}>
      {children}
    </CoachContext.Provider>
  );
};

// Custom hook to use the coach context
export const useCoach = () => useContext(CoachContext);
