/**
 * Module Community - Communauté sociale
 * Service de gestion des interactions communautaires
 *
 * @module community
 */

// ============================================================================
// SERVICES
// ============================================================================

export { CommunityService } from './communityService';
export { CommunityFollowService } from './services/communityFollowService';
export { CommunityReportService, REPORT_REASONS } from './services/communityReportService';
export { CommunitySavedPostsService } from './services/communitySavedPostsService';
export { CommunityTrendingService } from './services/communityTrendingService';
export { CommunityMentionService } from './services/communityMentionService';

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
  FollowStats
} from './types';

// Re-export des types depuis le service
export type {
  AuraConnection,
  Buddy,
  Post,
  Comment,
  Group,
  Reaction,
  NotificationPayload,
} from './communityService';

// Types from services
export type { ReportReason, CommunityReport } from './services/communityReportService';
export type { SavedPost } from './services/communitySavedPostsService';
export type { TrendingTag } from './services/communityTrendingService';
export type { CommunityMention } from './services/communityMentionService';
