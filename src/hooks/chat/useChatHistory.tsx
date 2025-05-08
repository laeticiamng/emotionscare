
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string | null;
  updated_at: string | null;
  last_message: string | null;
  message_count: number | null;
  metadata: Record<string, any> | null;
}

export function useChatHistory() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load all conversations for current user
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setConversations(data || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  // Load messages for a specific conversation
  const loadMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    if (!user?.id) return [];
    
    try {
      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      // Transform database messages to ChatMessage format
      return (data || []).map(dbMessage => ({
        id: dbMessage.id,
        text: dbMessage.content,
        sender: dbMessage.sender_type,
        timestamp: new Date(dbMessage.timestamp),
        metadata: dbMessage.metadata || {}
      }));
    } catch (err) {
      console.error('Failed to load messages:', err);
      throw err;
    }
  }, [user?.id]);
  
  // Save messages to current conversation or create new conversation
  const saveMessages = useCallback(async (messages: ChatMessage[]) => {
    if (!user?.id || messages.length <= 1) return; // Skip if only system message
    
    try {
      // Get only user/bot messages (skip system)
      const relevantMessages = messages.filter(m => m.sender === 'user' || m.sender === 'bot');
      if (relevantMessages.length === 0) return;
      
      // Determine conversation details
      let convId = activeConversationId;
      const firstUserMsg = relevantMessages.find(m => m.sender === 'user');
      
      // Create a new conversation if needed
      if (!convId) {
        const newConvId = uuidv4();
        const title = firstUserMsg?.text.slice(0, 50) || 'Nouvelle conversation';
        
        const { error: convError } = await supabase
          .from('conversations')
          .insert({
            id: newConvId,
            user_id: user.id,
            title,
            last_message: relevantMessages[relevantMessages.length - 1].text.slice(0, 100),
            message_count: relevantMessages.length,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (convError) throw convError;
        convId = newConvId;
        setActiveConversationId(newConvId);
      } else {
        // Update existing conversation
        const { error: updateError } = await supabase
          .from('conversations')
          .update({
            last_message: relevantMessages[relevantMessages.length - 1].text.slice(0, 100),
            message_count: relevantMessages.length,
            updated_at: new Date().toISOString()
          })
          .eq('id', convId);
          
        if (updateError) throw updateError;
      }
      
      // Save all messages
      const dbMessages = relevantMessages.map(msg => ({
        id: msg.id,
        conversation_id: convId,
        content: msg.text,
        sender_type: msg.sender,
        timestamp: msg.timestamp.toISOString(),
        metadata: msg.metadata || {}
      }));
      
      // Upsert messages
      const { error: msgError } = await supabase
        .from('chat_messages')
        .upsert(dbMessages, { onConflict: 'id' });
      
      if (msgError) throw msgError;
      
      // Refresh conversations list
      loadConversations();
    } catch (err) {
      console.error('Failed to save messages:', err);
    }
  }, [user?.id, activeConversationId, loadConversations]);
  
  // Delete a conversation and its messages
  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!user?.id) return;
    
    try {
      // Delete messages first
      const { error: msgError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('conversation_id', conversationId);
      
      if (msgError) throw msgError;
      
      // Delete conversation
      const { error: convError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);
      
      if (convError) throw convError;
      
      // Update local state
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      // Reset active conversation if needed
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      throw err;
    }
  }, [user?.id, activeConversationId]);
  
  // Retry load conversations
  const retryLoadConversations = useCallback(() => {
    setError(null);
    return loadConversations();
  }, [loadConversations]);
  
  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    isLoading,
    error,
    loadConversations,
    loadMessages,
    saveMessages,
    deleteConversation,
    retryLoadConversations
  };
}
