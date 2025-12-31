/**
 * Hook pour gérer les activités partagées entre buddies
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BuddyService } from '../services/buddyService';
import type { BuddyActivity } from '../types';
import { toast } from 'sonner';

export function useBuddyActivities(matchId: string) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<BuddyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadActivities = useCallback(async () => {
    if (!matchId) return;

    setLoading(true);
    try {
      const data = await BuddyService.getActivities(matchId);
      setActivities(data);
    } catch (err) {
      console.error('Error loading activities:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const createActivity = useCallback(async (activity: Partial<BuddyActivity>) => {
    if (!user || !matchId) return null;

    setCreating(true);
    try {
      const created = await BuddyService.createActivity(matchId, user.id, activity);
      setActivities(prev => [...prev, created]);
      toast.success('Activité créée !');
      return created;
    } catch (err) {
      console.error('Error creating activity:', err);
      toast.error('Erreur lors de la création');
      return null;
    } finally {
      setCreating(false);
    }
  }, [user, matchId]);

  const completeActivity = useCallback(async (
    activityId: string, 
    moodAfter?: Record<string, number>, 
    notes?: string
  ) => {
    try {
      await BuddyService.completeActivity(activityId, moodAfter, notes);
      setActivities(prev => 
        prev.map(a => a.id === activityId 
          ? { ...a, status: 'completed' as const, completed_at: new Date().toISOString(), participants_mood_after: moodAfter }
          : a
        )
      );
      toast.success('Activité complétée ! +XP');
      return true;
    } catch (err) {
      console.error('Error completing activity:', err);
      toast.error('Erreur');
      return false;
    }
  }, []);

  const startActivity = useCallback(async (activityId: string, moodBefore?: Record<string, number>) => {
    try {
      // Mise à jour locale
      setActivities(prev => 
        prev.map(a => a.id === activityId 
          ? { ...a, status: 'in_progress' as const, participants_mood_before: moodBefore }
          : a
        )
      );
      toast.info('Activité démarrée !');
      return true;
    } catch (err) {
      console.error('Error starting activity:', err);
      return false;
    }
  }, []);

  const cancelActivity = useCallback(async (activityId: string) => {
    try {
      setActivities(prev => 
        prev.map(a => a.id === activityId 
          ? { ...a, status: 'cancelled' as const }
          : a
        )
      );
      toast.info('Activité annulée');
      return true;
    } catch (err) {
      console.error('Error cancelling activity:', err);
      return false;
    }
  }, []);

  // Stats dérivées
  const upcomingActivities = activities.filter(a => a.status === 'planned');
  const inProgressActivities = activities.filter(a => a.status === 'in_progress');
  const completedActivities = activities.filter(a => a.status === 'completed');
  const totalXpEarned = completedActivities.reduce((sum, a) => sum + (a.xp_reward || 0), 0);

  return {
    activities,
    upcomingActivities,
    inProgressActivities,
    completedActivities,
    totalXpEarned,
    loading,
    creating,
    loadActivities,
    createActivity,
    startActivity,
    completeActivity,
    cancelActivity
  };
}
