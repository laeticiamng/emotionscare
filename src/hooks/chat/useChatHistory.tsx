
import { useState, useCallback } from 'react';
import { ChatMessage, ChatConversation } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface UseChatHistoryResult {
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  messages: ChatMessage[];
  addUserMessage: (text: string) => void;
  addBotMessage: (text: string) => void;
  addSystemMessage: (text: string) => void;
  createNewConversation: () => void;
  setCurrentConversationId: (id: string | null) => void;
  deleteConversation: (id: string) => void;
}

// Mock initial data
const mockInitialConversation: ChatConversation = {
  id: uuidv4(),
  title: 'Nouvelle conversation',
  created_at: new Date(),
  updated_at: new Date(),
  user_id: 'user-1',
  messages: []
};

export function useChatHistory(): UseChatHistoryResult {
  const [conversations, setConversations] = useState<ChatConversation[]>([mockInitialConversation]);
  const [currentConversationId, setCurrentConversationId] = useState<string>(mockInitialConversation.id);

  // Get current conversation
  const currentConversation = conversations.find(c => c.id === currentConversationId) || null;
  
  // Get messages from current conversation
  const messages = currentConversation?.messages || [];

  // Create a new conversation
  const createNewConversation = useCallback(() => {
    const newConversation: ChatConversation = {
      id: uuidv4(),
      title: 'Nouvelle conversation',
      created_at: new Date(),
      updated_at: new Date(),
      user_id: 'user-1',
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    
    return newConversation;
  }, []);

  // Add a user message
  const addUserMessage = useCallback((text: string) => {
    if (!currentConversationId) {
      const newConversation = createNewConversation();
      setCurrentConversationId(newConversation.id);
    }
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: text,
      content: text,
      sender: 'user',
      sender_id: 'user-1',
      conversation_id: currentConversationId,
      timestamp: new Date(),
      is_read: true
    };
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversationId
          ? { 
              ...conv, 
              messages: [...conv.messages, newMessage],
              updated_at: new Date(),
              last_message: text
            }
          : conv
      )
    );
  }, [currentConversationId, createNewConversation]);

  // Add a bot message
  const addBotMessage = useCallback((text: string) => {
    if (!currentConversationId) return;
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: text,
      content: text,
      sender: 'bot',
      sender_id: 'bot-1',
      conversation_id: currentConversationId,
      timestamp: new Date(),
      is_read: true
    };
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversationId
          ? { 
              ...conv, 
              messages: [...conv.messages, newMessage],
              updated_at: new Date(),
              last_message: text
            }
          : conv
      )
    );
  }, [currentConversationId]);

  // Add a system message
  const addSystemMessage = useCallback((text: string) => {
    if (!currentConversationId) return;
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text: text,
      content: text,
      sender: 'system',
      sender_id: 'system',
      conversation_id: currentConversationId,
      timestamp: new Date(),
      is_read: true
    };
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === currentConversationId
          ? { 
              ...conv, 
              messages: [...conv.messages, newMessage],
              updated_at: new Date()
            }
          : conv
      )
    );
  }, [currentConversationId]);

  // Delete a conversation
  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // If we deleted the current conversation, set the most recent one as current
    if (id === currentConversationId) {
      setCurrentConversationId(prev => {
        const remainingConvs = conversations.filter(c => c.id !== id);
        return remainingConvs.length > 0 ? remainingConvs[0].id : null;
      });
    }
  }, [conversations, currentConversationId]);

  return {
    conversations,
    currentConversation,
    messages,
    addUserMessage,
    addBotMessage,
    addSystemMessage,
    createNewConversation,
    setCurrentConversationId,
    deleteConversation
  };
}
