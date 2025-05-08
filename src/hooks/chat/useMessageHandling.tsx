
import { useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for handling chat message operations
 */
export function useMessageHandling() {
  const { toast } = useToast();
  
  // Load messages for a specific conversation
  const loadMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
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
  
  // Save messages for a conversation
  const saveMessages = useCallback(async (conversationId: string, userId: string | undefined, messages: ChatMessage[]) => {
    if (!conversationId || !userId || messages.length === 0) return;
    
    try {
      // Get only the new messages that need to be saved
      const lastMessages = messages.slice(-2);
      
      // Map messages to the format expected by the database
      const messagesToInsert = lastMessages.map(msg => ({
        conversation_id: conversationId,
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
        .eq('id', conversationId);
      
    } catch (err) {
      console.error('Error saving messages:', err);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les messages.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    loadMessages,
    saveMessages
  };
}
