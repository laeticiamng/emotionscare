// @ts-nocheck

import { useState, useEffect } from 'react';
import { chatHistoryService } from '@/lib/chat/services';
import { ChatConversation, ChatMessage } from '@/types/chat';

// Étendons temporairement le service pour ajouter la fonction manquante
const extendedChatHistoryService = {
  ...chatHistoryService,
  // Fonction temporaire pour simuler la récupération des conversations
  getConversationsForUser: async (userId: string): Promise<ChatConversation[]> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retourner quelques conversations de test
    return [
      {
        id: "conv-1",
        title: "Première conversation",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: "Dernier message de test",
        created_at: new Date().toISOString(), // legacy field
        updated_at: new Date().toISOString(), // legacy field
        last_message: "Dernier message de test", // legacy field
        user_id: userId, // legacy field
        messages: [] // Add empty messages array
      },
      {
        id: "conv-2",
        title: "Deuxième conversation",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        lastMessage: "Un autre message de test",
        created_at: new Date(Date.now() - 86400000).toISOString(), // legacy field
        updated_at: new Date(Date.now() - 3600000).toISOString(), // legacy field
        last_message: "Un autre message de test", // legacy field
        user_id: userId, // legacy field
        messages: [] // Add empty messages array
      }
    ];
  }
};

export const useConversationLoader = (userId: string) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const userConversations = await extendedChatHistoryService.getConversationsForUser(userId);
        setConversations(userConversations);
      } catch (e) {
        const err = e instanceof Error ? e : new Error('Failed to load conversations');
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [userId]);

  const refreshConversations = async () => {
    try {
      setLoading(true);
      const userConversations = await extendedChatHistoryService.getConversationsForUser(userId);
      setConversations(userConversations);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to refresh conversations');
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    conversations,
    loading,
    error,
    refreshConversations
  };
};

export default useConversationLoader;
