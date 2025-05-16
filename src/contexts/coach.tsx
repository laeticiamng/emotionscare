
import { createContext, useState, useContext } from 'react';

// Définition du type ChatMessage pour la fonctionnalité de chat
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach' | string;
  timestamp: string;
}

export interface CoachContextType {
  isActive: boolean;
  toggleCoach: () => void;
  lastEmotion?: string | null;
  setLastEmotion?: (emotion: string | null) => void;
  // Ajout des propriétés manquantes pour CoachChat
  messages: ChatMessage[];
  sendMessage: (text: string, sender: string) => void;
  isProcessing: boolean;
  clearMessages: () => void;
  currentEmotion: string | null;
}

export const CoachContext = createContext<CoachContextType>({
  isActive: false,
  toggleCoach: () => {},
  lastEmotion: null,
  messages: [],
  sendMessage: () => {},
  isProcessing: false,
  clearMessages: () => {},
  currentEmotion: null
});

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
};

export const CoachProvider = ({ children }: { children: React.ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [lastEmotion, setLastEmotion] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const toggleCoach = () => {
    setIsActive(prev => !prev);
  };

  const sendMessage = (text: string, sender: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: text,
      sender: sender,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Si c'est un message de l'utilisateur, simuler une réponse du coach
    if (sender === 'user') {
      setIsProcessing(true);
      
      // Simuler un délai de traitement
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: `Je vous ai bien compris. En tant que coach IA, je suis là pour vous aider avec "${text}"`,
          sender: 'coach',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, responseMessage]);
        setIsProcessing(false);
      }, 1500);
    }
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  // Create the value object to be passed to the Provider
  const value: CoachContextType = {
    isActive,
    toggleCoach,
    lastEmotion,
    setLastEmotion,
    messages,
    sendMessage,
    isProcessing,
    clearMessages,
    currentEmotion
  };
  
  // Return the Provider with the value
  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
};
