
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EmotionResult } from '@/types/emotion';
import { ChatMessage, ChatConversation as Conversation } from '@/types/chat';

export interface CoachContextType {
  messages: ChatMessage[];
  isProcessing: boolean;
  isTyping: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  lastEmotion: string | null;
  emotionHistory: EmotionResult[];
  currentEmotion: string | null;
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearMessages: () => void;
  startNewConversation: (title?: string) => string;
  setActiveConversation: (id: string) => void;
  updateLastEmotion: (emotion: string) => void;
  sendMessage: (content: string, sender: 'user' | 'assistant' | 'system' | 'coach') => Promise<void>;
}

const defaultContext: CoachContextType = {
  messages: [],
  isProcessing: false,
  isTyping: false,
  conversations: [],
  activeConversationId: null,
  lastEmotion: null,
  currentEmotion: null,
  emotionHistory: [],
  addMessage: () => {},
  clearMessages: () => {},
  startNewConversation: () => '',
  setActiveConversation: () => {},
  updateLastEmotion: () => {},
  sendMessage: async () => {}
};

export const CoachContext = createContext<CoachContextType>(defaultContext);

export const useCoach = () => useContext(CoachContext);

export const CoachProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);

  // Add a new message to the current conversation
  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    const newMessage = {
      ...message,
      id: uuidv4(),
      timestamp: message.timestamp || new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage as ChatMessage]);
    
    // Update conversation list if this is active
    if (activeConversationId) {
      // In a real app, this would update the conversation in a database
      console.log('Updating conversation:', activeConversationId);
    }
  };

  // Clear all messages in the current conversation
  const clearMessages = () => {
    setMessages([]);
  };

  // Start a new conversation
  const startNewConversation = (title?: string) => {
    const id = uuidv4();
    const newConversation: Conversation = {
      id,
      title: title || `Conversation ${conversations.length + 1}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(id);
    clearMessages();
    
    return id;
  };

  // Set the active conversation
  const setActiveConversation = (id: string) => {
    setActiveConversationId(id);
    // In a real app, this would load the conversation messages from a database
    clearMessages();
  };

  // Update the last detected emotion
  const updateLastEmotion = (emotion: string) => {
    setLastEmotion(emotion);
    setCurrentEmotion(emotion);
  };

  // Simple AI response generator (for demo purposes)
  const generateCoachResponse = async (userMessage: string): Promise<string> => {
    // In a real app, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Simple responses based on keywords
    if (userMessage.toLowerCase().includes('bonjour') || userMessage.toLowerCase().includes('salut')) {
      return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
    }
    
    if (userMessage.toLowerCase().includes('merci')) {
      return 'Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?';
    }
    
    if (userMessage.toLowerCase().includes('stress') || userMessage.toLowerCase().includes('stressé')) {
      return 'Le stress est une réaction naturelle. Avez-vous essayé des exercices de respiration ? Je peux vous en montrer quelques-uns si vous le souhaitez.';
    }
    
    if (userMessage.toLowerCase().includes('triste') || userMessage.toLowerCase().includes('déprimé')) {
      return 'Je comprends que vous vous sentiez ainsi. Parler de ce qui vous préoccupe peut aider. Souhaitez-vous m\'en dire plus ?';
    }
    
    // Default response
    return 'Je suis là pour vous aider. Pouvez-vous m\'en dire plus sur ce que vous ressentez ?';
  };

  // Send a message and get a response if it's from user
  const sendMessage = async (content: string, sender: 'user' | 'assistant' | 'system' | 'coach') => {
    if (!content.trim()) return;
    
    // Add the user/system message
    addMessage({
      content,
      sender,
      timestamp: new Date().toISOString()
    });
    
    // Generate and add coach response if the message is from user
    if (sender === 'user') {
      setIsProcessing(true);
      
      try {
        const response = await generateCoachResponse(content);
        
        // Small delay to make it feel more natural
        setTimeout(() => {
          addMessage({
            content: response,
            sender: 'coach',
            timestamp: new Date().toISOString()
          });
          setIsProcessing(false);
        }, 500);
      } catch (error) {
        console.error('Error generating coach response:', error);
        setIsProcessing(false);
        
        // Add error message
        addMessage({
          content: 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer.',
          sender: 'system',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  // Context value
  const value: CoachContextType = {
    messages,
    isProcessing,
    isTyping: isProcessing, // Alias for compatibility
    conversations,
    activeConversationId,
    lastEmotion,
    currentEmotion,
    emotionHistory,
    addMessage,
    clearMessages,
    startNewConversation,
    setActiveConversation,
    updateLastEmotion,
    sendMessage
  };

  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
};

export default CoachContext;
