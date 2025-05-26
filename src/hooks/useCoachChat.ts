
import { useState } from 'react';
import { ChatMessage, ChatConversation } from '@/types/chat';

export const useCoachChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (content: string, sender: ChatMessage['sender'] = 'user') => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);

    if (sender === 'user') {
      setIsTyping(true);
      setIsProcessing(true);
      
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Je comprends votre message. Comment puis-je vous aider davantage ?',
          sender: 'coach',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
        setIsProcessing(false);
      }, 1500);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const startNewConversation = (title = 'Nouvelle conversation') => {
    const conversation: ChatConversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [...prev, conversation]);
    setCurrentConversation(conversation);
    return conversation.id;
  };

  const setActiveConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
      setMessages(conversation.messages);
    }
  };

  return {
    messages,
    conversations,
    currentConversation,
    isTyping,
    isProcessing,
    sendMessage,
    clearMessages,
    startNewConversation,
    setActiveConversation
  };
};
