
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';

// Mock conversations data
let conversations: ChatConversation[] = [
  {
    id: 'conversation-1',
    user_id: 'user-1',
    created_at: new Date('2023-03-01'),
    updated_at: new Date('2023-03-10'),
    title: 'Première conversation',
    last_message: 'Comment puis-je vous aider aujourd\'hui ?',
    // Add alternative properties for backward compatibility
    userId: 'user-1',
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-10'),
    lastMessage: 'Comment puis-je vous aider aujourd\'hui ?',
  },
  {
    id: 'conversation-2',
    user_id: 'user-1',
    created_at: new Date('2023-03-15'),
    updated_at: new Date('2023-03-15'),
    title: 'Discussion sur la gestion du stress',
    last_message: 'Merci pour ces conseils utiles.',
    // Add alternative properties for backward compatibility
    userId: 'user-1',
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-03-15'),
    lastMessage: 'Merci pour ces conseils utiles.',
  }
];

// Mock messages data
let messages: Record<string, ChatMessage[]> = {
  'conversation-1': [
    {
      id: 'message-1',
      conversation_id: 'conversation-1',
      sender: 'bot',
      sender_id: 'coach-ai',
      timestamp: new Date('2023-03-01T10:00:00'),
      text: 'Bonjour ! Je suis votre coach émotionnel IA. Comment puis-je vous aider aujourd\'hui ?',
      content: 'Bonjour ! Je suis votre coach émotionnel IA. Comment puis-je vous aider aujourd\'hui ?',
      is_read: true
    },
    {
      id: 'message-2',
      conversation_id: 'conversation-1',
      sender: 'user',
      sender_id: 'user-1',
      timestamp: new Date('2023-03-01T10:05:00'),
      text: 'Bonjour ! Je me sens un peu stressé dernièrement.',
      content: 'Bonjour ! Je me sens un peu stressé dernièrement.',
      is_read: true
    }
  ],
  'conversation-2': [
    {
      id: 'message-3',
      conversation_id: 'conversation-2',
      sender: 'user',
      sender_id: 'user-1',
      timestamp: new Date('2023-03-15T14:00:00'),
      text: 'Je cherche des conseils pour mieux gérer mon stress au travail.',
      content: 'Je cherche des conseils pour mieux gérer mon stress au travail.',
      is_read: true
    },
    {
      id: 'message-4',
      conversation_id: 'conversation-2',
      sender: 'bot',
      sender_id: 'coach-ai',
      timestamp: new Date('2023-03-15T14:01:00'),
      text: 'Je comprends. La gestion du stress est importante. Voici quelques techniques que vous pourriez essayer...',
      content: 'Je comprends. La gestion du stress est importante. Voici quelques techniques que vous pourriez essayer...',
      is_read: true
    },
    {
      id: 'message-5',
      conversation_id: 'conversation-2',
      sender: 'user',
      sender_id: 'user-1',
      timestamp: new Date('2023-03-15T14:15:00'),
      text: 'Merci pour ces conseils utiles.',
      content: 'Merci pour ces conseils utiles.',
      is_read: true
    }
  ]
};

/**
 * Fetch all conversations for a user
 */
export const fetchConversations = async (userId: string): Promise<ChatConversation[]> => {
  return conversations.filter(conv => conv.user_id === userId);
};

/**
 * Create a new conversation
 */
export const createConversation = async (userId: string, title: string): Promise<ChatConversation> => {
  const newConv: ChatConversation = {
    id: uuidv4(),
    user_id: userId,
    userId: userId, // Add for backward compatibility
    title: title || 'Nouvelle conversation',
    created_at: new Date(),
    updated_at: new Date(),
    createdAt: new Date(), // Add for backward compatibility
    updatedAt: new Date(), // Add for backward compatibility
  };
  
  conversations.push(newConv);
  messages[newConv.id] = [];
  return newConv;
};

/**
 * Fetch messages for a conversation
 */
export const fetchMessages = async (conversationId: string): Promise<ChatMessage[]> => {
  return messages[conversationId] || [];
};

/**
 * Add a message to a conversation
 */
export const addMessage = async (message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
  const newMessage: ChatMessage = {
    id: uuidv4(),
    ...message
  };
  
  if (!messages[message.conversation_id]) {
    messages[message.conversation_id] = [];
  }
  
  messages[message.conversation_id].push(newMessage);
  
  // Update conversation last message and timestamp
  const conversation = conversations.find(conv => conv.id === message.conversation_id);
  if (conversation) {
    conversation.last_message = message.text;
    conversation.lastMessage = message.text; // Update alternative property
    conversation.updated_at = typeof message.timestamp === 'string' 
      ? new Date(message.timestamp) 
      : message.timestamp;
    conversation.updatedAt = typeof message.timestamp === 'string' 
      ? new Date(message.timestamp) 
      : message.timestamp; // Update alternative property
  }
  
  return newMessage;
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  const initialLength = conversations.length;
  conversations = conversations.filter(conv => conv.id !== conversationId);
  delete messages[conversationId];
  return conversations.length < initialLength;
};

export default {
  fetchConversations,
  createConversation,
  fetchMessages,
  addMessage,
  deleteConversation
};
