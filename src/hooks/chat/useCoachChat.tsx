
// Fix missing parameters in useCoachChat.tsx
import { useState, useCallback } from 'react';
import { useCoach } from '@/contexts/coach/CoachContextProvider';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export const useCoachChat = () => {
  const coach = useCoach();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Use loading state from coach context
  const loading = coach.loading || false;
  
  const sendMessage = useCallback(async (message: string) => {
    try {
      setIsProcessing(true);
      // Create a new message object for the user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        conversationId: 'coach-conversation',
        sender: 'user',
        text: message,
        content: message, // Set both text and content for compatibility
        timestamp: new Date().toISOString()
      };
      
      // Add user message to the state
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Use the existing messages as history
      const response = await coach.sendMessage(message, messages);
      
      // Create a message object for the response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        conversationId: 'coach-conversation',
        sender: 'assistant',
        text: response,
        content: response, // Set both text and content for compatibility
        timestamp: new Date().toISOString()
      };
      
      // Add assistant message to the state
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [coach, messages]);
  
  const addMessage = useCallback((text: string, sender: 'system' | 'user' | 'ai' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: 'coach-conversation',
      sender: sender === 'ai' ? 'assistant' : sender,
      text,
      content: text, // Set both text and content for compatibility
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  }, []);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    sendMessage,
    isProcessing,
    loading,
    addMessage,
    clearMessages,
  };
};

export default useCoachChat;
