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
export * from './services';

// ============================================================================
// TYPES
// ============================================================================

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
