
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from '@/types/chat';

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
    }
  ]
};

/**
 * Service for managing chat messages
 */
export const messagesService = {
  /**
   * Fetch all messages for a conversation
   */
  fetchByConversation: async (conversationId: string): Promise<ChatMessage[]> => {
    return messages[conversationId] || [];
  },

  /**
   * Add a message to a conversation
   */
  add: async (messageData: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      ...messageData
    };
    
    if (!messages[messageData.conversation_id]) {
      messages[messageData.conversation_id] = [];
    }
    
    messages[messageData.conversation_id].push(newMessage);
    return newMessage;
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (conversationId: string, userId: string): Promise<boolean> => {
    const conversationMessages = messages[conversationId];
    if (!conversationMessages) return false;
    
    conversationMessages.forEach(msg => {
      if (msg.sender !== 'user' && msg.sender_id !== userId) {
        msg.is_read = true;
      }
    });
    
    return true;
  },

  /**
   * Count unread messages
   */
  countUnread: async (userId: string): Promise<number> => {
    let count = 0;
    
    Object.values(messages).forEach(conversationMessages => {
      conversationMessages.forEach(msg => {
        if (msg.sender !== 'user' && !msg.is_read && typeof msg.timestamp !== 'string' && msg.timestamp.toISOString) {
          count++;
        }
      });
    });
    
    return count;
  },
  
  /**
   * Delete all messages for a conversation
   */
  deleteByConversation: async (conversationId: string): Promise<boolean> => {
    if (!messages[conversationId]) return false;
    
    delete messages[conversationId];
    return true;
  }
};
