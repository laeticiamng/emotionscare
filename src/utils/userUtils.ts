
import { User } from '@/types';

// Get the user's avatar URL, with a fallback
export const getUserAvatarUrl = (user: User | null | undefined): string => {
  if (!user) return '';
  return user.avatar_url || `/images/avatars/default-${user.role || 'b2c'}.png`;
};

// Get user initials for avatar fallback
export const getUserInitials = (user: User | null | undefined): string => {
  if (!user || !user.name) return 'U';
  
  const nameParts = user.name.split(' ');
  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }
  
  return nameParts[0][0].toUpperCase();
};

// Format user display name based on preferences
export const getUserDisplayName = (user: User | null | undefined, useAnonymity = false): string => {
  if (!user) return 'Utilisateur';
  
  if (useAnonymity && user.anonymity_code) {
    return user.anonymity_code;
  }
  
  return user.name || user.email.split('@')[0];
};

// Check if user is part of a team
export const isUserInTeam = (user: User | null | undefined): boolean => {
  if (!user) return false;
  return user.department !== undefined && user.department !== null;
};

// Get user role display name
export const getUserRoleName = (user: User | null | undefined): string => {
  if (!user) return 'Utilisateur';
  
  switch (user.role) {
    case 'b2b_admin':
      return 'Administrateur';
    case 'b2b_user':
      return 'Utilisateur Professionnel';
    case 'b2c':
    default:
      return 'Utilisateur Personnel';
  }
};
