import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

// Mock messages data (organized by conversation ID)
const mockMessages: Record<string, ChatMessage[]> = {};

/**
 * Get messages for a specific conversation
 * @param conversationId - The ID of the conversation to get messages for
 */
const getMessagesForConversation = async (conversationId: string): Promise<ChatMessage[]> => {
  // In a real app, this would be an API call
  return mockMessages[conversationId] ? [...mockMessages[conversationId]] : [];
};

/**
 * Add a new message to a conversation
 * @param conversationId - The ID of the conversation to add the message to
 * @param message - The message data
 */
const addMessageToConversation = async (conversationId: string, messageData: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
  // Create a new message object with an ID
  const message = {
    id: messageData.id,
    conversation_id: messageData.conversation_id,
    sender: messageData.sender,
    text: messageData.text || messageData.content,
    timestamp: messageData.timestamp?.toString() || new Date().toISOString(),
    role: messageData.role || (messageData.sender === 'user' ? 'user' : 'assistant'),
  };
  
  // Initialize the conversation's messages array if it doesn't exist
  if (!mockMessages[conversationId]) {
    mockMessages[conversationId] = [];
  }
  
  // Add the message to the array
  mockMessages[conversationId].push(message);
  
  return message;
};

/**
 * Delete all messages for a conversation
 * @param conversationId - The ID of the conversation to delete messages for
 */
const deleteMessagesForConversation = async (conversationId: string): Promise<void> => {
  delete mockMessages[conversationId];
};

/**
 * Get the last message from a conversation
 * @param conversationId - The ID of the conversation
 */
const getLastMessageForConversation = async (conversationId: string): Promise<ChatMessage | null> => {
  const messages = mockMessages[conversationId] || [];
  return messages.length > 0 ? messages[messages.length - 1] : null;
};

/**
 * Format date for display
 * @param date - The date to format
 */
const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
};

export const messagesService = {
  getMessagesForConversation,
  addMessageToConversation,
  deleteMessagesForConversation,
  getLastMessageForConversation,
  formatDate
};

export default messagesService;
