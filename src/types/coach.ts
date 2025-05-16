
import { ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_type?: string;
  timestamp?: string;
  conversation_id?: string;
  role?: string;
}

export interface CoachCharacterProps {
  name?: string;
  avatar?: string;
  mood?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
  onClick?: () => void;
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
