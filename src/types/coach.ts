
// Coach types rely on shared chat interfaces
import type { ChatMessage, ChatConversation } from './chat';

export type { ChatMessage, ChatConversation };

export interface ChatResponse {
  content: string;
  emotion?: string;
  suggestions?: string[];
}

export interface CoachCharacterProps {
  emotion?: string;
  speaking?: boolean;
  animate?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  name?: string;
  avatar?: string;
  mood?: string;
  onClick?: () => void;
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
  showCharacter?: boolean;
  characterSize?: 'sm' | 'md' | 'lg';
  className?: string;
  showControls?: boolean;
  showHeader?: boolean;
  showInput?: boolean;
  embedded?: boolean;
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

// For backward compatibility
export type Conversation = ChatConversation;
