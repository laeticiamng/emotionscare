
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service for managing chat history
 */
export const chatHistoryService = {
  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }
      
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
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      
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
      // Filter for messages that need to be saved
      const messagesToSave = messages.map(message => ({
        id: message.id,
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
      
      return true;
    } catch (error) {
      console.error('Error saving messages:', error);
      return false;
    }
  }
};
