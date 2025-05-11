
import { useState, useCallback } from 'react';
import { ChatMessage, ChatConversation } from '@/types/chat';
import chatHistoryService from '@/lib/chat/chatHistoryService';

export function useChatHistory() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);

  const loadConversations = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const fetchedConversations = await chatHistoryService.getConversationsForUser(userId);
      setConversations(fetchedConversations);
      return fetchedConversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    try {
      const messages = await chatHistoryService.getMessagesForConversation(conversationId);
      setHistory(messages);
      setActiveConversationId(conversationId);
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await chatHistoryService.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setHistory([]);
      }
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }, [activeConversationId]);

  return {
    conversations,
    activeConversationId,
    deleteConversation,
    loadMessages,
    setActiveConversationId,
    history,
    isLoading,
    loadConversations
  };
}
