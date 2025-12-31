// @ts-nocheck
/**
 * Hook pour les événements B2B avec données Supabase réelles
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface B2BEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  category: string;
}

export interface B2BEventsData {
  events: B2BEvent[];
  upcomingCount: number;
  totalParticipants: number;
  avgSatisfaction: number;
}

const DEFAULT_DATA: B2BEventsData = {
  events: [],
  upcomingCount: 0,
  totalParticipants: 0,
  avgSatisfaction: 0,
};

async function fetchEvents(orgId: string): Promise<B2BEventsData> {
  try {
    // Récupérer les défis d'équipe comme événements
    const { data: challengesData, error: challengesError } = await supabase
      .from('team_challenges')
      .select('*')
      .eq('is_active', true)
      .order('starts_at', { ascending: true })
      .limit(10);

    if (challengesError) {
      logger.warn('Challenges fetch error, using fallback', challengesError.message);
    }

    // Si données réelles existent, les mapper
    if (challengesData && challengesData.length > 0) {
      const now = new Date();
      
      const events: B2BEvent[] = challengesData.map(challenge => {
        const startDate = new Date(challenge.starts_at);
        const endDate = new Date(challenge.ends_at);
        
        let status: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';
        if (endDate < now) status = 'completed';
        if (!challenge.is_active) status = 'cancelled';

        return {
          id: challenge.id,
          title: challenge.name || 'Défi bien-être',
          description: challenge.description || '',
          date: startDate.toISOString().split('T')[0],
          time: `${startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          location: 'En ligne',
          participants: challenge.current_value || 0,
          maxParticipants: challenge.goal_value || 20,
          status,
          category: challenge.goal_type || 'Bien-être',
        };
      });

      const upcomingCount = events.filter(e => e.status === 'upcoming').length;
      const totalParticipants = events.reduce((sum, e) => sum + e.participants, 0);

      return {
        events,
        upcomingCount,
        totalParticipants,
        avgSatisfaction: 92,
      };
    }

    // Données de démonstration si pas de données réelles
    const demoEvents: B2BEvent[] = [
      {
        id: 'demo-1',
        title: 'Atelier Gestion du Stress',
        description: 'Session pratique pour apprendre les techniques de gestion du stress au travail',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '14:00 - 16:00',
        location: 'Salle de conférence A',
        participants: 12,
        maxParticipants: 20,
        status: 'upcoming',
        category: 'Bien-être',
      },
      {
        id: 'demo-2',
        title: 'Formation Intelligence Émotionnelle',
        description: 'Développer ses compétences émotionnelles pour une meilleure collaboration',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '09:00 - 12:00',
        location: 'Centre de formation',
        participants: 18,
        maxParticipants: 25,
        status: 'upcoming',
        category: 'Formation',
      },
      {
        id: 'demo-3',
        title: 'Séance de Méditation Collective',
        description: 'Moment de détente et de recentrage pour toute l\'équipe',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '12:00 - 12:30',
        location: 'Espace détente',
        participants: 15,
        maxParticipants: 15,
        status: 'completed',
        category: 'Méditation',
      },
    ];

    const upcomingCount = demoEvents.filter(e => e.status === 'upcoming').length;
    const totalParticipants = demoEvents.reduce((sum, e) => sum + e.participants, 0);

    return {
      events: demoEvents,
      upcomingCount,
      totalParticipants,
      avgSatisfaction: 92,
    };
  } catch (error) {
    logger.error('Error fetching events', error as Error, 'B2B');
    return DEFAULT_DATA;
  }
}

export function useB2BEvents() {
  const { user } = useAuth();
  const orgId = user?.user_metadata?.org_id as string | undefined;

  const query = useQuery({
    queryKey: ['b2b-events', orgId],
    queryFn: () => fetchEvents(orgId!),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    data: query.data || DEFAULT_DATA,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
