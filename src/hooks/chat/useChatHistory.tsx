
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage, ChatConversation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

export function useChatHistory() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Load all conversations for the current user
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
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
  }, [user?.id]);

  // Retry loading conversations
  const retryLoadConversations = useCallback(() => {
    loadConversations();
  }, [loadConversations]);
  
  // Create a new conversation
  const createConversation = useCallback(async (title: string): Promise<string> => {
    if (!user?.id) {
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
          user_id: user.id,
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
  }, [user?.id, loadConversations, toast]);
  
  // Load messages for a specific conversation
  const loadMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      setActiveConversationId(conversationId);
      
      return (data || []).map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender as 'user' | 'bot',
        timestamp: new Date(msg.timestamp)
      }));
    } catch (err) {
      console.error('Error loading messages:', err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages de cette conversation.",
        variant: "destructive"
      });
      return [];
    }
  }, [toast]);
  
  // Save messages for the active conversation
  const saveMessages = useCallback(async (messages: ChatMessage[]) => {
    if (!activeConversationId || !user?.id || messages.length === 0) return;
    
    try {
      // Get only the new messages that need to be saved
      const lastMessages = messages.slice(-2);
      
      // Map messages to the format expected by the database
      const messagesToInsert = lastMessages.map(msg => ({
        conversation_id: activeConversationId,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString()
      }));
      
      // Insert messages
      const { error } = await supabase
        .from('chat_messages')
        .insert(messagesToInsert);
      
      if (error) throw error;
      
      // Update the conversation's last_message field
      const lastMessage = messages[messages.length - 1];
      await supabase
        .from('chat_conversations')
        .update({
          last_message: lastMessage.text.substring(0, 100),
          updated_at: new Date().toISOString()
        })
        .eq('id', activeConversationId);
      
      // Refresh the conversations list
      await loadConversations();
    } catch (err) {
      console.error('Error saving messages:', err);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les messages.",
        variant: "destructive"
      });
    }
  }, [activeConversationId, user?.id, loadConversations, toast]);
  
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
  
  // Load all conversations on component mount
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id, loadConversations]);
  
  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error,
    createConversation,
    loadMessages,
    saveMessages,
    deleteConversation,
    retryLoadConversations
  };
}
