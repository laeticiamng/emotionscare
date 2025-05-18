
export interface ChatMessage {
  id: string;
  text?: string;  // For backward compatibility
  content?: string; // New field that will replace text
  sender: 'user' | 'assistant' | 'system' | 'coach';
  timestamp: Date | string;
  conversationId?: string;
  role?: string; // For backward compatibility
  isLoading?: boolean;
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

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface ChatResponse {
  id: string;
  text: string;
  suggestions?: string[];
}

export interface Suggestion {
  id: string;
  text: string;
  category?: string;
}

export interface CoachSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  messageCount: number;
  emotionalState?: string;
  feedbackScore?: number;
}
