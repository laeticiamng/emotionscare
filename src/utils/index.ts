// @ts-nocheck

// Export all utility functions
export * from './safeOpen';
export * from './formatDate';
export * from './roleUtils';
export * from '@/lib/ai/gdpr-service';
export * from './analytics';
export * from './modeChangeEmitter';
export * from './modeSelectionLogger';
export * from './security';
export * from './userModeHelpers';
export * from './route';

// Add new utility function for user mode display
export const getUserModeDisplayName = (mode: string | null): string => {
  switch (mode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Non défini';
  }
};
