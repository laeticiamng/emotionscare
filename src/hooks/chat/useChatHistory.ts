
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';
import { messagesService } from '@/lib/chat/services/messagesService';
import { conversationsService } from '@/lib/chat/services/conversationsService';

// Interface pour le service de gestion de l'historique des conversations
interface ChatHistoryService {
  getConversations?: (userId: string) => Promise<ChatConversation[]>;
  createConversation?: (title: string) => Promise<ChatConversation>;
  getMessages?: (conversationId: string) => Promise<ChatMessage[]>;
  getConversationsForUser?: (userId: string) => Promise<ChatConversation[]>;
  getMessagesForConversation?: (conversationId: string) => Promise<ChatMessage[]>;
}

export function useChatHistory(
  userId: string,
  service: ChatHistoryService = { 
    getConversations: conversationsService.getConversationsForUser,
    getMessages: messagesService.getMessagesForConversation
  }
) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Charger les conversations de l'utilisateur
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const userConversations = await conversationsService.getConversationsForUser(userId);
      setConversations(userConversations);
      
      // Si aucune conversation active, prendre la première
      if (userConversations.length > 0 && !currentConversation) {
        setCurrentConversation(userConversations[0]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err instanceof Error ? err : new Error('Failed to load conversations'));
      setLoading(false);
    }
  }, [userId, currentConversation]);

  // Charger les messages d'une conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      const conversationMessages = await messagesService.getMessagesForConversation(conversationId);
      setMessages(conversationMessages);
      setLoading(false);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err : new Error('Failed to load messages'));
      setLoading(false);
    }
  }, []);

  // Choisir une conversation
  const selectConversation = useCallback(async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      await loadMessages(conversationId);
    }
  }, [conversations, loadMessages]);

  // Créer une nouvelle conversation
  const createConversation = useCallback(async (title: string = 'New conversation') => {
    try {
      const newConversation = await conversationsService.createConversation(userId, title);
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
      return newConversation;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err instanceof Error ? err : new Error('Failed to create conversation'));
      throw err;
    }
  }, [userId]);

  // Charge les conversations au montage
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Charge les messages lorsque la conversation courante change
  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation, loadMessages]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    loadConversations,
    selectConversation,
    createConversation,
    setMessages
  };
}

export default useChatHistory;
