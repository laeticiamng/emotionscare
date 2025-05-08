
import { useState, useCallback } from 'react';
import { ChatConversation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing conversation state
 */
export function useConversationState(userId: string | undefined) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load all conversations for the current user
  const loadConversations = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert the date strings to Date objects and map to ChatConversation type
      const formattedConversations: ChatConversation[] = (data || []).map(conv => ({
        id: conv.id,
        userId: conv.user_id,
        title: conv.title,
        lastMessage: conv.last_message || '',
        createdAt: new Date(conv.created_at),
        updatedAt: new Date(conv.updated_at)
      }));
      
      setConversations(formattedConversations);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError("Impossible de charger les conversations. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  // Retry loading conversations
  const retryLoadConversations = useCallback(() => {
    loadConversations();
  }, [loadConversations]);
  
  // Create a new conversation
  const createConversation = useCallback(async (title: string): Promise<string> => {
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une conversation.",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }
    
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title: title,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        setActiveConversationId(data.id);
        await loadConversations();  // Refresh the list
        return data.id;
      } else {
        throw new Error("No data returned from conversation creation");
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
      toast({
        title: "Erreur",
        description: "Impossible de créer une nouvelle conversation.",
        variant: "destructive"
      });
      throw err;
    }
  }, [userId, loadConversations, toast]);
  
  // Delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      // First delete all messages in the conversation
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('conversation_id', conversationId);
      
      if (messagesError) throw messagesError;
      
      // Then delete the conversation itself
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);
      
      if (error) throw error;
      
      // If the deleted conversation was the active one, clear the active conversation
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
      
      // Refresh the conversations list
      await loadConversations();
      
      toast({
        title: "Conversation supprimée",
        description: "La conversation a été supprimée avec succès."
      });
    } catch (err) {
      console.error('Error deleting conversation:', err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation.",
        variant: "destructive"
      });
    }
  }, [activeConversationId, loadConversations, toast]);

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error,
    loadConversations,
    createConversation,
    deleteConversation,
    retryLoadConversations
  };
}
