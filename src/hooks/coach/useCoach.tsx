
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types';
import { getCoachMessages, sendCoachMessage } from '@/lib/coach/coach-service';
import { useAuth } from '@/contexts/AuthContext';
import { useCoachEvents } from './useCoachEvents';

export const useCoach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const { triggerCoachEvent } = useCoachEvents();
  const [lastEmotion, setLastEmotion] = useState<string>('neutral');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  // Initial greeting message
  const initialMessage: ChatMessage = {
    id: 'greeting',
    text: "Bonjour, je suis votre coach émotionnel. Comment puis-je vous aider aujourd'hui ?",
    sender: 'coach',
    timestamp: new Date().toISOString(),
  };
  
  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, [userId]);
  
  // Load messages from API or storage
  const loadMessages = async () => {
    if (!userId) {
      setMessages([initialMessage]);
      return;
    }
    
    setLoading(true);
    
    try {
      const messages = await getCoachMessages(userId);
      
      if (messages.length === 0) {
        setMessages([initialMessage]);
      } else {
        setMessages(messages);
      }
    } catch (error) {
      console.error('Error loading coach messages:', error);
      setMessages([initialMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  // Send a message to the coach
  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim() || !userId) return;
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Send to API and get response
      const response = await sendCoachMessage(userId, text);
      
      // Notify relevant components about the message
      triggerCoachEvent('message_sent', { text });
      
      // Add coach response
      setMessages(prev => [...prev, {
        id: `coach-${Date.now()}`,
        text: response,
        sender: 'coach',
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error('Error sending message to coach:', error);
      
      // Add error message from coach
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        text: "Je suis désolé, je n'ai pas pu traiter votre message. Veuillez réessayer plus tard.",
        sender: 'coach',
        timestamp: new Date().toISOString(),
      }]);
    }
  };
  
  const clearMessages = useCallback(() => {
    setMessages([initialMessage]);
  }, []);

  // Generate recommendations based on emotional state
  const generateRecommendation = useCallback((emotion: string = 'neutral') => {
    setLastEmotion(emotion);
    
    const recommendationMap: Record<string, string[]> = {
      'happy': [
        'Maintenez cette énergie positive avec une activité créative',
        'Partagez votre bonheur avec quelqu\'un d\'autre aujourd\'hui',
        'Notez ce moment dans votre journal de gratitude'
      ],
      'sad': [
        'Accordez-vous un moment de repos et d\'autocompassion',
        'Écoutez une playlist apaisante',
        'Faites une courte promenade en plein air'
      ],
      'neutral': [
        'Essayez une méditation de 5 minutes',
        'Prenez un moment pour définir vos priorités',
        'Hydratez-vous et faites quelques étirements'
      ],
      'anxious': [
        'Pratiquez l\'exercice de respiration 4-7-8',
        'Écrivez vos préoccupations sur papier',
        'Concentrez-vous sur une tâche simple et concrète'
      ]
    };
    
    const defaultRecommendations = [
      'Prenez une pause de 5 minutes',
      'Respirez profondément plusieurs fois',
      'Faites le point sur vos émotions actuelles'
    ];
    
    const newRecommendations = recommendationMap[emotion.toLowerCase()] || defaultRecommendations;
    setRecommendations(newRecommendations);
    return newRecommendations;
  }, []);
  
  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
    loadMessages,
    lastEmotion,
    recommendations,
    generateRecommendation
  };
};
