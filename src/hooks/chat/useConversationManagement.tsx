// @ts-nocheck

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { chatHistoryService } from '@/lib/chat/services';
import { ChatConversation } from '@/types/chat';
import { logger } from '@/lib/logger';

// Étendons temporairement le service pour ajouter les fonctions manquantes
const extendedChatHistoryService = {
  ...chatHistoryService,
  updateConversationTitle: async (conversationId: string, title: string): Promise<void> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    // Dans une vraie application, mettrait à jour la base de données
    logger.debug('Conversation title updated', { conversationId, title }, 'UI');
    return;
  },
  updateConversation: async (conversationId: string, data: Partial<ChatConversation>): Promise<void> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    // Dans une vraie application, mettrait à jour la base de données
    logger.debug('Conversation updated', { conversationId, data }, 'UI');
    return;
  }
};

export const useConversationManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createConversation = async (title: string = 'Nouvelle conversation') => {
    setLoading(true);
    setError(null);
    
    try {
      const newConversation: ChatConversation = {
        id: uuidv4(),
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: "",
        created_at: new Date().toISOString(), // legacy field
        updated_at: new Date().toISOString(), // legacy field
        last_message: "", // legacy field
        user_id: "user-123", // Normally dynamic according to logged user
        messages: [] // Add empty messages array
      };
      
      // Dans une vraie application, sauvegarder dans la base de données
      
      return newConversation;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to create conversation');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateConversationTitle = async (conversationId: string, title: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await extendedChatHistoryService.updateConversationTitle(conversationId, title);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to update conversation title');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Dans une vraie application, supprimer de la base de données
      await new Promise(resolve => setTimeout(resolve, 500));
      logger.info('Conversation deleted', { conversationId }, 'UI');
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to delete conversation');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateConversation = async (conversationId: string, data: Partial<ChatConversation>) => {
    setLoading(true);
    setError(null);
    
    try {
      await extendedChatHistoryService.updateConversation(conversationId, data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to update conversation');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createConversation,
    updateConversationTitle,
    deleteConversation,
    updateConversation,
    loading,
    error
  };
};

export default useConversationManagement;
