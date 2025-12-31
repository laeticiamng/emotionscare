/**
 * useB2BInvitations - Gestion des invitations B2B
 * Créer, envoyer, suivre et révoquer les invitations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface B2BInvitation {
  id: string;
  email: string;
  role: 'user_b2b' | 'manager_b2b';
  team?: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
  invitedBy: string;
}

export interface InvitationStats {
  total: number;
  pending: number;
  accepted: number;
  expired: number;
}

export interface B2BInvitationsData {
  invitations: B2BInvitation[];
  stats: InvitationStats;
}

const DEFAULT_DATA: B2BInvitationsData = {
  invitations: [],
  stats: { total: 0, pending: 0, accepted: 0, expired: 0 },
};

async function fetchInvitations(orgId: string): Promise<B2BInvitationsData> {
  try {
    const { data, error } = await supabase
      .from('org_invitations')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.warn('[B2BInvitations] Fetch error', { error: error.message });
      return DEFAULT_DATA;
    }

    const now = new Date();
    const invitations: B2BInvitation[] = (data || []).map((inv: any) => {
      let status = inv.status;
      const expiresAt = new Date(inv.expires_at);
      if (status === 'pending' && expiresAt < now) {
        status = 'expired';
      }

      return {
        id: inv.id,
        email: inv.email,
        role: inv.role || 'user_b2b',
        team: inv.team_id,
        status,
        expiresAt: inv.expires_at,
        createdAt: inv.created_at,
        acceptedAt: inv.accepted_at,
        invitedBy: inv.invited_by,
      };
    });

    const stats: InvitationStats = {
      total: invitations.length,
      pending: invitations.filter(i => i.status === 'pending').length,
      accepted: invitations.filter(i => i.status === 'accepted').length,
      expired: invitations.filter(i => i.status === 'expired').length,
    };

    return { invitations, stats };
  } catch (error) {
    logger.error('[B2BInvitations] Fetch failed', error as Error, 'B2B');
    return DEFAULT_DATA;
  }
}

interface CreateInvitationParams {
  email: string;
  role: 'user_b2b' | 'manager_b2b';
  teamId?: string;
}

async function createInvitation(orgId: string, userId: string, params: CreateInvitationParams): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error } = await supabase.from('org_invitations').insert({
    org_id: orgId,
    email: params.email.toLowerCase().trim(),
    role: params.role,
    team_id: params.teamId,
    status: 'pending',
    expires_at: expiresAt.toISOString(),
    invited_by: userId,
  });

  if (error) throw error;
}

async function revokeInvitation(invitationId: string): Promise<void> {
  const { error } = await supabase
    .from('org_invitations')
    .update({ status: 'revoked' })
    .eq('id', invitationId);

  if (error) throw error;
}

async function resendInvitation(invitationId: string): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error } = await supabase
    .from('org_invitations')
    .update({
      status: 'pending',
      expires_at: expiresAt.toISOString(),
    })
    .eq('id', invitationId);

  if (error) throw error;
}

export function useB2BInvitations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const orgId = user?.user_metadata?.org_id as string | undefined;

  const query = useQuery({
    queryKey: ['b2b-invitations', orgId],
    queryFn: () => fetchInvitations(orgId!),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const createMutation = useMutation({
    mutationFn: (params: CreateInvitationParams) => createInvitation(orgId!, user!.id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-invitations', orgId] });
      toast.success('Invitation envoyée');
    },
    onError: () => {
      toast.error("Erreur lors de l'envoi de l'invitation");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: revokeInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-invitations', orgId] });
      toast.success('Invitation révoquée');
    },
    onError: () => {
      toast.error('Erreur lors de la révocation');
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-invitations', orgId] });
      toast.success('Invitation renvoyée');
    },
    onError: () => {
      toast.error("Erreur lors du renvoi de l'invitation");
    },
  });

  return {
    data: query.data || DEFAULT_DATA,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createInvitation: createMutation.mutate,
    isCreating: createMutation.isPending,
    revokeInvitation: revokeMutation.mutate,
    resendInvitation: resendMutation.mutate,
  };
}

export default useB2BInvitations;
