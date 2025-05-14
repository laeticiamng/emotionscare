
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage } from '@/types';

export interface CoachEvent {
  id: string;
  type: string;
  timestamp: string;
  data?: any;
}

export interface CoachContextType {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  loadMessages: () => Promise<void>;
  events: CoachEvent[];
  addEvent: (event: CoachEvent) => void;
  clearEvents: () => void;
  status: string;
  userContext: any;
  lastEmotion: any;
  recommendations: any[];
  generateRecommendation: () => void;
  coachService?: any;
}

const CoachContext = createContext<CoachContextType | undefined>(undefined);

export const CoachProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<CoachEvent[]>([]);
  const [status, setStatus] = useState<string>('idle');
  const [userContext, setUserContext] = useState<any>(null);
  const [lastEmotion, setLastEmotion] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const sendMessage = async (text: string): Promise<void> => {
    setLoading(true);
    try {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        role: 'user',
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Mock response
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: `Echo: ${text}`,
          sender: 'coach',
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, response]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const clearMessages = (): void => {
    setMessages([]);
  };

  const loadMessages = async (): Promise<void> => {
    setLoading(true);
    try {
      // Mock load
      setTimeout(() => {
        setMessages([]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const addEvent = (event: CoachEvent): void => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const clearEvents = (): void => {
    setEvents([]);
  };

  const generateRecommendation = (): void => {
    setRecommendations([
      {
        id: '1',
        title: 'Prendre une pause',
        description: 'Vous travaillez depuis un moment, pensez à faire une courte pause.',
        priority: 1,
        confidence: 0.8,
      }
    ]);
  };

  const coachService = {
    sendMessage,
    getMessages: () => messages,
    getContext: () => userContext,
    updateContext: (newContext: any) => setUserContext(newContext),
    getStatus: () => status,
    updateStatus: (newStatus: string) => setStatus(newStatus)
  };

  return (
    <CoachContext.Provider
      value={{
        messages,
        loading,
        sendMessage,
        clearMessages,
        loadMessages,
        events,
        addEvent,
        clearEvents,
        status,
        userContext,
        lastEmotion,
        recommendations,
        generateRecommendation,
        coachService
      }}
    >
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = (): CoachContextType => {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
};
