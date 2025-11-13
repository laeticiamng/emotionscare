// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface RoleAuditLog {
  id: string;
  user_email: string;
  action: 'add' | 'remove' | 'update';
  role: string;
  old_role?: string;
  new_role?: string;
  changed_by_email?: string;
  changed_at: string;
}

export const useRoleAuditLogs = (limit = 100, offset = 0) => {
  return useQuery({
    queryKey: ['role-audit-logs', limit, offset],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_role_audit_logs', {
        _limit: limit,
        _offset: offset,
      });

      if (error) {
        logger.error('Failed to fetch audit logs', error, 'ADMIN');
        throw error;
      }

      return data as RoleAuditLog[];
    },
    refetchInterval: 30000, // Refresh every 30s
  });
};

export const useUserRoleAuditHistory = (userId: string, limit = 50) => {
  return useQuery({
    queryKey: ['user-role-audit-history', userId, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_role_audit_history', {
        _user_id: userId,
        _limit: limit,
      });

      if (error) {
        logger.error('Failed to fetch user audit history', error, 'ADMIN');
        throw error;
      }

      return data as Array<{
        id: string;
        action: 'add' | 'remove' | 'update';
        role: string;
        old_role?: string;
        new_role?: string;
        changed_by_email?: string;
        changed_at: string;
        metadata?: any;
      }>;
    },
  });
};
