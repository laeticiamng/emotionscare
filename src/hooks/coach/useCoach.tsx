
import { useState } from 'react';
import { ChatMessage } from '@/types';
import { CoachEvent } from '@/lib/coach/types';

export const useCoach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<CoachEvent[]>([]);
  const [lastEmotion, setLastEmotion] = useState<any>(null);

  // Function to send a message to the coach
  const sendMessage = async (text: string) => {
    setLoading(true);
    try {
      // Create a new user message
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: text,
        role: 'user',
        timestamp: new Date().toISOString()
      };
      
      // Add the user message to the messages state
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Simulate an API call to get a response from the coach
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock response
      const coachResponse: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: `Merci pour votre message. En tant que coach IA, je suis là pour vous aider.`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      // Add the coach response to the messages state
      setMessages(prevMessages => [...prevMessages, coachResponse]);
    } catch (error) {
      console.error('Error sending message to coach:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to clear all messages
  const clearMessages = () => {
    setMessages([]);
  };
  
  // Function to load messages from storage or API
  const loadMessages = async () => {
    setLoading(true);
    try {
      // Simulate loading messages
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set mock messages
      setMessages([
        {
          id: 'msg-1',
          content: 'Bonjour, comment puis-je vous aider aujourd\'hui?',
          role: 'assistant',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to add an event
  const addEvent = (eventType: string, eventData: any = {}) => {
    const newEvent: CoachEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      data: eventData,
      timestamp: new Date()
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    
    // If the event is an emotion update, also update lastEmotion
    if (eventType === 'emotion_detected' && eventData.emotion) {
      setLastEmotion(eventData.emotion);
    }
  };
  
  // Function to fetch events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Simulate fetching events
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set mock events
      setEvents([
        {
          id: 'event-1',
          type: 'session_start',
          data: {},
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to trigger a coach event
  const triggerCoachEvent = (eventType: string, eventData: any = {}) => {
    addEvent(eventType, eventData);
    
    // In a real implementation, we might want to do something with this event
    console.log(`Coach event triggered: ${eventType}`, eventData);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
    loadMessages,
    events,
    isLoading: loading,
    addEvent,
    fetchEvents,
    triggerCoachEvent,
    lastEmotion
  };
};
