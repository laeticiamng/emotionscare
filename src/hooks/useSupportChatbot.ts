/**
 * Hook useSupportChatbot - Phase 4.4
 * Gestion complète du chatbot support avec état et actions
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  supportChatbotService,
  SupportConversation,
  SupportMessage,
  MessageResponse,
} from '@/services/supportChatbotService';
import { logger } from '@/lib/logger';

export interface ChatbotState {
  conversation: SupportConversation | null;
  messages: SupportMessage[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  isOpen: boolean;
  hasUnread: boolean;
}

/**
 * Hook principal pour le chatbot
 */
export function useSupportChatbot(userId: string | undefined) {
  const [state, setState] = useState<ChatbotState>({
    conversation: null,
    messages: [],
    loading: false,
    sending: false,
    error: null,
    isOpen: false,
    hasUnread: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Initialiser ou récupérer la conversation
   */
  const initializeConversation = useCallback(async () => {
    if (!userId) return;

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Récupérer la dernière conversation ouverte
      const conversations =
        await supportChatbotService.getUserConversations(userId);
      let conversation = conversations.find((c) => c.status === 'open');

      // Si pas de conversation ouverte, en créer une
      if (!conversation) {
        conversation = await supportChatbotService.createConversation(userId) ?? undefined;
      }

      if (!conversation) {
        throw new Error('Failed to create conversation');
      }

      setState((prev) => ({
        ...prev,
        conversation,
        loading: false,
      }));

      // Récupérer les messages
      await loadMessages(conversation.id);

      logger.info(
        'Chatbot conversation initialized',
        { conversationId: conversation.id },
        'CHATBOT'
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
      }));
      logger.error('Failed to initialize conversation', error as Error, 'CHATBOT');
    }
  }, [userId]);

  /**
   * Charger les messages
   */
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const messages = await supportChatbotService.getMessages(conversationId);
      setState((prev) => ({
        ...prev,
        messages,
        hasUnread: false,
      }));

      // Scroller vers le bas
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      logger.error('Failed to load messages', error as Error, 'CHATBOT');
    }
  }, []);

  /**
   * Envoyer un message
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.conversation || !userId || !content.trim()) return;

      try {
        setState((prev) => ({
          ...prev,
          sending: true,
          error: null,
        }));

        // Ajouter le message utilisateur immédiatement à l'UI
        const userMessage: SupportMessage = {
          id: `temp-${Date.now()}`,
          conversation_id: state.conversation.id,
          user_id: userId,
          sender: 'user',
          content: content.trim(),
          message_type: 'text',
          requires_escalation: false,
          created_at: new Date().toISOString(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, userMessage],
        }));

        // Générer la réponse du chatbot
        const response = await supportChatbotService.generateResponse(
          state.conversation.id,
          userId,
          content
        );

        if (response) {
          // Charger les messages mis à jour
          await loadMessages(state.conversation.id);

          // Mettre à jour le statut de la conversation si nécessaire
          if (response.conversationStatus && response.conversationStatus !== state.conversation.status) {
            const updated = await supportChatbotService.getConversation(
              state.conversation.id
            );
            if (updated) {
              setState((prev) => ({
                ...prev,
                conversation: updated,
              }));
            }
          }
        }

        setState((prev) => ({
          ...prev,
          sending: false,
        }));

        logger.info(
          'Message sent',
          { conversationId: state.conversation.id },
          'CHATBOT'
        );
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        setState((prev) => ({
          ...prev,
          sending: false,
          error: errorMsg,
        }));
        logger.error('Failed to send message', error as Error, 'CHATBOT');
      }
    },
    [state.conversation, userId, loadMessages]
  );

  /**
   * Fermer la conversation et évaluer
   */
  const closeConversation = useCallback(
    async (satisfaction?: number, _feedback?: string) => {
      if (!state.conversation || !userId) return;

      try {
        // Update satisfaction first if provided
        if (satisfaction !== undefined) {
          await supportChatbotService.updateSatisfaction(
            state.conversation.id,
            satisfaction
          );
        }

        // Then close the conversation
        const success = await supportChatbotService.closeConversation(
          state.conversation.id
        );

        if (success) {
          setState((prev) => ({
            ...prev,
            conversation: {
              ...prev.conversation!,
              status: 'closed' as const,
              user_satisfaction: satisfaction,
            },
          }));

          logger.info(
            'Conversation closed with rating',
            { satisfaction },
            'CHATBOT'
          );
        }
      } catch (error) {
        logger.error('Failed to close conversation', error as Error, 'CHATBOT');
      }
    },
    [state.conversation, userId]
  );

  /**
   * Basculer l'ouverture/fermeture du chatbot
   */
  const toggleChatbot = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  }, []);

  /**
   * Ouvrir le chatbot
   */
  const openChatbot = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
    }));
  }, []);

  /**
   * Fermer le chatbot
   */
  const closeChatbot = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  /**
   * Polling pour les nouveaux messages (si fermé)
   */
  useEffect(() => {
    if (!state.conversation || state.isOpen) return;

    // Vérifier les nouveaux messages toutes les 5 secondes
    pollIntervalRef.current = setInterval(async () => {
      const messages = await supportChatbotService.getMessages(
        state.conversation!.id
      );

      // Vérifier s'il y a des nouveaux messages du chatbot
      const lastLocalMessage = state.messages[state.messages.length - 1];
      const hasNewBotMessages = messages.some(
        (m: SupportMessage) =>
          m.sender === 'chatbot' &&
          (!lastLocalMessage || m.created_at > lastLocalMessage.created_at)
      );

      if (hasNewBotMessages) {
        setState((prev) => ({
          ...prev,
          hasUnread: true,
          messages,
        }));
      }
    }, 5000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [state.conversation, state.isOpen, state.messages]);

  /**
   * Initialiser au montage
   */
  useEffect(() => {
    initializeConversation();
  }, [userId, initializeConversation]);

  return {
    ...state,
    sendMessage,
    closeConversation,
    toggleChatbot,
    openChatbot,
    closeChatbot,
    messagesEndRef,
    refresh: initializeConversation,
  };
}

/**
 * Hook pour l'historique des conversations
 */
export function useConversationHistory(userId: string | undefined) {
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await supportChatbotService.getUserConversations(userId);
      setConversations(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      logger.error('Failed to fetch conversations', err as Error, 'CHATBOT');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refresh: fetchConversations,
    openConversations: conversations.filter((c) => c.status === 'open'),
    closedConversations: conversations.filter((c) => c.status === 'closed'),
    escalatedConversations: conversations.filter((c) => c.status === 'escalated'),
  };
}

/**
 * Hook pour gérer la satisfaction des conversations
 */
export function useConversationSatisfaction(conversationId: string | undefined) {
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRating = useCallback(
    async (userId: string, rating: number, text?: string) => {
      if (!conversationId || !userId) return;

      try {
        setIsSubmitting(true);
        
        // Update satisfaction
        await supportChatbotService.updateSatisfaction(conversationId, rating);
        
        // Close the conversation
        await supportChatbotService.closeConversation(conversationId);

        setSatisfaction(rating);
        setFeedback(text || '');

        logger.info(
          'Conversation rated',
          { rating },
          'CHATBOT'
        );
      } catch (error) {
        logger.error('Failed to submit rating', error as Error, 'CHATBOT');
      } finally {
        setIsSubmitting(false);
      }
    },
    [conversationId]
  );

  return {
    satisfaction,
    feedback,
    isSubmitting,
    submitRating,
    setSatisfaction,
    setFeedback,
  };
}
