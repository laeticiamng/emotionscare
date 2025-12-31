/**
 * Hook pour gérer les rappels de sessions
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { differenceInMinutes, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { GroupSession } from '../types';

interface SessionReminder {
  id: string;
  session: GroupSession;
  minutesBefore: number;
  notified: boolean;
}

export function useSessionReminders() {
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState<GroupSession[]>([]);
  const [reminders, setReminders] = useState<SessionReminder[]>([]);

  // Charger les sessions à venir de l'utilisateur
  const loadUpcomingSessions = useCallback(async () => {
    if (!user) return;

    try {
      // Récupérer les inscriptions de l'utilisateur
      const { data: participations, error: pError } = await supabase
        .from('group_session_participants')
        .select('session_id')
        .eq('user_id', user.id)
        .eq('status', 'registered');

      if (pError) throw pError;
      if (!participations || participations.length === 0) return;

      const sessionIds = participations.map(p => p.session_id);

      // Récupérer les sessions à venir
      const { data: sessions, error: sError } = await supabase
        .from('group_sessions')
        .select('*')
        .in('id', sessionIds)
        .in('status', ['scheduled', 'live'])
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(10);

      if (sError) throw sError;
      setUpcomingSessions((sessions || []) as GroupSession[]);

      // Créer les rappels
      const newReminders: SessionReminder[] = (sessions || []).map((session: any) => ({
        id: session.id,
        session: session as GroupSession,
        minutesBefore: differenceInMinutes(new Date(session.scheduled_at), new Date()),
        notified: false,
      }));

      setReminders(newReminders);
    } catch (err) {
      console.error('Error loading upcoming sessions:', err);
    }
  }, [user]);

  // Vérifier les rappels à afficher
  const checkReminders = useCallback(() => {
    const now = new Date();
    
    reminders.forEach(reminder => {
      if (reminder.notified) return;

      const sessionDate = new Date(reminder.session.scheduled_at);
      const minutesUntil = differenceInMinutes(sessionDate, now);

      // Rappel 15 minutes avant
      if (minutesUntil <= 15 && minutesUntil > 10 && !reminder.notified) {
        toast.info(
          `Session "${reminder.session.title}" dans 15 minutes !`,
          {
            description: format(sessionDate, 'HH:mm', { locale: fr }),
            duration: 10000,
            action: {
              label: 'Voir',
              onClick: () => window.location.href = '/app/group-sessions',
            },
          }
        );
        setReminders(prev => 
          prev.map(r => r.id === reminder.id ? { ...r, notified: true } : r)
        );
      }

      // Rappel 5 minutes avant
      if (minutesUntil <= 5 && minutesUntil > 0 && !reminder.notified) {
        toast.warning(
          `Session "${reminder.session.title}" commence bientôt !`,
          {
            description: 'Préparez-vous à rejoindre',
            duration: 15000,
            action: {
              label: 'Rejoindre',
              onClick: () => window.location.href = '/app/group-sessions',
            },
          }
        );
        setReminders(prev =>
          prev.map(r => r.id === reminder.id ? { ...r, notified: true } : r)
        );
      }
    });
  }, [reminders]);

  // Charger au montage
  useEffect(() => {
    loadUpcomingSessions();
  }, [loadUpcomingSessions]);

  // Vérifier les rappels toutes les minutes
  useEffect(() => {
    const interval = setInterval(checkReminders, 60000);
    checkReminders(); // Vérifier immédiatement
    return () => clearInterval(interval);
  }, [checkReminders]);

  return {
    upcomingSessions,
    reminders,
    refresh: loadUpcomingSessions,
  };
}

export default useSessionReminders;
