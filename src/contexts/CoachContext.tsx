
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CoachContextType, ChatMessage, CoachEvent } from '@/types/coach';
import { openAIClient, generateChatResponse } from '@/lib/api/openAIClient';
import { useToast } from '@/hooks/use-toast';

const CoachContext = createContext<CoachContextType | undefined>(undefined);

export const CoachProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
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
      // Add user message to the chat
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        role: 'user',
        timestamp: new Date().toISOString(),
      };
      
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      
      // Use OpenAI API to generate a response
      try {
        const response = await generateChatResponse(
          updatedMessages,
          'gpt-4o-mini',
          0.7
        );
        
        let assistantMessage: string;
        if (typeof response === 'string') {
          assistantMessage = response;
        } else if (response && response.choices && response.choices[0]) {
          assistantMessage = response.choices[0].message.content || "Je n'ai pas compris. Pouvez-vous reformuler ?";
        } else {
          throw new Error('Invalid response format');
        }
        
        const assistantChatMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: assistantMessage,
          content: assistantMessage,
          sender: 'coach',
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };
        
        setMessages((prevMessages) => [...prevMessages, assistantChatMessage]);
      } catch (error) {
        console.error('Error generating AI response:', error);
        
        // Fallback response
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "Je suis désolé, j'ai rencontré un problème. Pouvons-nous réessayer ?",
          sender: 'coach',
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };
        
        setMessages((prevMessages) => [...prevMessages, fallbackMessage]);
        
        toast({
          title: "Problème de connexion",
          description: "Impossible de contacter l'assistant IA. Utilisation d'une réponse de secours.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in coach communication:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = (): void => {
    setMessages([]);
  };

  const loadMessages = async (): Promise<void> => {
    setLoading(true);
    try {
      // In a real app, we would load messages from storage or API
      setMessages([{
        id: 'welcome-message',
        text: "Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd'hui ?",
        content: "Bonjour, je suis votre coach IA. Comment puis-je vous aider aujourd'hui ?",
        sender: 'coach',
        role: 'assistant',
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
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
    // In a real implementation, this would call an AI API to generate personalized recommendations
    setRecommendations([
      {
        id: '1',
        title: 'Prendre une pause',
        description: 'Vous travaillez depuis un moment, pensez à faire une courte pause.',
        priority: 1,
        confidence: 0.8,
      },
      {
        id: '2',
        title: 'Exercice de respiration',
        description: 'Un exercice de respiration 4-7-8 pourrait vous aider à vous recentrer.',
        priority: 2,
        confidence: 0.7,
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
