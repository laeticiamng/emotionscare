import { UserModeType } from "@/types/userMode";

/** Loose user shape accepted by helpers — avoids coupling to a single User interface */
interface UserLike {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
}

/**
 * Determine if user has admin privileges
 */
export function isAdmin(user?: UserLike | null): boolean {
  if (!user || !user.role) return false;
  return user.role === 'admin' || user.role === 'b2b_admin';
}

/**
 * Get user's avatar URL with fallback to generated avatar
 */
export function getUserAvatar(user?: UserLike | null): string {
  if (!user) return '';
  
  return user.avatar_url || user.avatarUrl || user.avatar || 
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.email || 'User')}`;
}

/**
 * Get formatted user name with fallback
 */
export function getUserDisplayName(user?: UserLike | null): string {
  if (!user) return 'Utilisateur';
  return user.name || user.email?.split('@')[0] || 'Utilisateur';
}

/**
 * Get first name from user name or email
 */
export function getUserFirstName(user?: UserLike | null): string {
  if (!user) return 'Utilisateur';
  if (user.name) {
    return user.name.split(' ')[0];
  }
  return user.email?.split('@')[0] || 'Utilisateur';
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user?: UserLike | null): string {
  if (!user || !user.name) return '??';
  
  const parts = user.name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * Get user mode from role
 */
export function getUserMode(user?: UserLike | null): UserModeType {
  if (!user || !user.role) return 'b2c';
  
  const role = user.role.toLowerCase();
  
  if (role.includes('admin')) {
    return 'b2b_admin';
  } else if (role.includes('user') || role.includes('b2b')) {
    return 'b2b_user';
  } else {
    return 'b2c';
  }
}

type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

/**
 * Normalize user role to standard format
 */
export function normalizeUserRole(role?: string | null): UserRole {
  if (!role) return 'b2c';
  
  const lowerRole = role.toLowerCase();
  
  if (lowerRole.includes('admin')) {
    return lowerRole.includes('b2b') ? 'b2b_admin' : 'admin';
  } else if (lowerRole.includes('user') || lowerRole.includes('b2b')) {
    return 'b2b_user';
  } else {
    return 'b2c';
  }
}

/**
 * Determine if user can access specific feature
 */
export function canUserAccess(user: UserLike | null, feature: string): boolean {
  if (!user) return false;
  
  const role = normalizeUserRole(user.role);
  
  switch (feature) {
    case 'admin_panel':
    case 'analytics':
    case 'user_management':
    case 'team_insights':
      return role === 'admin' || role === 'b2b_admin';
    case 'premium_features':
      return true;
    default:
      return true;
  }
}
