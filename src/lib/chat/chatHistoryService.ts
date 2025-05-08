
import { supabase } from '@/integrations/supabase/client';
import { ChatConversation, ChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service pour gérer l'historique des conversations avec le coach IA
 */
export const chatHistoryService = {
  /**
   * Récupère toutes les conversations d'un utilisateur
   */
  async getConversations(userId: string): Promise<ChatConversation[]> {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      throw new Error(error.message);
    }
    
    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      title: item.title,
      lastMessage: item.last_message || '',
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  },
  
  /**
   * Crée une nouvelle conversation
   */
  async createConversation(userId: string, title: string = 'Nouvelle conversation'): Promise<string | null> {
    const conversationId = uuidv4();
    
    const { error } = await supabase
      .from('chat_conversations')
      .insert({
        id: conversationId,
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error creating conversation:', error);
      throw new Error(error.message);
    }
    
    return conversationId;
  },
  
  /**
   * Met à jour une conversation existante
   */
  async updateConversation(conversationId: string, lastMessage: string): Promise<void> {
    const { error } = await supabase
      .from('chat_conversations')
      .update({
        last_message: lastMessage.slice(0, 100),
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);
    
    if (error) {
      console.error('Error updating conversation:', error);
      throw new Error(error.message);
    }
  },
  
  /**
   * Supprime une conversation et tous ses messages
   */
  async deleteConversation(conversationId: string): Promise<void> {
    // Supprimer d'abord les messages
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('conversation_id', conversationId);
    
    if (messagesError) {
      console.error('Error deleting messages:', messagesError);
      throw new Error(messagesError.message);
    }
    
    // Supprimer ensuite la conversation
    const { error: conversationError } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', conversationId);
    
    if (conversationError) {
      console.error('Error deleting conversation:', conversationError);
      throw new Error(conversationError.message);
    }
  },
  
  /**
   * Récupère les messages d'une conversation
   */
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error(error.message);
    }
    
    return (data || []).map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender as 'user' | 'bot',
      timestamp: new Date(msg.timestamp)
    }));
  },
  
  /**
   * Sauvegarde des messages pour une conversation
   */
  async saveMessages(conversationId: string, messages: ChatMessage[]): Promise<void> {
    const dbMessages = messages.map(msg => ({
      id: msg.id,
      conversation_id: conversationId,
      sender: msg.sender,
      text: msg.text,
      timestamp: msg.timestamp.toISOString()
    }));
    
    const { error } = await supabase
      .from('chat_messages')
      .upsert(dbMessages, { onConflict: 'id' });
    
    if (error) {
      console.error('Error saving messages:', error);
      throw new Error(error.message);
    }
  }
};
