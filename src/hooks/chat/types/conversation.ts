// @ts-nocheck
/**
 * Conversation Types - Types pour la gestion des conversations chat
 * État, actions et helpers pour les conversations
 */

import { ChatConversation } from '@/types/chat';

/** Statut de conversation */
export type ConversationStatus = 'active' | 'archived' | 'deleted' | 'pending';

/** Type de conversation */
export type ConversationType = 'coach' | 'support' | 'ai' | 'group' | 'direct';

/** Priorité de conversation */
export type ConversationPriority = 'low' | 'normal' | 'high' | 'urgent';

/** Mode de tri */
export type SortMode = 'recent' | 'unread' | 'oldest' | 'priority' | 'alphabetical';

/** État de la conversation */
export interface ConversationState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  error?: string | null;
  lastSync?: string;
  totalCount?: number;
  unreadCount?: number;
  filters?: ConversationFilters;
  sortMode?: SortMode;
}

/** Filtres de conversation */
export interface ConversationFilters {
  status?: ConversationStatus[];
  type?: ConversationType[];
  priority?: ConversationPriority[];
  dateFrom?: string;
  dateTo?: string;
  hasUnread?: boolean;
  searchQuery?: string;
  tags?: string[];
  participantId?: string;
}

/** Actions sur les conversations */
export interface ConversationActions {
  setActiveConversationId: (id: string | null) => void;
  loadConversations: () => Promise<ChatConversation[]>;
  createConversation: (title?: string, options?: CreateConversationOptions) => Promise<string | null>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  updateConversation: (conversationId: string, title: string, lastMessage: string) => Promise<boolean>;

  // Actions étendues
  archiveConversation: (conversationId: string) => Promise<boolean>;
  restoreConversation: (conversationId: string) => Promise<boolean>;
  pinConversation: (conversationId: string) => Promise<boolean>;
  unpinConversation: (conversationId: string) => Promise<boolean>;
  markAsRead: (conversationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  setFilters: (filters: ConversationFilters) => void;
  setSortMode: (mode: SortMode) => void;
  refresh: () => Promise<void>;
  clearError: () => void;
}

/** Options de création de conversation */
export interface CreateConversationOptions {
  type?: ConversationType;
  priority?: ConversationPriority;
  participants?: string[];
  metadata?: Record<string, unknown>;
  tags?: string[];
  initialMessage?: string;
}

/** Métadonnées de conversation */
export interface ConversationMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  type: ConversationType;
  status: ConversationStatus;
  priority: ConversationPriority;
  isPinned: boolean;
  isArchived: boolean;
  unreadCount: number;
  messageCount: number;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  participants: ConversationParticipant[];
  tags: string[];
  customFields?: Record<string, unknown>;
}

/** Participant de conversation */
export interface ConversationParticipant {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: string;
  lastSeenAt?: string;
  isOnline?: boolean;
  permissions?: ParticipantPermissions;
}

/** Permissions de participant */
export interface ParticipantPermissions {
  canSendMessages: boolean;
  canEditMessages: boolean;
  canDeleteMessages: boolean;
  canInviteOthers: boolean;
  canManageConversation: boolean;
}

/** Résumé de conversation */
export interface ConversationSummary {
  id: string;
  title: string;
  type: ConversationType;
  status: ConversationStatus;
  unreadCount: number;
  lastMessagePreview?: string;
  lastMessageAt?: string;
  participantCount: number;
  isPinned: boolean;
}

/** Événement de conversation */
export interface ConversationEvent {
  type: ConversationEventType;
  conversationId: string;
  timestamp: string;
  userId: string;
  data?: Record<string, unknown>;
}

/** Types d'événements */
export type ConversationEventType =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'archived'
  | 'restored'
  | 'participant_joined'
  | 'participant_left'
  | 'message_received'
  | 'message_read'
  | 'typing_started'
  | 'typing_stopped';

/** Résultat de recherche */
export interface ConversationSearchResult {
  conversations: ChatConversation[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
  searchTime: number;
  highlights?: Map<string, string[]>;
}

/** Options de pagination */
export interface ConversationPaginationOptions {
  limit: number;
  cursor?: string;
  offset?: number;
}

/** Statistiques de conversation */
export interface ConversationStats {
  totalConversations: number;
  activeConversations: number;
  archivedConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  averageResponseTime?: number;
  busiestDay?: string;
  busiestHour?: number;
}

/** Configuration de conversation */
export interface ConversationConfig {
  maxTitleLength: number;
  maxParticipants: number;
  autoArchiveAfterDays: number;
  enableTypingIndicators: boolean;
  enableReadReceipts: boolean;
  enableReactions: boolean;
  retentionDays: number;
}

/** Valeurs par défaut */
export const DEFAULT_CONVERSATION_STATE: ConversationState = {
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  error: null,
  unreadCount: 0,
  sortMode: 'recent'
};

export const DEFAULT_CONVERSATION_CONFIG: ConversationConfig = {
  maxTitleLength: 100,
  maxParticipants: 50,
  autoArchiveAfterDays: 90,
  enableTypingIndicators: true,
  enableReadReceipts: true,
  enableReactions: true,
  retentionDays: 365
};

export const DEFAULT_FILTERS: ConversationFilters = {
  status: ['active'],
  hasUnread: false
};

/** Type guard pour ChatConversation */
export function isChatConversation(value: unknown): value is ChatConversation {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'title' in value
  );
}

