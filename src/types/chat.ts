
/**
 * Message utilisé dans les conversations du module de chat.
 */
export interface ChatMessage {
  id: string;
  /** Contenu textuel du message */
  content: string;
  /** Expéditeur du message */
  sender: 'user' | 'assistant' | string;
  /** Date d'envoi */
  timestamp: string | Date;
  emotion?: string;
  feedback?: string;
  isFeedbackEnabled?: boolean;
  isLoading?: boolean;
  type?: string;
  attachments?: any[];
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastMessage: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  last_message?: string;
  messages: ChatMessage[];
}

export type ChatResponse = {
  message: string;
  emotion?: string;
  recommendations?: string[];
  metadata?: Record<string, any>;
};

export type Conversation = ChatConversation; // Alias for backward compatibility

