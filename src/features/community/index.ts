/**
 * Community Feature
 * 
 * Social interactions, posts, groups, and community features.
 * @module features/community
 */

// ============================================================================
// HOOKS - Re-export depuis le dossier hooks/community organisé
// ============================================================================
export {
  useCommunityPosts,
  useCommunityGroups,
  useCommunityComments,
  useFollow,
  useMyFollowStats,
  useRealtimeNotifications,
  useCommunitySearch,
  useTrendingTags,
} from '@/hooks/community';

export type {
  UseCommunityPostsOptions,
  UseCommunityPostsReturn,
  UseCommunityGroupsReturn,
  Comment as CommunityComment,
  UseCommunityCommentsReturn,
  UseFollowReturn,
  Notification,
  UseRealtimeNotificationsReturn,
  SearchResult,
  UseCommunitySearchReturn,
  UseTrendingTagsReturn,
} from '@/hooks/community';

// Hooks additionnels
export { useCommunityEnhancements } from '@/hooks/useCommunityEnhancements';
export { useCommunityRecommendations } from '@/hooks/useCommunityRecommendations';

// ============================================================================
// COMPONENTS
// ============================================================================
export { default as EmpathicRepliesPanel } from './EmpathicRepliesPanel';
export { default as ListenTwoMinutesBanner } from './ListenTwoMinutesBanner';
export { CommunityPostCard, type CommunityPost as CommunityPostCardProps } from './components/CommunityPostCard';
export { SupportCircleWidget, type SupportCircle } from './components/SupportCircleWidget';
export { CommunityPresetsGallery } from '@/components/community/CommunityPresetsGallery';

// ============================================================================
// SERVICES - Re-export from modules
// ============================================================================
export {
  CommunityService,
  CommunityFollowService,
  CommunityReportService,
  REPORT_REASONS,
  CommunitySavedPostsService,
  CommunityTrendingService,
  CommunityMentionService,
} from '@/modules/community';

// ============================================================================
// TYPES
// ============================================================================
export type {
  CommunityStats,
  ModerationStatus,
  ReactionType,
  CommunityPost,
  PostComment,
  PostReaction,
  CommunityGroup,
  CommunityNotification,
  UserFollow,
  FollowStats,
  AuraConnection,
  Buddy,
  Post,
  Group,
  Reaction,
  NotificationPayload,
  ReportReason,
  CommunityReport,
  SavedPost,
  TrendingTag,
  CommunityMention,
} from '@/modules/community';
