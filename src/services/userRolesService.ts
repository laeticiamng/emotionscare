/**
 * Service de gestion des rôles utilisateur
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type AppRole = 'user' | 'premium' | 'admin' | 'moderator';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
}

/**
 * Récupère le rôle le plus élevé d'un utilisateur
 */
export async function getUserHighestRole(userId?: string): Promise<AppRole | null> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      return null;
    }

    const { data, error } = await supabase.rpc('get_user_highest_role', {
      _user_id: userId
    });

    if (error) {
      logger.error('Failed to fetch user highest role', error, 'USER_ROLES');
      return null;
    }

    return data as AppRole;
  } catch (error) {
    logger.error('Error fetching user highest role', error as Error, 'USER_ROLES');
    return null;
  }
}

/**
 * Vérifie si un utilisateur a un rôle spécifique
 */
export async function hasRole(role: AppRole, userId?: string): Promise<boolean> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      return false;
    }

    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: role
    });

    if (error) {
      logger.error('Failed to check user role', error, 'USER_ROLES');
      return false;
    }

    return data as boolean;
  } catch (error) {
    logger.error('Error checking user role', error as Error, 'USER_ROLES');
    return false;
  }
}

/**
 * Vérifie si un utilisateur est premium ou plus
 */
export async function isPremiumOrHigher(userId?: string): Promise<boolean> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      return false;
    }

    const { data, error } = await supabase.rpc('is_premium_or_higher', {
      _user_id: userId
    });

    if (error) {
      logger.error('Failed to check premium status', error, 'USER_ROLES');
      return false;
    }

    return data as boolean;
  } catch (error) {
    logger.error('Error checking premium status', error as Error, 'USER_ROLES');
    return false;
  }
}

/**
 * Récupère tous les rôles d'un utilisateur
 */
export async function getUserRoles(userId?: string): Promise<UserRole[]> {
  try {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      logger.error('Failed to fetch user roles', error, 'USER_ROLES');
      return [];
    }

    return data as UserRole[];
  } catch (error) {
    logger.error('Error fetching user roles', error as Error, 'USER_ROLES');
    return [];
  }
}

/**
 * Ajoute un rôle à un utilisateur (admin uniquement)
 */
export async function assignRole(userId: string, role: AppRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });

    if (error) {
      logger.error('Failed to assign role', error, 'USER_ROLES');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error assigning role', error as Error, 'USER_ROLES');
    return false;
  }
}

/**
 * Retire un rôle d'un utilisateur (admin uniquement)
 */
export async function removeRole(userId: string, role: AppRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) {
      logger.error('Failed to remove role', error, 'USER_ROLES');
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error removing role', error as Error, 'USER_ROLES');
    return false;
  }
}

/**
 * Obtient le niveau de priorité en fonction du rôle
 */
export function getRolePriority(role: AppRole | null): number {
  if (!role) return 0;
  
  const priorities: Record<AppRole, number> = {
    admin: 100,
    moderator: 75,
    premium: 50,
    user: 0,
  };

  return priorities[role] || 0;
}

/**
 * Obtient le libellé du rôle en français
 */
export function getRoleLabel(role: AppRole): string {
  const labels: Record<AppRole, string> = {
    admin: 'Administrateur',
    moderator: 'Modérateur',
    premium: 'Premium',
    user: 'Utilisateur',
  };

  return labels[role] || 'Utilisateur';
}

/**
 * Obtient la couleur associée au rôle
 */
export function getRoleColor(role: AppRole | null): string {
  if (!role) return 'gray';
  
  const colors: Record<AppRole, string> = {
    admin: 'red',
    moderator: 'purple',
    premium: 'gold',
    user: 'gray',
  };

  return colors[role] || 'gray';
}
