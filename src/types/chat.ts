
/**
 * Types officiels pour le domaine chat.
 * Toute modification doit être synchronisée dans tous les mocks et composants.
 * Ne jamais dupliquer ce type en local.
 */

export interface ChatMessage {
  id: string;
  text: string;
  content?: string; // Legacy property - use text instead
  sender: 'user' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'system'; // For compatibility with different implementations
  timestamp: string;
  conversationId?: string;
  conversation_id?: string; // Legacy property - use conversationId instead
  metadata?: Record<string, any>;
  attachments?: Array<{
    id: string;
    type: string;
    url: string;
    name?: string;
  }>;
  isLoading?: boolean;
  emotions?: Record<string, number>;
  feedback?: string;
  isOptimistic?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  /** Latest message content */
  lastMessage?: string;
  /** Legacy snake_case fields for backward compatibility */
  created_at?: string;
  updated_at?: string;
  last_message?: string;
  user_id?: string;
  messages: ChatMessage[];
  summary?: string;
  participants?: string[];
  status?: 'active' | 'archived' | 'deleted';
}

// Added for backwards compatibility
export type ChatConversation = Conversation;

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
    sender: message.sender || message.role || 'user',
    timestamp: message.timestamp || new Date().toISOString(),
    conversationId: message.conversationId || message.conversation_id || conversationId,
    metadata: message.metadata || {},
    attachments: message.attachments || [],
    isLoading: message.isLoading || false
  };
}

// Additional interface for the chat hook to fix build errors
export interface ChatHookResult {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (text: string) => void;
  conversationId: string;
  clearMessages: () => void;
  setConversation: (id: string) => void;
  input: string;
  setInput: (text: string) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  initialConversationId?: string;
}
