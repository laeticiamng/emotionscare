// @ts-nocheck

import { ChatConversation } from '@/types/chat';

export interface ConversationState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  error?: string | null;
}

export interface ConversationActions {
  setActiveConversationId: (id: string | null) => void;
  loadConversations: () => Promise<ChatConversation[]>;
  createConversation: (title?: string) => Promise<string | null>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  updateConversation: (conversationId: string, title: string, lastMessage: string) => Promise<boolean>;
}
