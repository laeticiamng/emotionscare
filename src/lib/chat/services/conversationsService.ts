
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';

// Mock conversations data (in a real app, this would be stored in a database)
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    user_id: 'user-1',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-01-15T11:45:00Z',
    title: 'Initial Consultation',
    last_message: 'Thank you for your time today.',
    userId: 'user-1',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T11:45:00Z',
    lastMessage: 'Thank you for your time today.'
  }
];

// Get all conversations for a user
const getConversationsForUser = async (userId: string): Promise<ChatConversation[]> => {
  // In a real app, this would be an API call
  // Filter conversations for the specified user
  const userConversations = mockConversations.filter(conv => conv.user_id === userId || conv.userId === userId);
  
  // Map to ensure consistent object structure
  return userConversations.map(conv => ({
    id: conv.id,
    user_id: conv.user_id || conv.userId || '',
    created_at: (conv.created_at || conv.createdAt || '').toString(),
    updated_at: (conv.updated_at || conv.updatedAt || '').toString(),
    title: conv.title,
    last_message: conv.last_message || conv.lastMessage || '',
    // These are for backward compatibility
    userId: conv.user_id || conv.userId || '',
    createdAt: (conv.created_at || conv.createdAt || '').toString(),
    updatedAt: (conv.updated_at || conv.updatedAt || '').toString(),
    lastMessage: conv.last_message || conv.lastMessage || ''
  }));
};

// Get a specific conversation by ID
const getConversation = async (conversationId: string): Promise<ChatConversation | null> => {
  // In a real app, this would be an API call
  const conversation = mockConversations.find(conv => conv.id === conversationId);
  return conversation || null;
};

// Create a new conversation
const createConversation = async (userId: string, title: string): Promise<ChatConversation> => {
  const timestamp = new Date().toISOString();
  
  const newConversation: ChatConversation = {
    id: uuidv4(),
    user_id: userId,
    created_at: timestamp,
    updated_at: timestamp,
    title,
    last_message: '',
    // These are for backward compatibility
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
    lastMessage: '',
  };
  
  mockConversations.push(newConversation);
  return newConversation;
};

// Update a conversation
const updateConversation = async (conversationId: string, updates: Partial<ChatConversation>): Promise<ChatConversation | null> => {
  // In a real app, this would be an API call
  const index = mockConversations.findIndex(conv => conv.id === conversationId);
  
  if (index === -1) {
    return null;
  }
  
  const timestamp = new Date().toISOString();
  
  // Create an updated conversation object
  const updatedConversation: ChatConversation = {
    ...mockConversations[index],
    ...updates,
    updated_at: timestamp,
    updatedAt: timestamp
  };
  
  // Ensure last_message is present and is a string
  if (!updatedConversation.last_message && updatedConversation.lastMessage) {
    updatedConversation.last_message = updatedConversation.lastMessage;
  } else if (!updatedConversation.last_message) {
    updatedConversation.last_message = '';
  }
  
  if (!updatedConversation.lastMessage && updatedConversation.last_message) {
    updatedConversation.lastMessage = updatedConversation.last_message;
  } else if (!updatedConversation.lastMessage) {
    updatedConversation.lastMessage = '';
  }
  
  // Update the conversation in the array
  mockConversations[index] = updatedConversation;
  
  return updatedConversation;
};

// Delete a conversation
const deleteConversation = async (conversationId: string): Promise<boolean> => {
  // In a real app, this would be an API call
  const initialLength = mockConversations.length;
  const filteredConversations = mockConversations.filter(conv => conv.id !== conversationId);
  
  // Update the mock data if a conversation was removed
  if (filteredConversations.length < initialLength) {
    mockConversations.length = 0;
    mockConversations.push(...filteredConversations);
    return true;
  }
  
  return false;
};

export const conversationsService = {
  getConversationsForUser,
  getConversation,
  createConversation,
  updateConversation,
  deleteConversation
};

export default conversationsService;
