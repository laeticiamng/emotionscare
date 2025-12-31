/**
 * Hook pour les données des équipes B2B
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface B2BTeam {
  id: string;
  name: string;
  members: number;
  lead: string;
  email: string;
  avgWellness: number;
  status: 'active' | 'needs-attention';
  lastActivity: string;
}

export interface B2BTeamsData {
  teams: B2BTeam[];
  totalMembers: number;
  avgWellness: number;
  activeTeams: number;
}

const DEFAULT_DATA: B2BTeamsData = {
  teams: [],
  totalMembers: 0,
  avgWellness: 0,
  activeTeams: 0,
};

async function fetchTeams(orgId: string): Promise<B2BTeamsData> {
  try {
    // Pour l'instant, données simulées car pas de table teams
    // À remplacer par vraie requête Supabase quand table créée
    const teams: B2BTeam[] = [
      {
        id: '1',
        name: 'Équipe Marketing',
        members: 12,
        lead: 'Sarah Martin',
        email: 'sarah.martin@company.com',
        avgWellness: 78,
        status: 'active',
        lastActivity: new Date().toISOString().split('T')[0],
      },
      {
        id: '2',
        name: 'Équipe Développement',
        members: 8,
        lead: 'Thomas Dubois',
        email: 'thomas.dubois@company.com',
        avgWellness: 85,
        status: 'active',
        lastActivity: new Date().toISOString().split('T')[0],
      },
      {
        id: '3',
        name: 'Équipe Support',
        members: 6,
        lead: 'Marie Leroy',
        email: 'marie.leroy@company.com',
        avgWellness: 72,
        status: 'needs-attention',
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ];

    const totalMembers = teams.reduce((sum, t) => sum + t.members, 0);
    const avgWellness = Math.round(teams.reduce((sum, t) => sum + t.avgWellness, 0) / teams.length);
    const activeTeams = teams.filter(t => t.status === 'active').length;

    return { teams, totalMembers, avgWellness, activeTeams };
  } catch (error) {
    logger.error('Error fetching teams', error as Error, 'B2B');
    return DEFAULT_DATA;
  }
}

export function useB2BTeams() {
  const { user } = useAuth();
  const orgId = user?.user_metadata?.org_id as string | undefined;

  const query = useQuery({
    queryKey: ['b2b-teams', orgId],
    queryFn: () => fetchTeams(orgId!),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data || DEFAULT_DATA,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
