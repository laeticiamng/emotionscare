
import { UserModeType } from '@/types/userMode';

/**
 * Normalizes user mode input to a standard format
 */
export const normalizeUserMode = (mode: string | UserModeType): string => {
  if (!mode) return 'b2c';
  
  const normalizedMode = mode.toString().toLowerCase();
  
  // B2C variations
  if (normalizedMode.includes('b2c') || 
      normalizedMode.includes('particulier') || 
      normalizedMode.includes('individual')) {
    return 'b2c';
  }
  
  // B2B Admin variations
  if (normalizedMode.includes('admin') || 
      normalizedMode.includes('rh') || 
      normalizedMode.includes('gestionnaire')) {
    return 'b2b_admin';
  }
  
  // B2B User variations
  if (normalizedMode.includes('b2b') || 
      normalizedMode.includes('collab') || 
      normalizedMode.includes('employee') || 
      normalizedMode.includes('user')) {
    return 'b2b_user';
  }
  
  // Super admin variation
  if (normalizedMode.includes('super')) {
    return 'admin';
  }
  
  // Default to B2C
  return 'b2c';
};

/**
 * Get the display label for a user mode
 */
export const getUserModeLabel = (mode: UserModeType | string): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch(normalizedMode) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Responsable RH';
    case 'admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
};

/**
 * Get the route prefix for a user mode
 */
export const getUserModeRoutePrefix = (mode: UserModeType | string): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch(normalizedMode) {
    case 'b2c':
      return '/b2c';
    case 'b2b_user':
      return '/b2b/user';
    case 'b2b_admin':
      return '/b2b/admin';
    case 'admin':
      return '/admin';
    default:
      return '/';
  }
};

/**
 * Get the login path for a specific user mode
 */
export const getModeLoginPath = (mode: UserModeType | string): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch(normalizedMode) {
    case 'b2c':
      return '/b2c/login';
    case 'b2b_user':
      return '/b2b/user/login';
    case 'b2b_admin':
      return '/b2b/admin/login';
    case 'admin':
      return '/admin/login';
    default:
      return '/login';
  }
};

/**
 * Get the dashboard path for a specific user mode
 */
export const getModeDashboardPath = (mode: UserModeType | string): string => {
  const normalizedMode = normalizeUserMode(mode);
  
  switch(normalizedMode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

/**
 * Get display name for a user mode
 */
// Display names for each mode. Can be overridden for i18n.
let displayNames: Record<string, string> = {
  b2c: 'Particulier',
  b2b_admin: 'Administrateur B2B',
  b2b_user: 'Collaborateur B2B',
  admin: 'Administrateur',
  default: 'Utilisateur',
};

export const setUserModeDisplayNames = (names: Partial<typeof displayNames>) => {
  displayNames = { ...displayNames, ...names };
};

export const getUserModeDisplayName = (mode: string): string => {
  const normalizedMode = normalizeUserMode(mode);
  return displayNames[normalizedMode as keyof typeof displayNames] || displayNames.default;
};
