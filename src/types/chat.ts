
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'recommendation';
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  recommendations?: any[];
}

export interface CoachCharacterProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean;
  className?: string;
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
