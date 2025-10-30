// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckinDate: Date;
  totalCheckins: number;
  streakFrozenUntil?: Date;
}

/**
 * Hook pour gérer le streak de bien-être
 * Encourage l'habitude quotidienne sans punition excessive
 */
export const useWellnessStreak = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le streak
  const loadStreak = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_wellness_streak')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setStreak({
          currentStreak: data.current_streak,
          longestStreak: data.longest_streak,
          lastCheckinDate: new Date(data.last_checkin_date),
          totalCheckins: data.total_checkins,
          streakFrozenUntil: data.streak_frozen_until ? new Date(data.streak_frozen_until) : undefined
        });
      }
    } catch (err) {
      console.error('Error loading streak:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Check-in quotidien
  const checkin = useCallback(async () => {
    if (!user) return { success: false, newStreak: 0, broken: false };

    try {
      // Appeler la fonction Supabase qui gère la logique du streak
      const { data, error } = await supabase.rpc('check_wellness_streak', {
        p_user_id: user.id
      });

      if (error) throw error;

      const result = data[0];
      await loadStreak();

      if (result.streak_broken) {
        toast({
          title: '💔 Série interrompue',
          description: 'Pas de souci ! On repart sur une nouvelle série. Tu peux le faire ! 💪',
          variant: 'default'
        });
      } else if (result.current_streak > 1) {
        toast({
          title: `🔥 ${result.current_streak} jours d'affilée !`,
          description: 'Continue comme ça, tu prends soin de tes émotions ! 💜',
          variant: 'success'
        });
      }

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'wellness_checkin', {
          streak: result.current_streak,
          broken: result.streak_broken
        });
      }

      return {
        success: true,
        newStreak: result.current_streak,
        broken: result.streak_broken
      };
    } catch (err) {
      console.error('Error checking in:', err);
      return { success: false, newStreak: 0, broken: false };
    }
  }, [user, loadStreak]);

  // Freeze streak (récompense premium)
  const freezeStreak = useCallback(async (hours: number = 48) => {
    if (!user || !streak) return false;

    try {
      const freezeUntil = new Date(Date.now() + hours * 60 * 60 * 1000);

      const { error } = await supabase
        .from('user_wellness_streak')
        .update({
          streak_frozen_until: freezeUntil.toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setStreak({
        ...streak,
        streakFrozenUntil: freezeUntil
      });

      toast({
        title: '❄️ Série protégée !',
        description: `Ta série est protégée pendant ${hours}h. Prends ton temps ! 💜`,
        variant: 'success'
      });

      return true;
    } catch (err) {
      console.error('Error freezing streak:', err);
      return false;
    }
  }, [user, streak]);

  // Charger au démarrage
  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  return {
    streak,
    isLoading,
    hasCheckedInToday: streak ? new Date(streak.lastCheckinDate).toDateString() === new Date().toDateString() : false,
    isFrozen: streak?.streakFrozenUntil ? new Date() < streak.streakFrozenUntil : false,
    checkin,
    freezeStreak,
    refreshStreak: loadStreak
  };
};
