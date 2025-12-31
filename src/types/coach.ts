import { ChatMessage } from './chat';

export interface CoachCharacterProps {
  name?: string;
  avatar?: string;
  mood?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  animate?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
}

export interface CoachChatProps {
  initialMessage?: string;
  showCharacter?: boolean;
  characterSize?: 'sm' | 'md' | 'lg';
  className?: string;
  showControls?: boolean;
  showHeader?: boolean;
  showInput?: boolean;
  embedded?: boolean;
}

export interface Suggestion {
  id: string;
  text: string;
  type: 'question' | 'reflection' | 'action' | 'exercise';
}

export type { ChatMessage, ChatConversation, ChatResponse } from './chat';
