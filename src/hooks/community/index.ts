/**
 * Hooks pour la communauté
 */

export { useCommunityPosts } from './useCommunityPosts';
export type { UseCommunityPostsOptions, UseCommunityPostsReturn } from './useCommunityPosts';

export { useCommunityGroups } from './useCommunityGroups';
export type { CommunityGroup, UseCommunityGroupsReturn } from './useCommunityGroups';

export { useCommunityComments } from './useCommunityComments';
export type { Comment, UseCommunityCommentsReturn } from './useCommunityComments';

export { useFollow, useMyFollowStats } from './useFollow';
export type { UseFollowReturn } from './useFollow';

export { useRealtimeNotifications } from './useRealtimeNotifications';
export type { Notification, UseRealtimeNotificationsReturn } from './useRealtimeNotifications';

export { useCommunitySearch } from './useCommunitySearch';
export type { SearchResult, UseCommunitySearchReturn } from './useCommunitySearch';

export { useTrendingTags } from './useTrendingTags';
export type { UseTrendingTagsReturn } from './useTrendingTags';

// Re-export TrendingTag type for convenience
export type { TrendingTag } from '@/modules/community/services/communityTrendingService';
