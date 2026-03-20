import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface EmotionalEnergyData {
  currentEnergy: number;
  maxEnergy: number;
  lastRefillTime: Date;
  totalGained: number;
  totalSpent: number;
}

/**
 * Hook pour gérer l'énergie émotionnelle (remplace les "vies")
 * - Max 10 points d'énergie
 * - Recharge automatique: 1 point toutes les 4h
 * - Encouragement au lieu de punition
 */
export const useEmotionalEnergy = () => {
  const { user } = useAuth();
  const [energy, setEnergy] = useState<EmotionalEnergyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeUntilRefill, setTimeUntilRefill] = useState(0);

  // Charger l'énergie depuis Supabase
  const loadEnergy = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_emotional_energy')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setEnergy({
          currentEnergy: data.current_energy,
          maxEnergy: data.max_energy,
          lastRefillTime: new Date(data.last_refill_time),
          totalGained: data.total_energy_gained,
          totalSpent: data.total_energy_spent
        });
      } else {
        // Créer l'entrée initiale
        const { data: newData, error: insertError } = await supabase
          .from('user_emotional_energy')
          .insert({
            user_id: user.id,
            current_energy: 5,
            max_energy: 10
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setEnergy({
          currentEnergy: newData.current_energy,
          maxEnergy: newData.max_energy,
          lastRefillTime: new Date(newData.last_refill_time),
          totalGained: 0,
          totalSpent: 0
        });
      }
    } catch (err) {
      logger.error('Error loading emotional energy:', err, 'HOOK');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Dépenser de l'énergie
  const spendEnergy = useCallback(async (amount: number, reason: string) => {
    if (!user || !energy || energy.currentEnergy < amount) {
      return false;
    }

    try {
      const newEnergy = energy.currentEnergy - amount;

      const { error } = await supabase
        .from('user_emotional_energy')
        .update({
          current_energy: newEnergy,
          total_energy_spent: energy.totalSpent + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log transaction
      await supabase.from('energy_transactions').insert({
        user_id: user.id,
        transaction_type: 'energy_spend',
        amount: -amount,
        reason
      });

      setEnergy({
        ...energy,
        currentEnergy: newEnergy,
        totalSpent: energy.totalSpent + amount
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'energy_spent', {
          amount,
          reason,
          remaining: newEnergy
        });
      }

      return true;
    } catch (err) {
      logger.error('Error spending energy:', err, 'HOOK');
      return false;
    }
  }, [user, energy]);

  // Gagner de l'énergie
  const gainEnergy = useCallback(async (amount: number, reason: string) => {
    if (!user || !energy) return false;

    try {
      const newEnergy = Math.min(energy.maxEnergy, energy.currentEnergy + amount);

      const { error } = await supabase
        .from('user_emotional_energy')
        .update({
          current_energy: newEnergy,
          total_energy_gained: energy.totalGained + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log transaction
      await supabase.from('energy_transactions').insert({
        user_id: user.id,
        transaction_type: 'energy_gain',
        amount,
        reason
      });

      setEnergy({
        ...energy,
        currentEnergy: newEnergy,
        totalGained: energy.totalGained + amount
      });

      // Toast encourageant
      toast({
        title: '✨ Énergie restaurée !',
        description: `+${amount} point${amount > 1 ? 's' : ''} d'énergie émotionnelle`,
        variant: 'success'
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'energy_gained', {
          amount,
          reason,
          total: newEnergy
        });
      }

      return true;
    } catch (err) {
      logger.error('Error gaining energy:', err, 'HOOK');
      return false;
    }
  }, [user, energy]);

  // Recharge complète (récompense premium)
  const refillEnergy = useCallback(async () => {
    if (!user || !energy) return;

    try {
      const { error } = await supabase
        .from('user_emotional_energy')
        .update({
          current_energy: energy.maxEnergy,
          last_refill_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setEnergy({
        ...energy,
        currentEnergy: energy.maxEnergy,
        lastRefillTime: new Date()
      });

      toast({
        title: '💜 Recharge complète !',
        description: 'Votre énergie émotionnelle est au maximum',
        variant: 'success'
      });

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'energy_refilled');
      }
    } catch (err) {
      logger.error('Error refilling energy:', err, 'HOOK');
    }
  }, [user, energy]);

  // Calculer le temps avant la prochaine recharge
  useEffect(() => {
    if (!energy || energy.currentEnergy >= energy.maxEnergy) {
      setTimeUntilRefill(0);
      return;
    }

    const calculateTime = () => {
      const fourHoursMs = 4 * 60 * 60 * 1000;
      const timeSinceLastRefill = Date.now() - energy.lastRefillTime.getTime();
      const timeUntilNext = fourHoursMs - (timeSinceLastRefill % fourHoursMs);
      setTimeUntilRefill(timeUntilNext);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [energy]);

  // Charger l'énergie au démarrage
  useEffect(() => {
    loadEnergy();
  }, [loadEnergy]);

  // Vérifier la recharge automatique
  useEffect(() => {
    if (!energy || energy.currentEnergy >= energy.maxEnergy) return;

    const interval = setInterval(() => {
      loadEnergy();
    }, 60000); // Check toutes les minutes

    return () => clearInterval(interval);
  }, [energy, loadEnergy]);

  return {
    energy,
    isLoading,
    hasEnergy: (amount: number = 1) => energy ? energy.currentEnergy >= amount : false,
    isFull: energy ? energy.currentEnergy >= energy.maxEnergy : false,
    isLow: energy ? energy.currentEnergy <= 2 : false,
    timeUntilRefill,
    spendEnergy,
    gainEnergy,
    refillEnergy,
    refreshEnergy: loadEnergy
  };
};
