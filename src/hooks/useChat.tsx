
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

type ChatRole = 'user' | 'assistant' | 'system';

const useChat = (initialConversationId: string = uuidv4()) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(initialConversationId);

  const addMessage = useCallback((content: string, role: ChatRole): ChatMessage => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: content,
      content: content,
      sender: role,
      role: role,
      timestamp: new Date().toISOString(),
      conversationId: conversationId,
      conversation_id: conversationId // Pour compatibilité
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  }, [conversationId]);

  const addAssistantMessage = useCallback((content: string): ChatMessage => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: content,
      content: content,
      sender: 'assistant',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      conversationId: conversationId,
      conversation_id: conversationId // Pour compatibilité
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  }, [conversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    addMessage(content, 'user');
    
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const response = `Réponse à: "${content}"`;
      addAssistantMessage(response);
      
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, addAssistantMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const startNewConversation = useCallback(() => {
    const newId = uuidv4();
    setConversationId(newId);
    clearMessages();
    return newId;
  }, [clearMessages]);

  return {
    messages,
    isLoading,
    conversationId,
    sendMessage,
    addMessage,
    clearMessages,
    startNewConversation
  };
};

export default useChat;
