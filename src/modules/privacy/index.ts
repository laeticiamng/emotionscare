/**
 * Module Privacy - Gestion de la confidentialité et RGPD
 * 
 * Ce module fournit :
 * - Types pour les préférences de confidentialité
 * - Service Supabase pour la persistance
 * - Hook React avec real-time updates
 */

// Types
export * from './types';

// Service
export { privacyService } from './privacyService';
export {
  getPrivacyPreferences,
  initializePrivacyPreferences,
  updatePrivacyPreference,
  updatePrivacyPreferences,
  getConsentHistory,
  requestDataExport,
  getDataExports,
  requestAccountDeletion,
  cancelDeletionRequest,
  getPrivacyStats,
  getPrivacyAuditLogs,
} from './privacyService';

// Hook
export { usePrivacy, default as usePrivacyHook } from './usePrivacy';
