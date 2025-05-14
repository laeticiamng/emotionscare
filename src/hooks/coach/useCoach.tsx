
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage } from '@/types';
import { 
  getCoachMessages, 
  sendCoachMessage, 
  createConversation 
} from '@/lib/coachService';
import { useCoachEvents } from './useCoachEvents';

export const useCoach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const coachEvents = useCoachEvents();

  // Add triggerCoachEvent function
  const triggerCoachEvent = useCallback((eventType: string, eventData: any = {}) => {
    if (coachEvents.addEvent) {
      coachEvents.addEvent(eventType, eventData);
    }
  }, [coachEvents]);

  const loadMessages = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const loadedMessages = await getCoachMessages(user.id);
      setMessages(loadedMessages || []);
    } catch (error) {
      console.error('Failed to load coach messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Add user message to the chat
      const userMessage: ChatMessage = {
        id: `tmp-${Date.now()}`,
        text,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Log coaching interaction event
      triggerCoachEvent('coach_interaction', { 
        type: 'message_sent', 
        content_length: text.length 
      });
      
      // Get coach's response
      const response = await sendCoachMessage(user.id, text);
      
      if (response) {
        setMessages(prev => [...prev, response]);
      }
    } catch (error) {
      console.error('Failed to send message to coach:', error);
    } finally {
      setLoading(false);
    }
  }, [user, triggerCoachEvent]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Load messages on mount
  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user, loadMessages]);

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
    loadMessages,
    triggerCoachEvent
  };
};

export default useCoach;
