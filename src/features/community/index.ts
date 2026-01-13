/**
 * Community Feature
 * 
 * Social interactions, posts, groups, and community features.
 * @module features/community
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { default as EmpathicRepliesPanel } from './EmpathicRepliesPanel';
export { default as ListenTwoMinutesBanner } from './ListenTwoMinutesBanner';

// Re-export from modules for backwards compatibility
export {
  CommunityService,
  CommunityFollowService,
  CommunityReportService,
  REPORT_REASONS,
  CommunitySavedPostsService,
  CommunityTrendingService,
  CommunityMentionService,
} from '@/modules/community';

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
  Comment,
  Group,
  Reaction,
  NotificationPayload,
  ReportReason,
  CommunityReport,
  SavedPost,
  TrendingTag,
  CommunityMention,
} from '@/modules/community';

// ============================================================================
// COMPONENTS - Community UI
// ============================================================================

export { CommunityPresetsGallery } from '@/components/community/CommunityPresetsGallery';
