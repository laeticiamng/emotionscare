
/**
 * Chat Types
 * --------------------------------------
 * This file defines the official types for chat functionality.
 * Any new property or correction must be documented here and synchronized across all mockData and components.
 */

export interface ChatMessage {
  id: string;
  text: string;
  content?: string; // For compatibility with different implementations
  sender: 'user' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'system'; // For compatibility with different implementations
  timestamp: string;
  conversationId: string;
  conversation_id?: string; // For compatibility - to be deprecated
  emotions?: Record<string, number>;
  feedback?: string;
  isOptimistic?: boolean;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  updated_at: string;
  created_at: string;
  updatedAt?: string; // For compatibility
  createdAt?: string; // For compatibility
  last_message?: string;
  lastMessage?: string; // For compatibility
  last_message_time?: string;
  messages?: ChatMessage[];
  user_id?: string;
  userId?: string; // For compatibility
  unread?: number;
  category?: string;
  status?: 'active' | 'archived' | 'deleted';
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  message: string;
  emotion?: string;
  status: 'success' | 'error';
  recommendations?: any[];
  suggestions?: string[];
}

// Creating a compatibility utility function for chat service
export const normalizeChatMessage = (message: Partial<ChatMessage>, conversationId: string): ChatMessage => {
  return {
    id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    text: message.text || message.content || '',
    content: message.content || message.text || '',
    sender: message.sender || message.role || 'user',
    role: message.role || message.sender || 'user',
    timestamp: message.timestamp || new Date().toISOString(),
    conversationId: message.conversationId || message.conversation_id || conversationId,
    conversation_id: message.conversationId || message.conversation_id || conversationId,
    emotions: message.emotions || {},
    feedback: message.feedback || '',
    isOptimistic: message.isOptimistic || false,
    metadata: message.metadata || {}
  };
};
