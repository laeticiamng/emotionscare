// @ts-nocheck
/**
 * Hook pour la gestion des rôles B2B
 * Utilise les fonctions SECURITY DEFINER de la base de données
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export type B2BRole = 'b2b_admin' | 'b2b_manager' | 'b2b_member' | 'b2b_viewer';

export interface B2BUserRole {
  id: string;
  userId: string;
  orgId: string;
  role: B2BRole;
  grantedBy: string | null;
  grantedAt: string;
  expiresAt: string | null;
}

export interface UseB2BRoleReturn {
  role: B2BRole | null;
  isAdmin: boolean;
  isManager: boolean;
  isMember: boolean;
  isViewer: boolean;
  hasRole: (role: B2BRole) => boolean;
  canManageTeams: boolean;
  canViewReports: boolean;
  canManageMembers: boolean;
  loading: boolean;
  error: Error | null;
  grantRole: (userId: string, role: B2BRole) => void;
  revokeRole: (userId: string, role: B2BRole) => void;
  isUpdating: boolean;
}

const ROLE_HIERARCHY: B2BRole[] = ['b2b_admin', 'b2b_manager', 'b2b_member', 'b2b_viewer'];

async function fetchUserRole(userId: string, orgId: string): Promise<B2BRole | null> {
  try {
    // Utiliser la fonction RPC pour obtenir le rôle le plus élevé
    const { data, error } = await supabase.rpc('get_highest_b2b_role', {
      _user_id: userId,
      _org_id: orgId
    });

    if (error) {
      logger.warn('Failed to fetch B2B role via RPC', error.message);
      
      // Fallback: requête directe
      const { data: roles, error: rolesError } = await supabase
        .from('b2b_user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('org_id', orgId)
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('granted_at', { ascending: false })
        .limit(1);

      if (rolesError || !roles || roles.length === 0) {
        return null;
      }

      return roles[0].role as B2BRole;
    }

    return data as B2BRole | null;
  } catch (error) {
    logger.error('Error fetching B2B role', error as Error, 'B2B');
    return null;
  }
}

export function useB2BRole(customOrgId?: string): UseB2BRoleReturn {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const userId = user?.id;
  const orgId = customOrgId || (user?.user_metadata?.org_id as string | undefined);

  const query = useQuery({
    queryKey: ['b2b-role', userId, orgId],
    queryFn: () => fetchUserRole(userId!, orgId!),
    enabled: !!userId && !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  const role = query.data ?? null;

  const hasRole = (checkRole: B2BRole): boolean => {
    if (!role) return false;
    const currentIndex = ROLE_HIERARCHY.indexOf(role);
    const checkIndex = ROLE_HIERARCHY.indexOf(checkRole);
    return currentIndex <= checkIndex; // Lower index = higher privilege
  };

  const isAdmin = role === 'b2b_admin';
  const isManager = hasRole('b2b_manager');
  const isMember = hasRole('b2b_member');
  const isViewer = hasRole('b2b_viewer');

  // Permissions basées sur le rôle
  const canManageTeams = isAdmin || isManager;
  const canViewReports = isAdmin || isManager || isMember;
  const canManageMembers = isAdmin;

  // Mutation pour attribuer un rôle
  const grantMutation = useMutation({
    mutationFn: async ({ targetUserId, targetRole }: { targetUserId: string; targetRole: B2BRole }) => {
      if (!userId || !orgId) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('b2b_user_roles')
        .insert({
          user_id: targetUserId,
          org_id: orgId,
          role: targetRole,
          granted_by: userId,
        });

      if (error) throw error;

      // Log audit
      await supabase.from('b2b_audit_logs').insert({
        org_id: orgId,
        action: 'role_granted',
        entity_type: 'role',
        entity_id: targetUserId,
        user_id: userId,
        user_email: user?.email,
        details: { role: targetRole }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-role'] });
      toast({ title: 'Rôle attribué', description: 'Le rôle a été attribué avec succès' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: 'Impossible d\'attribuer le rôle', variant: 'destructive' });
      logger.error('Grant role error', error as Error, 'B2B');
    }
  });

  // Mutation pour révoquer un rôle
  const revokeMutation = useMutation({
    mutationFn: async ({ targetUserId, targetRole }: { targetUserId: string; targetRole: B2BRole }) => {
      if (!userId || !orgId) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('b2b_user_roles')
        .delete()
        .eq('user_id', targetUserId)
        .eq('org_id', orgId)
        .eq('role', targetRole);

      if (error) throw error;

      // Log audit
      await supabase.from('b2b_audit_logs').insert({
        org_id: orgId,
        action: 'role_revoked',
        entity_type: 'role',
        entity_id: targetUserId,
        user_id: userId,
        user_email: user?.email,
        details: { role: targetRole }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-role'] });
      toast({ title: 'Rôle révoqué', description: 'Le rôle a été révoqué' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: 'Impossible de révoquer le rôle', variant: 'destructive' });
      logger.error('Revoke role error', error as Error, 'B2B');
    }
  });

  return {
    role,
    isAdmin,
    isManager,
    isMember,
    isViewer,
    hasRole,
    canManageTeams,
    canViewReports,
    canManageMembers,
    loading: query.isLoading,
    error: query.error,
    grantRole: (targetUserId: string, targetRole: B2BRole) => 
      grantMutation.mutate({ targetUserId, targetRole }),
    revokeRole: (targetUserId: string, targetRole: B2BRole) => 
      revokeMutation.mutate({ targetUserId, targetRole }),
    isUpdating: grantMutation.isPending || revokeMutation.isPending,
  };
}

// Hook simplifié pour vérification rapide
export function useIsB2BAdmin(orgId?: string): boolean {
  const { isAdmin } = useB2BRole(orgId);
  return isAdmin;
}

export function useCanAccessB2B(orgId?: string): boolean {
  const { isViewer } = useB2BRole(orgId);
  return isViewer; // isViewer = has any role
}
