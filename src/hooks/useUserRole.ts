// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { AppRole, getUserHighestRole, hasRole, isPremiumOrHigher } from '@/services/userRolesService';

export type { AppRole } from '@/services/userRolesService';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const useUserRole = () => {
  const { user, isAuthenticated } = useAuth();
  const [roles, setRoles] = useState<UserRoleData[]>([]);
  const [primaryRole, setPrimaryRole] = useState<AppRole | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setRoles([]);
      setPrimaryRole(null);
      setIsPremium(false);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        setLoading(true);
        
        // Récupérer les rôles
        const { data, error: fetchError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id);

        if (fetchError) throw fetchError;

        const userRoles = (data || []) as UserRoleData[];
        setRoles(userRoles);

        // Récupérer le rôle le plus élevé via le service
        const highest = await getUserHighestRole(user.id);
        setPrimaryRole(highest);

        // Vérifier si premium ou plus
        const premium = await isPremiumOrHigher(user.id);
        setIsPremium(premium);

        setError(null);
      } catch (err) {
        logger.error('Error fetching user roles', err as Error, 'AUTH');
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [isAuthenticated, user]);

  const checkRole = async (role: AppRole): Promise<boolean> => {
    if (!user) return false;
    return hasRole(role, user.id);
  };

  const isAdmin = (): boolean => {
    return primaryRole === 'admin';
  };

  const isModerator = (): boolean => {
    return primaryRole === 'moderator' || primaryRole === 'admin';
  };

  const isPremiumUser = (): boolean => {
    return isPremium;
  };

  return {
    roles,
    primaryRole,
    isPremium,
    loading,
    error,
    hasRole: checkRole,
    isAdmin,
    isModerator,
    isPremiumUser,
  };
};
