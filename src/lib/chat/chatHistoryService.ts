
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';

// Mock conversations data
const mockConversations: ChatConversation[] = [];

// Get conversations for a specific user
const getConversationsForUser = async (userId: string): Promise<ChatConversation[]> => {
  // In a real app, this would be an API call
  // For now, we'll filter the mock data
  return mockConversations
    .filter(conv => conv.user_id === userId)
    .sort((a, b) => {
      // Sort by the most recent conversation
      const dateA = typeof a.updated_at === 'string' ? new Date(a.updated_at) : a.updated_at;
      const dateB = typeof b.updated_at === 'string' ? new Date(b.updated_at) : b.updated_at;
      return dateB.getTime() - dateA.getTime();
    });
};

// Create a new conversation
const createConversation = async (userId: string, title: string): Promise<ChatConversation> => {
  const now = new Date();
  
  const conversation: ChatConversation = {
    id: uuidv4(),
    user_id: userId,
    created_at: now,
    updated_at: now,
    title,
    last_message: '',
    // Add backward compatibility fields
    userId,
    createdAt: now,
    updatedAt: now,
    lastMessage: '',
  };
  
  mockConversations.push(conversation);
  return conversation;
};

// Update an existing conversation
const updateConversation = async (conversationId: string, updates: { title?: string; lastMessage?: string }): Promise<ChatConversation> => {
  const index = mockConversations.findIndex(c => c.id === conversationId);
  
  if (index === -1) {
    throw new Error('Conversation not found');
  }
  
  const updatedConversation: ChatConversation = {
    ...mockConversations[index],
    ...updates,
    updated_at: new Date(),
    // Update backward compatibility field
    updatedAt: new Date(),
  };
  
  // If lastMessage is provided, update both properties
  if (updates.lastMessage) {
    updatedConversation.last_message = updates.lastMessage;
    updatedConversation.lastMessage = updates.lastMessage;
  }
  
  mockConversations[index] = updatedConversation;
  return updatedConversation;
};

// Delete a conversation
const deleteConversation = async (conversationId: string): Promise<void> => {
  const index = mockConversations.findIndex(c => c.id === conversationId);
  
  if (index === -1) {
    throw new Error('Conversation not found');
  }
  
  mockConversations.splice(index, 1);
};

// Mock messages data (organized by conversation ID)
const mockMessages: Record<string, ChatMessage[]> = {};

// Get messages for a specific conversation
const getMessagesForConversation = async (conversationId: string): Promise<ChatMessage[]> => {
  // In a real app, this would be an API call
  return mockMessages[conversationId] || [];
};

// Add a new message to a conversation
const addMessageToConversation = async (conversationId: string, message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
  const newMessage: ChatMessage = {
    id: uuidv4(),
    ...message,
    timestamp: message.timestamp || new Date(),
  };
  
  if (!mockMessages[conversationId]) {
    mockMessages[conversationId] = [];
  }
  
  mockMessages[conversationId].push(newMessage);
  
  // Also update the conversation's last message
  const text = newMessage.content || newMessage.text || '';
  await updateConversation(conversationId, { lastMessage: text });
  
  return newMessage;
};

// Format date for display
const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString();
};

// Export the service methods
const chatHistoryService = {
  getConversationsForUser,
  createConversation,
  updateConversation,
  deleteConversation,
  getMessagesForConversation,
  addMessageToConversation,
  formatDate
};

export default chatHistoryService;
