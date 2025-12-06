
import { ChatMessage } from './chat';

export interface CoachCharacterProps {
  mood?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
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

export { ChatMessage, ChatConversation, ChatResponse } from './chat';
