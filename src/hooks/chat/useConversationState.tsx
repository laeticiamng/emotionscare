
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';

interface UseConversationStateOptions {
  initialConversations?: ChatConversation[];
}

export function useConversationState({ initialConversations = [] }: UseConversationStateOptions = {}) {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversations.length > 0 ? initialConversations[0].id : null
  );
  
  // Get all conversations
  const getConversations = useCallback(() => {
    return conversations;
  }, [conversations]);
  
  // Get a specific conversation by ID
  const getConversation = useCallback((id: string) => {
    return conversations.find(conv => conv.id === id) || null;
  }, [conversations]);
  
  // Create a new conversation
  const createConversation = useCallback((title = 'Nouvelle conversation') => {
    const newConversationId = uuidv4();
    const newConversation: ChatConversation = {
      id: newConversationId,
      title,
      user_id: 'user-1',
      messages: [],
      created_at: new Date(),
      updated_at: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversationId);
    
    return newConversationId;
  }, []);
  
  // Update conversation details
  const updateConversation = useCallback((id: string, data: Partial<ChatConversation>) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, ...data, updated_at: new Date() } : conv
      )
    );
  }, []);
  
  // Delete a conversation
  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // If the active conversation was deleted, set to the first available one or null
    if (activeConversationId === id) {
      setActiveConversationId(prev => 
        prev === id 
          ? (conversations.filter(c => c.id !== id)[0]?.id || null)
          : prev
      );
    }
  }, [activeConversationId, conversations]);
  
  // Add message to a conversation
  const addMessage = useCallback((conversationId: string, message: ChatMessage) => {
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id !== conversationId) return conv;
        
        return {
          ...conv,
          messages: [...(conv.messages || []), message],
          last_message: message.text || message.content,
          last_message_time: message.timestamp,
          updated_at: new Date()
        };
      })
    );
  }, []);

  return {
    conversations,
    activeConversationId,
    getConversations,
    getConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    setActiveConversationId
  };
}

export default useConversationState;
