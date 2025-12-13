// @ts-nocheck
/**
 * Chat History Types - Types pour l'historique de conversation
 * Interfaces pour la gestion des conversations et messages
 */

import { ChatConversation, ChatMessage } from '@/types/chat';

/** Options de chargement des messages */
export interface LoadMessagesOptions {
  limit?: number;
  offset?: number;
  before?: string;
  after?: string;
  includeDeleted?: boolean;
  orderBy?: 'asc' | 'desc';
}

/** Options de filtrage des conversations */
export interface ConversationFilterOptions {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  hasUnread?: boolean;
  isArchived?: boolean;
  participantId?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

/** Résultat paginé de messages */
export interface PaginatedMessages {
  messages: ChatMessage[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

/** Résultat paginé de conversations */
export interface PaginatedConversations {
  conversations: ChatConversation[];
  total: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

/** État de chargement */
export interface LoadingState {
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: ChatHistoryError | null;
}

/** Erreur d'historique */
export interface ChatHistoryError {
  code: ChatHistoryErrorCode;
  message: string;
  details?: unknown;
  timestamp: number;
  retryable: boolean;
}

/** Codes d'erreur */
export type ChatHistoryErrorCode =
  | 'LOAD_FAILED'
  | 'DELETE_FAILED'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'INVALID_ID';

/** Statistiques de conversation */
export interface ConversationStats {
  totalMessages: number;
  unreadCount: number;
  lastMessageAt: string | null;
  averageResponseTime?: number;
  participantCount: number;
}

/** Résumé de conversation */
export interface ConversationSummary {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  participantCount: number;
  isArchived: boolean;
  isPinned: boolean;
}

/** Options de suppression */
export interface DeleteOptions {
  soft?: boolean;
  deleteMessages?: boolean;
  notify?: boolean;
}

/** Options d'archivage */
export interface ArchiveOptions {
  archive: boolean;
  moveToFolder?: string;
}

/** Options d'export */
export interface ExportOptions {
  format: 'json' | 'csv' | 'txt' | 'pdf';
  includeMetadata?: boolean;
  dateRange?: { start: Date; end: Date };
}

/** Actions sur une conversation */
export interface ConversationActions {
  archive: (options?: ArchiveOptions) => Promise<boolean>;
  unarchive: () => Promise<boolean>;
  pin: () => Promise<boolean>;
  unpin: () => Promise<boolean>;
  markAsRead: () => Promise<boolean>;
  markAsUnread: () => Promise<boolean>;
  export: (options: ExportOptions) => Promise<Blob>;
  getStats: () => Promise<ConversationStats>;
}

/** Cache de conversation */
export interface ConversationCache {
  conversations: Map<string, ChatConversation>;
  messages: Map<string, ChatMessage[]>;
  lastFetch: number;
  isStale: boolean;
}

/** Événement de mise à jour */
export interface HistoryUpdateEvent {
  type: 'conversation_added' | 'conversation_removed' | 'conversation_updated' | 'message_added' | 'message_removed';
  conversationId: string;
  messageId?: string;
  timestamp: number;
  data?: unknown;
}

/** Listener de mise à jour */
export type HistoryUpdateListener = (event: HistoryUpdateEvent) => void;

/** Résultat du hook useChatHistory */
export interface UseChatHistoryResult {
  // Données
  conversations: ChatConversation[];
  activeConversationId: string | null;
  activeConversation: ChatConversation | null;

  // État
  loadingState: LoadingState;
  isLoading: boolean;
  error: ChatHistoryError | null;

  // Actions sur les conversations
  deleteConversation: (conversationId: string, options?: DeleteOptions) => Promise<boolean>;
  archiveConversation: (conversationId: string, options?: ArchiveOptions) => Promise<boolean>;
  pinConversation: (conversationId: string) => Promise<boolean>;
  unpinConversation: (conversationId: string) => Promise<boolean>;

  // Chargement des messages
  loadMessages: (conversationId: string, options?: LoadMessagesOptions) => Promise<ChatMessage[]>;
  loadMoreMessages: (conversationId: string) => Promise<ChatMessage[]>;
  refreshMessages: (conversationId: string) => Promise<ChatMessage[]>;

  // Navigation
  setActiveConversationId: (id: string | null) => void;
  selectConversation: (conversation: ChatConversation) => void;
  clearActiveConversation: () => void;

  // Recherche et filtrage
  searchConversations: (query: string) => Promise<ChatConversation[]>;
  filterConversations: (options: ConversationFilterOptions) => ChatConversation[];
  getConversationById: (id: string) => ChatConversation | undefined;

  // Statistiques
  getConversationStats: (conversationId: string) => Promise<ConversationStats>;
  getTotalUnreadCount: () => number;

  // Rafraîchissement
  refresh: () => Promise<void>;
  clearCache: () => void;

  // Abonnement aux mises à jour
  subscribe: (listener: HistoryUpdateListener) => () => void;
}

/** Configuration du hook */
export interface UseChatHistoryConfig {
  autoRefresh?: boolean;
  refreshInterval?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
  pageSize?: number;
  initialLoad?: boolean;
  onError?: (error: ChatHistoryError) => void;
  onConversationSelect?: (conversation: ChatConversation | null) => void;
}

/** État initial */
export const INITIAL_LOADING_STATE: LoadingState = {
  isLoading: false,
  isLoadingMore: false,
  isRefreshing: false,
  error: null
};

/** Configuration par défaut */
export const DEFAULT_CHAT_HISTORY_CONFIG: UseChatHistoryConfig = {
  autoRefresh: false,
  refreshInterval: 30000,
  cacheEnabled: true,
  cacheTTL: 300000,
  pageSize: 20,
  initialLoad: true
};

/** Créer une erreur d'historique */
export function createHistoryError(
  code: ChatHistoryErrorCode,
  message: string,
  details?: unknown
): ChatHistoryError {
  return {
    code,
    message,
    details,
    timestamp: Date.now(),
    retryable: ['NETWORK_ERROR', 'TIMEOUT', 'LOAD_FAILED'].includes(code)
  };
}

/** Vérifier si une conversation est valide */
export function isValidConversation(conversation: unknown): conversation is ChatConversation {
  return (
    typeof conversation === 'object' &&
    conversation !== null &&
    'id' in conversation &&
    typeof (conversation as ChatConversation).id === 'string'
  );
}

/** Trier les conversations par date */
export function sortConversationsByDate(
  conversations: ChatConversation[],
  order: 'asc' | 'desc' = 'desc'
): ChatConversation[] {
  return [...conversations].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
    const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/** Filtrer les conversations par recherche */
export function filterConversationsBySearch(
  conversations: ChatConversation[],
  query: string
): ChatConversation[] {
  if (!query.trim()) return conversations;

  const lowerQuery = query.toLowerCase();
  return conversations.filter(conv => {
    const title = conv.title?.toLowerCase() || '';
    const lastMessage = conv.last_message?.toLowerCase() || '';
    return title.includes(lowerQuery) || lastMessage.includes(lowerQuery);
  });
}

/** Grouper les conversations par date */
export function groupConversationsByDate(
  conversations: ChatConversation[]
): Record<string, ChatConversation[]> {
  const groups: Record<string, ChatConversation[]> = {};

  conversations.forEach(conv => {
    const date = new Date(conv.updated_at || conv.created_at || Date.now());
    const key = date.toISOString().split('T')[0];

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(conv);
  });

  return groups;
}

export default {
  INITIAL_LOADING_STATE,
  DEFAULT_CHAT_HISTORY_CONFIG,
  createHistoryError,
  isValidConversation,
  sortConversationsByDate,
  filterConversationsBySearch,
  groupConversationsByDate
};
