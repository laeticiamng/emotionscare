
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  conversationId: string;
  role?: string; // For backward compatibility
  isUser?: boolean; // For backward compatibility
  isTyping?: boolean;
  attachments?: string[];
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  isActive?: boolean; // Add for backward compatibility
  participants?: string[];
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  id: string;
  content: string;
  role?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Additional interfaces for components
export interface CoachCharacterProps {
  status?: 'online' | 'offline' | 'typing';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
  className?: string;
}

export interface CoachChatProps {
  conversationId?: string;
  autoFocus?: boolean;
  className?: string;
}
