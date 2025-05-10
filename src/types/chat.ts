
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
  isLoading?: boolean;
  type?: 'text' | 'image' | 'audio' | 'video';
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: Date;
  updated_at: Date;
  tags?: string[];
  emotion?: string;
  user_id: string;
}

export interface ChatSettings {
  tone?: 'formal' | 'casual' | 'friendly' | 'professional';
  responseLength?: 'concise' | 'detailed' | 'comprehensive';
  language?: string;
  aiModel?: string;
}
