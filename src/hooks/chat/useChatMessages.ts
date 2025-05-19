import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export interface UseChatMessagesProps {
  conversationId?: string;
  initialMessages?: ChatMessage[];
}

export const useChatMessages = ({ conversationId, initialMessages = [] }: UseChatMessagesProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);

  const addUserMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId || '',
      conversation_id: conversationId || '', // For compatibility
      sender: 'user',
      text,
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };
  
  const addAssistantMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId || '',
      conversation_id: conversationId || '', // For compatibility
      sender: 'assistant',
      text,
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };
  
  const addSystemMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId || '',
      conversation_id: conversationId || '', // For compatibility
      sender: 'system',
      text,
      content: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };
  
  const updateMessage = (id: string, text: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === id ? { ...message, text, content: text } : message
      )
    );
  };
  
  const removeMessage = (id: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
  };
  
  // Update messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      // In a real application, fetch messages from an API
      // Here we can simply reset or keep the current state
      // based on the requirement
    }
  }, [conversationId]);
  
  return {
    messages,
    loading,
    addUserMessage,
    addAssistantMessage,
    addSystemMessage,
    updateMessage,
    removeMessage,
    setMessages
  };
};

export default useChatMessages;
