
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, ChatConversation } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for managing chat history
 */
export const chatHistoryService = {
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
      const { data, error } = await supabase
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
      const { data, error } = await supabase
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
      const { error } = await supabase
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
   * Delete a conversation and all its messages
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      if (!conversationId) {
        console.error('No conversation ID provided to deleteConversation');
        return false;
      }
      
      console.log('Deleting conversation:', conversationId);
      // Due to cascade delete in the database, we only need to delete the conversation
      const { error } = await supabase
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
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      if (!conversationId) {
        console.error('No conversation ID provided to getMessages');
        return [];
      }
      
      console.log('Fetching messages for conversation:', conversationId);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        console.log('No messages found for conversation:', conversationId);
        return [];
      }
      
      console.log('Fetched messages:', data.length);
      return data.map(message => ({
        id: message.id,
        text: message.text,
        sender: message.sender as 'user' | 'bot',
        timestamp: new Date(message.timestamp),
      }));
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },

  /**
   * Save messages to a conversation
   */
  async saveMessages(conversationId: string, messages: ChatMessage[]): Promise<boolean> {
    try {
      if (!conversationId) {
        console.error('No conversation ID provided to saveMessages');
        return false;
      }
      
      if (!messages || messages.length === 0) {
        console.warn('No messages to save for conversation:', conversationId);
        return false;
      }
      
      console.log('Saving messages for conversation:', conversationId, 'count:', messages.length);
      // Filter for messages that need to be saved
      const messagesToSave = messages.map(message => ({
        id: message.id || uuidv4(), // Ensure every message has an ID
        conversation_id: conversationId,
        text: message.text,
        sender: message.sender,
        timestamp: message.timestamp.toISOString() // Convert Date to ISO string
      }));
      
      // Insert all messages for the conversation
      const { error } = await supabase
        .from('chat_messages')
        .upsert(messagesToSave, { onConflict: 'id' });
      
      if (error) {
        console.error('Error saving messages:', error);
        return false;
      }
      
      console.log('Successfully saved messages for conversation:', conversationId);
      return true;
    } catch (error) {
      console.error('Error saving messages:', error);
      return false;
    }
  }
};
