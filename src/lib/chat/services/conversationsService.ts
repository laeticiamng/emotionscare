
import { baseService } from './baseService';
import { ChatConversation } from '@/types/chat';

/**
 * Service for managing conversations
 */
export const conversationsService = {
  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string): Promise<ChatConversation[]> {
    try {
      if (!userId) {
        console.error('No user ID provided to getConversations');
        return [];
      }
      
      console.log('Fetching conversations for user:', userId);
      const { data, error } = await baseService.supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }
      
      console.log('Fetched conversations:', data.length);
      return data.map(conversation => ({
        id: conversation.id,
        userId: conversation.user_id,
        title: conversation.title,
        lastMessage: conversation.last_message || '',
        createdAt: new Date(conversation.created_at),
        updatedAt: new Date(conversation.updated_at)
      }));
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  },

  /**
   * Create a new conversation
   */
  async createConversation(userId: string, title: string): Promise<string | null> {
    try {
      if (!userId) {
        console.error('No user ID provided to createConversation');
        return null;
      }
      
      console.log('Creating conversation for user:', userId);
      const { data, error } = await baseService.supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title: title || 'Nouvelle conversation'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }
      
      console.log('Created conversation:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  },

  /**
   * Update conversation title and last message
   */
  async updateConversation(conversationId: string, title: string, lastMessage: string): Promise<boolean> {
    try {
      if (!conversationId) {
        console.error('No conversation ID provided to updateConversation');
        return false;
      }
      
      console.log('Updating conversation:', conversationId);
      const { error } = await baseService.supabase
        .from('chat_conversations')
        .update({
          title,
          last_message: lastMessage
        })
        .eq('id', conversationId);
      
      if (error) {
        console.error('Error updating conversation:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating conversation:', error);
      return false;
    }
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      if (!conversationId) {
        console.error('No conversation ID provided to deleteConversation');
        return false;
      }
      
      console.log('Deleting conversation:', conversationId);
      // Due to cascade delete in the database, we only need to delete the conversation
      const { error } = await baseService.supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);
      
      if (error) {
        console.error('Error deleting conversation:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }
};
