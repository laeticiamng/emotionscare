
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/types';
import { getCoachMessages, sendCoachMessage } from '@/lib/coachService';
import { useAuth } from '@/contexts/AuthContext';
import { useCoachEvents } from './useCoachEvents';

export const useCoach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const { triggerCoachEvent } = useCoachEvents();
  
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
  
  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
    loadMessages
  };
};
