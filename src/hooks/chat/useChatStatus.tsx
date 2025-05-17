
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

export const useChatStatus = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      // Reset unread count when opening chat
      setUnreadMessages(0);
    }
  };
  
  const startTyping = () => setIsTyping(true);
  const stopTyping = () => setIsTyping(false);
  
  const createSystemMessage = (text: string, conversationId: string): ChatMessage => {
    return {
      id: uuidv4(),
      text,
      content: text,
      sender: 'system',
      role: 'system',
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
  };

  const createUserMessage = (text: string, conversationId: string): ChatMessage => {
    return {
      id: uuidv4(),
      text,
      content: text,
      sender: 'user',
      role: 'user',
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
  };

  const createAssistantMessage = (text: string, conversationId: string): ChatMessage => {
    return {
      id: uuidv4(),
      text,
      content: text,
      sender: 'assistant',
      role: 'assistant',
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
  };
  
  const incrementUnreadCount = () => {
    if (!isChatOpen) {
      setUnreadMessages(prev => prev + 1);
    }
  };
  
  return {
    isChatOpen,
    isTyping,
    unreadMessages,
    toggleChat,
    startTyping,
    stopTyping,
    createSystemMessage,
    createUserMessage,
    createAssistantMessage,
    incrementUnreadCount,
  };
};
