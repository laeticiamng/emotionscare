// @ts-nocheck

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  messages?: ChatMessage[];
}

export const useChatHistory = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load all conversations from Supabase
  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setConversations([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedConversations: Conversation[] = (data || []).map(c => ({
        id: c.id,
        title: c.title || 'Nouvelle conversation',
        lastMessage: c.last_message,
        lastMessageTimestamp: c.updated_at || c.created_at
      }));

      setConversations(formattedConversations);
    } catch (error) {
      logger.error('Error loading conversations', error as Error, 'UI');
      setError(error instanceof Error ? error : new Error('Failed to load conversations'));
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a specific conversation from Supabase
  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { supabase } = await import('@/integrations/supabase/client');

      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const messages: ChatMessage[] = (data || []).map(m => ({
        id: m.id,
        text: m.content,
        content: m.content,
        sender: m.role === 'assistant' ? 'bot' : 'user',
        role: m.role,
        timestamp: m.created_at,
        conversation_id: conversationId
      }));

      setActiveConversationId(conversationId);

      return messages;
    } catch (error) {
      logger.error('Error loading messages', error as Error, 'UI');
      setError(error instanceof Error ? error : new Error('Failed to load messages'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Create new conversation in Supabase
  const createConversation = async (title: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error: insertError } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: title || 'Nouvelle conversation'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newConversation: Conversation = {
        id: data.id,
        title: data.title,
        lastMessageTimestamp: data.created_at
      };

      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);

      return newConversation;
    } catch (error) {
      logger.error('Error creating conversation', error as Error, 'UI');
      setError(error instanceof Error ? error : new Error('Failed to create conversation'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete conversation from Supabase
  const deleteConversation = async (conversationId: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');

      // Delete messages first (if no cascade delete)
      await supabase
        .from('chat_messages')
        .delete()
        .eq('conversation_id', conversationId);

      // Delete conversation
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));

      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }

      toast({
        title: 'Conversation supprimée',
        description: 'La conversation a bien été supprimée.'
      });

      return true;
    } catch (error) {
      logger.error('Error deleting conversation', error as Error, 'UI');

      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la conversation.',
        variant: 'destructive'
      });

      return false;
    }
  };

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error,
    loadConversations,
    loadMessages,
    createConversation,
    deleteConversation
  };
};

export default useChatHistory;
