
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { CoachEvent, CoachAction } from '@/lib/coach/types';

interface UseCoachChatReturn {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
  loadMessages: () => Promise<void>;
  events: CoachEvent[];
  notifications: any[];
  emotionalTrends: any[];
  dispatchAction: (action: CoachAction) => Promise<void>;
  lastEmotion: any;
  recommendations: any[]; // Adding this missing property
  generateRecommendation: (options: any) => Promise<void>; // Adding this missing method
}

export const useCoachChat = (): UseCoachChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<CoachEvent[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [emotionalTrends, setEmotionalTrends] = useState<any[]>([]);
  const [lastEmotion, setLastEmotion] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Load initial messages
  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            content: "Bonjour ! Je suis votre coach émotionnel. Comment puis-je vous aider aujourd'hui ?",
            sender: 'coach',
            role: 'assistant',
            timestamp: new Date().toISOString(),
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading messages:', error);
      setLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      
      // Add user message to state
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: text,
        sender: 'user',
        role: 'user',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate API response delay
      setTimeout(() => {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `Je comprends votre sentiment. Pouvez-vous m'en dire plus sur ce que vous ressentez actuellement ?`,
          sender: 'coach',
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const dispatchAction = async (action: CoachAction) => {
    console.log('Action dispatched:', action);
    // Implementation would go here
  };

  // Adding the missing method
  const generateRecommendation = async (options: any) => {
    console.log('Generating recommendation with options:', options);
    // Simulate API call to generate recommendations
    setTimeout(() => {
      setRecommendations([
        {
          id: '1',
          title: 'Méditation guidée',
          description: 'Une séance de 10 minutes pour retrouver le calme',
          priority: 1,
          confidence: 0.85,
          actionUrl: '/meditation/1',
          actionLabel: 'Commencer'
        },
        {
          id: '2',
          title: 'Journal émotionnel',
          description: 'Notez vos pensées pour prendre du recul',
          priority: 2, 
          confidence: 0.75,
          actionUrl: '/journal',
          actionLabel: 'Écrire'
        }
      ]);
    }, 1000);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
    loadMessages,
    events,
    notifications,
    emotionalTrends,
    dispatchAction,
    lastEmotion,
    recommendations, // Adding the recommendations array
    generateRecommendation // Adding the generateRecommendation function
  };
};

export default useCoachChat;
