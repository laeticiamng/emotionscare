
import { ChatConversation, ChatMessage } from '@/types/chat';

export interface UseChatHistoryResult {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  loadMessages: (conversationId: string) => Promise<ChatMessage[]>;
  setActiveConversationId: (id: string | null) => void;
}
