
export interface ChatMessage {
  id: string;
  text?: string;  // For backward compatibility
  content?: string; // New field that will replace text
  sender: 'user' | 'assistant' | 'system' | 'coach' | string; // Added string for flexibility with context
  timestamp: Date | string;
  conversationId?: string;
  role?: string; // For backward compatibility
  isLoading?: boolean;
  emojis?: string[] | string; // Added for emotion analysis
}

export interface CoachMessageProps {
  message: ChatMessage;
  isLast?: boolean; // Added isLast property
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

// Add CoachCharacterProps interface
export interface CoachCharacterProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
  onInteract?: () => void;
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