/** Vérifier si une conversation est non lue */
export function hasUnreadMessages(conversation: ChatConversation): boolean {
  const metadata = conversation.metadata as ConversationMetadata | undefined;
  return (metadata?.unreadCount ?? 0) > 0;
}

/** Obtenir le nombre de non lus */
export function getUnreadCount(conversation: ChatConversation): number {
  const metadata = conversation.metadata as ConversationMetadata | undefined;
  return metadata?.unreadCount ?? 0;
}

/** Vérifier si une conversation est épinglée */
export function isPinned(conversation: ChatConversation): boolean {
  const metadata = conversation.metadata as ConversationMetadata | undefined;
  return metadata?.isPinned ?? false;
}

/** Vérifier si une conversation est archivée */
export function isArchived(conversation: ChatConversation): boolean {
  const metadata = conversation.metadata as ConversationMetadata | undefined;
  return metadata?.isArchived ?? false;
}

/** Trier les conversations */
export function sortConversations(
  conversations: ChatConversation[],
  mode: SortMode
): ChatConversation[] {
  const sorted = [...conversations];

  switch (mode) {
    case 'recent':
      return sorted.sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      });

    case 'oldest':
      return sorted.sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        return aTime - bTime;
      });

    case 'unread':
      return sorted.sort((a, b) => {
        const aUnread = getUnreadCount(a);
        const bUnread = getUnreadCount(b);
        if (aUnread !== bUnread) return bUnread - aUnread;
        // Si égaux, trier par date récente
        const aTime = new Date(a.updatedAt || 0).getTime();
        const bTime = new Date(b.updatedAt || 0).getTime();
        return bTime - aTime;
      });

    case 'alphabetical':
      return sorted.sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      );

    case 'priority':
      return sorted.sort((a, b) => {
        const priorities = { urgent: 0, high: 1, normal: 2, low: 3 };
        const aMetadata = a.metadata as ConversationMetadata | undefined;
        const bMetadata = b.metadata as ConversationMetadata | undefined;
        const aPriority = priorities[aMetadata?.priority || 'normal'];
        const bPriority = priorities[bMetadata?.priority || 'normal'];
        return aPriority - bPriority;
      });

    default:
      return sorted;
  }
}

/** Filtrer les conversations */
export function filterConversations(
  conversations: ChatConversation[],
  filters: ConversationFilters
): ChatConversation[] {
  return conversations.filter(conv => {
    const metadata = conv.metadata as ConversationMetadata | undefined;

    // Filtre par statut
    if (filters.status?.length) {
      const status = metadata?.status || 'active';
      if (!filters.status.includes(status)) return false;
    }

    // Filtre par type
    if (filters.type?.length) {
      const type = metadata?.type || 'ai';
      if (!filters.type.includes(type)) return false;
    }

    // Filtre par non lu
    if (filters.hasUnread !== undefined) {
      const hasUnread = (metadata?.unreadCount || 0) > 0;
      if (filters.hasUnread !== hasUnread) return false;
    }

    // Filtre par recherche
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const title = (conv.title || '').toLowerCase();
      const preview = (metadata?.lastMessagePreview || '').toLowerCase();
      if (!title.includes(query) && !preview.includes(query)) return false;
    }

    // Filtre par tags
    if (filters.tags?.length) {
      const tags = metadata?.tags || [];
      if (!filters.tags.some(tag => tags.includes(tag))) return false;
    }

    // Filtre par date
    if (filters.dateFrom) {
      const convDate = new Date(conv.createdAt || 0);
      if (convDate < new Date(filters.dateFrom)) return false;
    }

    if (filters.dateTo) {
      const convDate = new Date(conv.createdAt || 0);
      if (convDate > new Date(filters.dateTo)) return false;
    }

    return true;
  });
}

/** Créer un résumé de conversation */
export function createConversationSummary(conversation: ChatConversation): ConversationSummary {
  const metadata = conversation.metadata as ConversationMetadata | undefined;

  return {
    id: conversation.id,
    title: conversation.title || 'Sans titre',
    type: metadata?.type || 'ai',
    status: metadata?.status || 'active',
    unreadCount: metadata?.unreadCount || 0,
    lastMessagePreview: metadata?.lastMessagePreview,
    lastMessageAt: metadata?.lastMessageAt,
    participantCount: metadata?.participants?.length || 1,
    isPinned: metadata?.isPinned || false
  };
}

/** Grouper les conversations par statut */
export function groupByStatus(
  conversations: ChatConversation[]
): Record<ConversationStatus, ChatConversation[]> {
  const groups: Record<ConversationStatus, ChatConversation[]> = {
    active: [],
    archived: [],
    deleted: [],
    pending: []
  };

  for (const conv of conversations) {
    const metadata = conv.metadata as ConversationMetadata | undefined;
    const status = metadata?.status || 'active';
    groups[status].push(conv);
  }

  return groups;
}

export default {
  DEFAULT_CONVERSATION_STATE,
  DEFAULT_CONVERSATION_CONFIG,
  DEFAULT_FILTERS,
  isChatConversation,
  hasUnreadMessages,
  getUnreadCount,
  isPinned,
  isArchived,
  sortConversations,
  filterConversations,
  createConversationSummary,
  groupByStatus
};
