
// Chat related types

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  emotion?: string;
  emotion_score?: number;
  is_read?: boolean;
  metadata?: Record<string, any>;
}

export interface ChatConversation {
  id: string;
  title?: string;
  messages: ChatMessage[];
  created_at: Date;
  updated_at?: Date; // Keep snake_case name in interface
  tags?: string[];
  user_id: string;
  summary?: string;
  context?: Record<string, any>;
  lastMessage?: string; // Added for ConversationList component
}

export interface ChatThread {
  id: string;
  title: string;
  last_message?: string;
  last_timestamp: Date;
  unread_count: number;
  is_archived?: boolean;
  context?: Record<string, any>;
}

export interface ChatSettings {
  notification_enabled: boolean;
  show_typing_indicator: boolean;
  sound_enabled: boolean;
  auto_reply?: boolean;
  suggested_replies?: boolean;
  history_retention_days?: number;
}
