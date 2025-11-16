// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface HarmonyPointsData {
  totalPoints: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

/**
 * Hook pour gérer les Points Harmonie (monnaie interne)
 */
export const useHarmonyPoints = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState<HarmonyPointsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les points
  const loadPoints = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_harmony_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPoints({
          totalPoints: data.total_points,
          lifetimeEarned: data.lifetime_earned,
          lifetimeSpent: data.lifetime_spent
        });
      } else {
        // Créer l'entrée initiale
        const { data: newData, error: insertError } = await supabase
          .from('user_harmony_points')
          .insert({
            user_id: user.id,
            total_points: 0,
            lifetime_earned: 0,
            lifetime_spent: 0
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setPoints({
          totalPoints: 0,
          lifetimeEarned: 0,
          lifetimeSpent: 0
        });
      }
    } catch (err) {
      logger.error('Error loading harmony points:', err, 'HOOK');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Gagner des points
  const earnPoints = useCallback(async (amount: number, reason: string) => {
    if (!user || !points) return false;

    try {
      const newTotal = points.totalPoints + amount;

      const { error } = await supabase
        .from('user_harmony_points')
        .update({
          total_points: newTotal,
          lifetime_earned: points.lifetimeEarned + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log transaction
      await supabase.from('energy_transactions').insert({
        user_id: user.id,
        transaction_type: 'harmony_gain',
        amount,
        reason
      });

      setPoints({
        ...points,
        totalPoints: newTotal,
        lifetimeEarned: points.lifetimeEarned + amount
      });

      toast({
        title: '✨ Points Harmonie gagnés !',
        description: `+${amount} points • ${reason}`,
        variant: 'success'
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'harmony_points_earned', {
          amount,
          reason,
          total: newTotal
        });
      }

      return true;
    } catch (err) {
      logger.error('Error earning points:', err, 'HOOK');
      return false;
    }
  }, [user, points]);

  // Dépenser des points
  const spendPoints = useCallback(async (amount: number, reason: string) => {
    if (!user || !points || points.totalPoints < amount) {
      toast({
        title: 'Points insuffisants',
        description: `Il te faut ${amount - (points?.totalPoints || 0)} points de plus`,
        variant: 'destructive'
      });
      return false;
    }

    try {
      const newTotal = points.totalPoints - amount;

      const { error } = await supabase
        .from('user_harmony_points')
        .update({
          total_points: newTotal,
          lifetime_spent: points.lifetimeSpent + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log transaction
      await supabase.from('energy_transactions').insert({
        user_id: user.id,
        transaction_type: 'harmony_spend',
        amount: -amount,
        reason
      });

      setPoints({
        ...points,
        totalPoints: newTotal,
        lifetimeSpent: points.lifetimeSpent + amount
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'harmony_points_spent', {
          amount,
          reason,
          remaining: newTotal
        });
      }

      return true;
    } catch (err) {
      logger.error('Error spending points:', err, 'HOOK');
      return false;
    }
  }, [user, points]);

  // Charger au démarrage
  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  return {
    points,
    isLoading,
    hasPoints: (amount: number) => points ? points.totalPoints >= amount : false,
    earnPoints,
    spendPoints,
    refreshPoints: loadPoints
  };
};
