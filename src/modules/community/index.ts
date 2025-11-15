/**
 * Module Community - Communauté sociale
 * Service de gestion des interactions communautaires
 *
 * @module community
 */

// ============================================================================
// SERVICE
// ============================================================================

export {
  communityService,
  default as communityServiceDefault,
} from './communityService';

// ============================================================================
// TYPES
// ============================================================================

// Export des types
export * from './types';

// Re-export des types depuis le service
export type {
  CommunityPost,
  CommunityComment,
  CommunityReaction,
  CommunityMember,
  CommunityEvent,
  CommunityChallenge,
} from './communityService';
