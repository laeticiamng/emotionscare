
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
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data.map(conversation => ({
        id: conversation.id,
        userId: conversation.user_id,
        title: conversation.title,
        lastMessage: conversation.last_message,
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
      const conversationId = uuidv4();
      
      const { error } = await supabase
        .from('chat_conversations')
        .insert({
          id: conversationId,
          user_id: userId,
          title: title,
          last_message: ''
        });

      if (error) throw error;
      return conversationId;
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
          title: title,
          last_message: lastMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) throw error;
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
      // Delete messages first (cascade doesn't work with Supabase js client)
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (messagesError) throw messagesError;

      // Then delete conversation
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
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

      if (error) throw error;

      return data.map(message => ({
        id: message.id,
        text: message.content,
        sender: message.sender,
        timestamp: new Date(message.timestamp)
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
      const messagesToInsert = messages.map(message => ({
        id: message.id,
        conversation_id: conversationId,
        content: message.text,
        sender: message.sender,
        timestamp: message.timestamp.toISOString()
      }));

      // First clear existing messages to avoid duplicates
      const { error: deleteError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (deleteError) throw deleteError;

      // Then insert new messages
      const { error } = await supabase
        .from('chat_messages')
        .insert(messagesToInsert);

      if (error) throw error;

      // Update conversation with last message
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        await this.updateConversation(
          conversationId, 
          // Use first user message as title, or default
          messages.find(m => m.sender === 'user')?.text.substring(0, 50) || 'New conversation',
          lastMessage.text.substring(0, 100)
        );
      }

      return true;
    } catch (error) {
      console.error('Error saving messages:', error);
      return false;
    }
  }
};
