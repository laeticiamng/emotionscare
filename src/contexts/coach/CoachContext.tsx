
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import {
  ChatMessage,
  ChatConversation,
  CoachSession,
  Suggestion
} from '@/types/coach';

// Mock initial conversation
const initialConversation: ChatConversation = {
  id: 'init-convo',
  title: 'New Conversation',
  messages: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true
};

// Define CoachContextType
interface CoachContextType {
  currentConversation: ChatConversation | null;
  conversations: ChatConversation[];
  loading: boolean;
  error: string | null;
  createConversation: () => ChatConversation;
  sendMessage: (message: string, history?: any[]) => Promise<string>;
  getSuggestions: () => Suggestion[];
  setCurrentConversation: (conversation: ChatConversation | null) => void;
  getConversations: () => Promise<ChatConversation[]>;
  saveConversation: (conversation: ChatConversation) => Promise<void>;
  deleteConversation: (id: string) => Promise<boolean>;
  clearConversations: () => void;
  lastActivity: string;
}

// Create the context with a default value
export const CoachContext = createContext<CoachContextType>({
  currentConversation: null,
  conversations: [],
  loading: false,
  error: null,
  createConversation: () => initialConversation,
  sendMessage: async () => '',
  getSuggestions: () => [],
  setCurrentConversation: () => {},
  getConversations: async () => [],
  saveConversation: async () => {},
  deleteConversation: async () => false,
  clearConversations: () => {},
  lastActivity: new Date().toISOString()
});

// Provider component
export const CoachProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<string>(new Date().toISOString());

  // Mock suggestions
  const getSuggestions = (): Suggestion[] => {
    return [
      { id: '1', text: 'How can I manage stress?', type: 'question' },
      { id: '2', text: 'I need help with work-life balance', type: 'reflection' },
      { id: '3', text: 'Try a 5-minute mindfulness exercise', type: 'action' }
    ];
  };

  // Load conversations from local storage on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const savedConversations = localStorage.getItem('coach_conversations');
        if (savedConversations) {
          const parsedConversations = JSON.parse(savedConversations) as ChatConversation[];
          setConversations(parsedConversations);
          
          // If there's an active conversation, set it as current
          const active = parsedConversations.find(c => c.isActive);
          if (active) {
            setCurrentConversation(active);
          }
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
        setError('Failed to load conversation history');
      }
    };
    
    loadConversations();
  }, []);

  // Save conversations to local storage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('coach_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Create a new conversation
  const createConversation = useCallback(() => {
    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    
    // Mark all other conversations as inactive
    const updatedConversations = conversations.map(conv => ({
      ...conv,
      isActive: false
    }));
    
    setConversations([...updatedConversations, newConversation]);
    setCurrentConversation(newConversation);
    
    return newConversation;
  }, [conversations]);

  // Send a message to the AI coach
  const sendMessage = useCallback(async (message: string, history?: any[]) => {
    if (!currentConversation) {
      createConversation();
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Add user message to conversation
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: message,
        sender: 'user',
        isUser: true,
        timestamp: new Date().toISOString()
      };
      
      let conversation = currentConversation || createConversation();
      
      // Update conversation with user message
      const updatedMessages = [...conversation.messages, userMessage];
      const updatedConversation = {
        ...conversation,
        messages: updatedMessages,
        updatedAt: new Date().toISOString()
      };
      
      // Simulate AI response
      // In a real app, this would be an API call to your AI backend
      const mockResponse = "I understand how you're feeling. Let's work through this together.";
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: mockResponse,
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      // Update conversation with AI response
      const finalMessages = [...updatedMessages, aiMessage];
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages
      };
      
      // Update conversations state
      setCurrentConversation(finalConversation);
      setConversations(prevConversations => {
        return prevConversations.map(c => 
          c.id === finalConversation.id ? finalConversation : c
        );
      });
      
      setLastActivity(new Date().toISOString());
      return mockResponse;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return 'Sorry, I encountered an error. Please try again.';
    } finally {
      setLoading(false);
    }
  }, [currentConversation, createConversation]);

  // Get all conversations
  const getConversations = useCallback(async () => {
    return conversations;
  }, [conversations]);

  // Save a conversation
  const saveConversation = useCallback(async (conversation: ChatConversation) => {
    setConversations(prevConversations => {
      return prevConversations.map(c => 
        c.id === conversation.id ? conversation : c
      );
    });
    
    if (currentConversation?.id === conversation.id) {
      setCurrentConversation(conversation);
    }
  }, [currentConversation]);

  // Delete a conversation
  const deleteConversation = useCallback(async (id: string) => {
    setConversations(prevConversations => 
      prevConversations.filter(c => c.id !== id)
    );
    
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
    
    return true;
  }, [currentConversation]);

  // Clear all conversations
  const clearConversations = useCallback(() => {
    setConversations([]);
    setCurrentConversation(null);
    localStorage.removeItem('coach_conversations');
  }, []);

  const value = {
    currentConversation,
    conversations,
    loading,
    error,
    createConversation,
    sendMessage,
    getSuggestions,
    setCurrentConversation,
    getConversations,
    saveConversation,
    deleteConversation,
    clearConversations,
    lastActivity
  };

  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
};

// Custom hook to use the coach context
export const useCoach = () => {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
};
