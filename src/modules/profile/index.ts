/**
 * Profile Module
 * Export centralisé du module de gestion du profil
 */

// Types
export * from './types';

// Service
export { profileService } from './profileService';

// Hook
export { useProfile, default as useProfileHook } from './useProfile';
