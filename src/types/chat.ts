
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
