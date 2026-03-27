// @ts-nocheck
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

type DbRole = string | null;

/**
 * Hook qui récupère le rôle de l'utilisateur depuis la table user_roles (server-side).
 * Remplace la détermination du rôle via localStorage.
 */
export function useServerRole(userId: string | undefined): {
  serverRole: DbRole;
  isLoading: boolean;
} {
  const [serverRole, setServerRole] = useState<DbRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setServerRole(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .limit(1)
          .maybeSingle();

        if (error) {
          logger.warn('[useServerRole] Error fetching role:', error.message);
        }

        if (!cancelled) {
          setServerRole(data?.role ?? null);
        }
      } catch (err) {
        logger.error('[useServerRole] Unexpected error:', err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchRole();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { serverRole, isLoading };
}
