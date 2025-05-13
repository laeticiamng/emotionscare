
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ChatConversation, ChatMessage } from '@/types/chat';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook pour gérer l'historique des conversations de chat
 */
export function useChatHistory() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Charger les conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('chat_conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        setConversations(data || []);
        
        // Si aucune conversation active n'est sélectionnée, prendre la première
        if (!activeConversationId && data && data.length > 0) {
          setActiveConversationId(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur lors du chargement des conversations'));
        toast({
          title: "Erreur",
          description: "Impossible de charger vos conversations",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
  }, [user?.id]);

  // Créer une nouvelle conversation
  const createConversation = useCallback(async (title?: string) => {
    if (!user?.id) return null;
    
    try {
      const newConversation: Partial<ChatConversation> = {
        id: uuidv4(),
        user_id: user.id,
        title: title || "Nouvelle conversation",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('chat_conversations')
        .insert(newConversation);
      
      if (error) throw error;
      
      const created = newConversation as ChatConversation;
      setConversations(prev => [created, ...prev]);
      setActiveConversationId(created.id);
      return created;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer une nouvelle conversation",
        variant: "destructive"
      });
      return null;
    }
  }, [user?.id]);

  // Supprimer une conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);
      
      if (error) throw error;
      
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (activeConversationId === conversationId) {
        const remainingConversations = conversations.filter(c => c.id !== conversationId);
        setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : null);
      }
      
      toast({
        title: "Supprimé",
        description: "Conversation supprimée avec succès"
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la conversation",
        variant: "destructive"
      });
    }
  }, [activeConversationId, conversations]);

  // Charger les messages d'une conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      setActiveConversationId(conversationId);
      return data as ChatMessage[];
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mise à jour du titre de conversation
  const updateConversationTitle = useCallback(async (conversationId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ title: newTitle, updated_at: new Date().toISOString() })
        .eq('id', conversationId);
      
      if (error) throw error;
      
      setConversations(prev => 
        prev.map(conv => conv.id === conversationId ? { ...conv, title: newTitle } : conv)
      );
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le titre",
        variant: "destructive"
      });
    }
  }, []);

  return {
    conversations,
    activeConversationId,
    isLoading,
    error,
    createConversation,
    deleteConversation,
    loadMessages,
    setActiveConversationId,
    updateConversationTitle
  };
}
