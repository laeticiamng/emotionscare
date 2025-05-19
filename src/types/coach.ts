
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach' | 'assistant' | 'system';
  timestamp: Date | string;
  type?: 'text' | 'suggestion' | 'action' | 'music' | 'vr' | 'emotion';
  actions?: ChatAction[];
  metadata?: Record<string, any>;
}

export interface ChatAction {
  type: 'link' | 'button' | 'music' | 'vr' | 'scan';
  label: string;
  url?: string;
  action?: () => void;
  data?: any;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  actions?: ChatAction[];
  emotion?: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date | string;
  updatedAt: Date | string;
  summary?: string;
  tags?: string[];
  emotionStart?: string;
  emotionEnd?: string;
}

export interface CoachCharacterProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  emotion?: string;
  name?: string;
  avatar?: string;
  mood?: string;
  onClick?: () => void;
}

export interface CoachMessageProps {
  message: ChatMessage;
  isTyping?: boolean;
  onActionClick?: (action: ChatAction) => void;
}

export interface CoachChatProps {
  initialMessage?: string;
  onSendMessage?: (message: string) => void;
  onEmotionDetected?: (emotion: string, confidence: number) => void;
  className?: string;
  showVoiceInput?: boolean;
}
