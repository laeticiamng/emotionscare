
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useQueryClient } from '@tanstack/react-query';
import { ChatMessage } from '@/types/chat';

export const useCoachChatActions = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [responseContent, setResponseContent] = useState<string>('');
  const queryClient = useQueryClient();

  // Add user message
  const addUserMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    return newMessage;
  }, []);
  
  // Add AI response
  const addAIResponse = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: content,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    return newMessage;
  }, []);

  // This simulates the AI thinking and responding
  const simulateTyping = useCallback((messagePromise: Promise<string>) => {
    setIsTyping(true);
    
    // Create temporary message object while response is loading
    const tempMessage: ChatMessage = {
      id: uuidv4(),
      text: '...',
      sender: 'bot',
      timestamp: new Date(),
    };
    
    // Process the actual response when ready
    messagePromise.then(response => {
      // Store response content for streaming visualization
      setResponseContent(response);
      
      // Invalidate query cache if needed
      queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] });
    })
    .catch(error => {
      console.error('Error processing message:', error);
    })
    .finally(() => {
      setIsTyping(false);
    });
    
    return tempMessage;
  }, [conversationId, queryClient]);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setResponseContent('');
  }, []);

  return {
    messages,
    isTyping,
    responseContent,
    addUserMessage,
    addAIResponse,
    simulateTyping,
    clearMessages
  };
};
