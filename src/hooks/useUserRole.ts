// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export type AppRole = 'b2c_user' | 'b2b_employee' | 'b2b_rh' | 'admin';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: AppRole;
  organization_id?: string;
  created_at: string;
}

export const useUserRole = () => {
  const { user, isAuthenticated } = useAuth();
  const [roles, setRoles] = useState<UserRoleData[]>([]);
  const [primaryRole, setPrimaryRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setRoles([]);
      setPrimaryRole(null);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id);

        if (fetchError) throw fetchError;

        const userRoles = (data || []) as UserRoleData[];
        setRoles(userRoles);

        // Définir le rôle principal (priorité: admin > b2b_rh > b2b_employee > b2c_user)
        const rolePriority: Record<AppRole, number> = {
          admin: 4,
          b2b_rh: 3,
          b2b_employee: 2,
          b2c_user: 1,
        };

        const primary = userRoles.reduce<UserRoleData | null>((acc, curr) => {
          if (!acc) return curr;
          return rolePriority[curr.role] > rolePriority[acc.role] ? curr : acc;
        }, null);

        setPrimaryRole(primary?.role || null);
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

  const hasRole = (role: AppRole): boolean => {
    return roles.some((r) => r.role === role);
  };

  const isB2C = (): boolean => {
    return hasRole('b2c_user');
  };

  const isB2B = (): boolean => {
    return hasRole('b2b_employee') || hasRole('b2b_rh');
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isRH = (): boolean => {
    return hasRole('b2b_rh');
  };

  return {
    roles,
    primaryRole,
    loading,
    error,
    hasRole,
    isB2C,
    isB2B,
    isAdmin,
    isRH,
  };
};
