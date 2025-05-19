
export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: "system" | "user" | "coach" | "assistant" | string;
  timestamp?: Date | string;
  role?: "system" | "user" | "assistant";
  isLoading?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ChatResponse {
  text: string;
  conversationId: string;
  messageId: string;
}

export interface CoachCharacterProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: string;
  animated?: boolean;
  className?: string;
}

export interface CoachMessageProps {
  message: ChatMessage;
  isTyping?: boolean;
  isLast?: boolean;
}

export interface CoachChatProps {
  initialMessages?: ChatMessage[];
  onSend?: (message: string) => void;
  onReady?: () => void;
  showCharacter?: boolean;
  characterSize?: 'sm' | 'md' | 'lg' | 'xl';
  characterMood?: string;
  showControls?: boolean;
  showHeader?: boolean;
  showInput?: boolean;
  embedded?: boolean;
}
