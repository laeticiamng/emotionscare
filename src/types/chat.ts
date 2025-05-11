
export interface ChatMessage {
  id: string;
  text?: string;
  content?: string;
  sender: string;
  sender_type?: string;
  timestamp?: string; // Changed from string | Date to just string
  is_read?: boolean;
  conversation_id?: string;
  role?: string;
  // For backwards compatibility
  sender_id?: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string; // Changed from string | Date to just string
  updated_at: string; // Changed from string | Date to just string
  lastMessage?: string;
  last_message?: string;
  messages?: ChatMessage[];
  // For backwards compatibility
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatResponseType {
  id?: string;
  content?: string;
  message?: string; 
  role?: string;
  timestamp?: string;
  emotion?: string;
}

export type ChatResponse = ChatResponseType;

// Add MusicDrawerProps interface
export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  playlist?: import('./music').MusicPlaylist | null;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}
