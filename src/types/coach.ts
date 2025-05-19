
// Define the types for Coach related components

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isUser?: boolean;
  emotion?: string;
  attachments?: string[];
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ChatResponse {
  content: string;
  emotion?: string;
  suggestions?: string[];
}

export interface CoachCharacterProps {
  emotion?: string;
  speaking?: boolean;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
  showTimestamp?: boolean;
}

export interface CoachChatProps {
  initialMessage?: string;
  onClose?: () => void;
  maxHeight?: string;
}

// Adding missing types
export interface CoachSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  topics: string[];
  sentiment: string;
  messages: ChatMessage[];
}

export interface Suggestion {
  id: string;
  text: string;
  type: 'action' | 'question' | 'reflection';
  context?: string;
}
