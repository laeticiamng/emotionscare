
/**
 * Chat Types
 * --------------------------------------
 * This file defines the official types for chat functionality.
 */

export interface ChatMessage {
  id: string;
  text: string;
  content?: string; // Legacy property - use text instead
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  conversationId?: string;
  metadata?: Record<string, any>;
  attachments?: Array<{
    id: string;
    type: string;
    url: string;
    name?: string;
  }>;
  isLoading?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  summary?: string;
  participants?: string[];
  status?: 'active' | 'archived' | 'deleted';
}

/**
 * Normalizes a chat message to ensure it follows the standard format
 */
export function normalizeChatMessage(
  message: Partial<ChatMessage>, 
  conversationId?: string
): ChatMessage {
  return {
    id: message.id || `msg-${Date.now()}`,
    text: message.text || message.content || '',
    sender: message.sender || 'user',
    timestamp: message.timestamp || new Date().toISOString(),
    conversationId: message.conversationId || conversationId,
    metadata: message.metadata || {},
    attachments: message.attachments || [],
    isLoading: message.isLoading || false
  };
}
