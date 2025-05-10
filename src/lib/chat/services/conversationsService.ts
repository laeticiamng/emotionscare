
import { v4 as uuidv4 } from 'uuid';
import type { ChatConversation } from '@/types/chat';

// Mock conversations data
let conversations: ChatConversation[] = [
  {
    id: 'conversation-1',
    user_id: 'user-1',
    created_at: new Date('2023-03-01'),
    updated_at: new Date('2023-03-10'),
    title: 'Première conversation',
    last_message: 'Comment puis-je vous aider aujourd\'hui ?',
    userId: 'user-1',
    lastMessage: 'Comment puis-je vous aider aujourd\'hui ?',
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-10')
  },
  {
    id: 'conversation-2',
    user_id: 'user-1',
    created_at: new Date('2023-03-15'),
    updated_at: new Date('2023-03-15'),
    title: 'Discussion sur la gestion du stress',
    last_message: 'Merci pour ces conseils utiles.',
    userId: 'user-1',
    lastMessage: 'Merci pour ces conseils utiles.',
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-15')
  }
];

/**
 * Service for managing chat conversations
 */
export const conversationsService = {
  /**
   * Fetch all conversations for a user
   */
  fetchAll: async (userId: string): Promise<ChatConversation[]> => {
    return conversations.filter(conv => conv.user_id === userId || conv.userId === userId);
  },

  /**
   * Create a new conversation
   */
  create: async (userId: string, title: string): Promise<ChatConversation> => {
    const now = new Date();
    const newConv: ChatConversation = {
      id: uuidv4(),
      user_id: userId,
      userId: userId,
      title: title || 'Nouvelle conversation',
      created_at: now,
      updated_at: now,
      createdAt: now,
      updatedAt: now
    };
    
    conversations.push(newConv);
    return newConv;
  },

  /**
   * Update a conversation's title
   */
  update: async (id: string, title: string): Promise<ChatConversation | null> => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return null;
    
    conv.title = title;
    return conv;
  },

  /**
   * Delete a conversation
   */
  delete: async (id: string): Promise<boolean> => {
    const initialLength = conversations.length;
    conversations = conversations.filter(conv => conv.id !== id);
    return conversations.length < initialLength;
  },

  /**
   * Update a conversation's last message
   */
  updateLastMessage: async (id: string, message: string): Promise<ChatConversation | null> => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) return null;
    
    conv.last_message = message;
    conv.lastMessage = message;
    const now = new Date();
    conv.updated_at = now;
    conv.updatedAt = now;
    return conv;
  },
};
