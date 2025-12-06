/**
 * Module Community - Communauté sociale
 * Service de gestion des interactions communautaires
 *
 * @module community
 */

// ============================================================================
// SERVICE
// ============================================================================

export { CommunityService } from './communityService';

// ============================================================================
// TYPES
// ============================================================================

// Export des types
export * from './types';

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
