
import { v4 as uuidv4 } from 'uuid';
import { baseService } from './baseService';
import { ChatMessage } from '@/types/chat';

/**
 * Service for managing chat messages
 */
export const messagesService = {
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
      const { data, error } = await baseService.supabase
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
      const { error } = await baseService.supabase
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
