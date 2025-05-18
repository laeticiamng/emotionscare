
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
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
      conversation_id: conversationId || '' // Pour compatibilité
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };
  
  const addAssistantMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId || '',
      sender: 'assistant',
      text,
      timestamp: new Date().toISOString(),
      conversation_id: conversationId || '' // Pour compatibilité
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };
  
  const addSystemMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      conversationId: conversationId || '',
      sender: 'system',
      text,
      timestamp: new Date().toISOString(),
      conversation_id: conversationId || '' // Pour compatibilité
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage;
  };
  
  const updateMessage = (id: string, text: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === id ? { ...message, text } : message
      )
    );
  };
  
  const removeMessage = (id: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
  };
  
  // Mettre à jour les messages lorsque conversationId change
  useEffect(() => {
    if (conversationId) {
      // Dans une application réelle, récupérer les messages depuis une API
      // ici on peut simplement réinitialiser ou conserver l'état actuel
      // selon le besoin
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
