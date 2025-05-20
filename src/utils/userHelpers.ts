
import { User, UserRole } from "@/types/user";
import { UserModeType } from "@/types/userMode";

/**
 * Determine if user has admin privileges
 */
export function isAdmin(user?: User | null): boolean {
  if (!user || !user.role) return false;
  return user.role === 'admin' || user.role === 'b2b_admin';
}

/**
 * Get user's avatar URL with fallback to generated avatar
 */
export function getUserAvatar(user?: User | null): string {
  if (!user) return '';
  
  // Check all possible avatar fields
  return user.avatar_url || user.avatarUrl || user.avatar || 
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.email || 'User')}`;
}

/**
 * Get formatted user name with fallback
 */
export function getUserDisplayName(user?: User | null): string {
  if (!user) return 'Utilisateur';
  return user.name || user.email?.split('@')[0] || 'Utilisateur';
}

/**
 * Get first name from user name or email
 */
export function getUserFirstName(user?: User | null): string {
  if (!user) return 'Utilisateur';
  if (user.name) {
    return user.name.split(' ')[0];
  }
  return user.email?.split('@')[0] || 'Utilisateur';
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user?: User | null): string {
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
export function getUserMode(user?: User | null): UserModeType {
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
export function canUserAccess(user: User | null, feature: string): boolean {
  if (!user) return false;
  
  const role = normalizeUserRole(user.role);
  
  switch (feature) {
    case 'admin_panel':
      return role === 'admin' || role === 'b2b_admin';
    case 'analytics':
      return role === 'admin' || role === 'b2b_admin';
    case 'user_management':
      return role === 'admin' || role === 'b2b_admin';
    case 'team_insights':
      return role === 'admin' || role === 'b2b_admin';
    case 'premium_features':
      return true; // Available to all authenticated users
    default:
      return true;
  }
}
