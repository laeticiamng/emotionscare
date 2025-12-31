/**
 * Hook pour les événements B2B
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
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
    const events: B2BEvent[] = [
      {
        id: '1',
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
        id: '2',
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
        id: '3',
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

    const upcomingCount = events.filter(e => e.status === 'upcoming').length;
    const totalParticipants = events.reduce((sum, e) => sum + e.participants, 0);

    return {
      events,
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
  });

  return {
    data: query.data || DEFAULT_DATA,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
