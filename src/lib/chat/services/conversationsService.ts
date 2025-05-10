
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation } from '@/types/chat';

// Mock conversations data
const mockConversations: ChatConversation[] = [];

/**
 * Get all conversations for a specific user
 * @param userId - The ID of the user
 */
const getConversationsForUser = async (userId: string): Promise<ChatConversation[]> => {
  // In a real app, this would be an API call
  // For now, we'll filter and transform the mock data
  return mockConversations
    .filter(conv => conv.user_id === userId || conv.userId === userId)
    .map(conv => ({
      id: conv.id,
      user_id: conv.user_id || conv.userId || userId,
      created_at: conv.created_at || conv.createdAt || new Date(),
      updated_at: conv.updated_at || conv.updatedAt || new Date(),
      title: conv.title,
      last_message: conv.last_message || conv.lastMessage || '',
      // Add in legacy fields for compatibility
      userId: conv.user_id || conv.userId || userId,
      createdAt: conv.created_at || conv.createdAt || new Date(),
      updatedAt: conv.updated_at || conv.updatedAt || new Date(),
      lastMessage: conv.last_message || conv.lastMessage || '',
    }))
    .sort((a, b) => {
      // Sort by the most recent conversation
      const dateA = a.updated_at instanceof Date ? a.updated_at : new Date(a.updated_at);
      const dateB = b.updated_at instanceof Date ? b.updated_at : new Date(b.updated_at);
      return dateB.getTime() - dateA.getTime();
    });
};

/**
 * Create a new conversation
 * @param userId - The ID of the user creating the conversation
 * @param title - The title of the conversation
 */
const createConversation = async (userId: string, title: string): Promise<ChatConversation> => {
  const now = new Date();
  
  const conversation: ChatConversation = {
    id: uuidv4(),
    user_id: userId,
    created_at: now,
    updated_at: now,
    title,
    last_message: '',
    // Add legacy fields for compatibility
    userId,
    createdAt: now,
    updatedAt: now,
    lastMessage: '',
  };
  
  mockConversations.push(conversation);
  return conversation;
};

/**
 * Get a conversation by its ID
 * @param conversationId - The ID of the conversation
 */
const getConversationById = async (conversationId: string): Promise<ChatConversation | null> => {
  const conversation = mockConversations.find(c => c.id === conversationId);
  return conversation || null;
};

/**
 * Update an existing conversation
 * @param conversationId - The ID of the conversation to update
 * @param updates - The updates to apply
 */
const updateConversation = async (
  conversationId: string, 
  updates: { title?: string; lastMessage?: string }
): Promise<ChatConversation> => {
  const index = mockConversations.findIndex(c => c.id === conversationId);
  
  if (index === -1) {
    throw new Error('Conversation not found');
  }
  
  const updatedConversation = {
    ...mockConversations[index],
    updated_at: new Date(),
    updatedAt: new Date(),
  };
  
  if (updates.title) {
    updatedConversation.title = updates.title;
  }
  
  if (updates.lastMessage) {
    updatedConversation.last_message = updates.lastMessage;
    updatedConversation.lastMessage = updates.lastMessage;
  }
  
  mockConversations[index] = updatedConversation;
  return updatedConversation;
};

/**
 * Delete a conversation
 * @param conversationId - The ID of the conversation to delete
 */
const deleteConversation = async (conversationId: string): Promise<void> => {
  const index = mockConversations.findIndex(c => c.id === conversationId);
  
  if (index === -1) {
    throw new Error('Conversation not found');
  }
  
  mockConversations.splice(index, 1);
};

export const conversationsService = {
  getConversationsForUser,
  createConversation,
  getConversationById,
  updateConversation,
  deleteConversation,
};

export default conversationsService;
