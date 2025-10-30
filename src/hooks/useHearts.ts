// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MAX_HEARTS = 5;
const REFILL_TIME_MS = 30 * 60 * 1000; // 30 minutes

interface HeartsData {
  hearts: number;
  lastRefillTime: number;
  nextRefillTime: number;
}

/**
 * Hook pour gérer le système de vies (hearts) comme Duolingo
 * - 5 vies maximum
 * - Régénération automatique : 1 vie toutes les 30 minutes
 * - Perte de vie en cas d'échec
 */
export const useHearts = () => {
  const { user } = useAuth();
  const [hearts, setHearts] = useState<number>(MAX_HEARTS);
  const [nextRefillTime, setNextRefillTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données depuis localStorage et Supabase
  const loadHearts = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Essayer de charger depuis Supabase en premier
      const { data, error } = await supabase
        .from('user_hearts')
        .select('hearts, last_refill_time')
        .eq('user_id', user.id)
        .single();

      let currentHearts = MAX_HEARTS;
      let lastRefill = Date.now();

      if (data && !error) {
        currentHearts = data.hearts;
        lastRefill = new Date(data.last_refill_time).getTime();
      } else {
        // Fallback sur localStorage
        const stored = localStorage.getItem('ec_hearts');
        if (stored) {
          const parsed = JSON.parse(stored) as HeartsData;
          currentHearts = parsed.hearts;
          lastRefill = parsed.lastRefillTime;
        }
      }

      // Calculer les vies régénérées
      const now = Date.now();
      const timePassed = now - lastRefill;
      const heartsToAdd = Math.floor(timePassed / REFILL_TIME_MS);

      if (heartsToAdd > 0 && currentHearts < MAX_HEARTS) {
        currentHearts = Math.min(MAX_HEARTS, currentHearts + heartsToAdd);
        lastRefill = now - (timePassed % REFILL_TIME_MS);
        await saveHearts(currentHearts, lastRefill);
      }

      setHearts(currentHearts);
      
      // Calculer le prochain refill
      if (currentHearts < MAX_HEARTS) {
        setNextRefillTime(lastRefill + REFILL_TIME_MS);
      } else {
        setNextRefillTime(0);
      }
    } catch (err) {
      console.error('Error loading hearts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Sauvegarder les vies
  const saveHearts = async (newHearts: number, lastRefill: number = Date.now()) => {
    const heartsData: HeartsData = {
      hearts: newHearts,
      lastRefillTime: lastRefill,
      nextRefillTime: lastRefill + REFILL_TIME_MS
    };

    // Sauvegarder en localStorage
    localStorage.setItem('ec_hearts', JSON.stringify(heartsData));

    // Sauvegarder en Supabase si connecté
    if (user) {
      await supabase
        .from('user_hearts')
        .upsert({
          user_id: user.id,
          hearts: newHearts,
          last_refill_time: new Date(lastRefill).toISOString(),
          updated_at: new Date().toISOString()
        });
    }
  };

  // Perdre une vie
  const loseHeart = useCallback(async () => {
    if (hearts <= 0) return false;

    const newHearts = hearts - 1;
    setHearts(newHearts);
    
    const now = Date.now();
    await saveHearts(newHearts, now);
    
    if (newHearts < MAX_HEARTS) {
      setNextRefillTime(now + REFILL_TIME_MS);
    }

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'heart_lost', {
        remaining_hearts: newHearts
      });
    }

    return true;
  }, [hearts, user]);

  // Gagner une vie (récompense)
  const gainHeart = useCallback(async () => {
    if (hearts >= MAX_HEARTS) return false;

    const newHearts = Math.min(MAX_HEARTS, hearts + 1);
    setHearts(newHearts);
    await saveHearts(newHearts);

    if (newHearts < MAX_HEARTS) {
      setNextRefillTime(Date.now() + REFILL_TIME_MS);
    } else {
      setNextRefillTime(0);
    }

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'heart_gained', {
        total_hearts: newHearts
      });
    }

    return true;
  }, [hearts, user]);

  // Refill complet (récompense premium)
  const refillHearts = useCallback(async () => {
    setHearts(MAX_HEARTS);
    setNextRefillTime(0);
    await saveHearts(MAX_HEARTS);

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'hearts_refilled');
    }
  }, [user]);

  // Temps restant avant prochaine vie
  const getTimeUntilNextHeart = useCallback(() => {
    if (hearts >= MAX_HEARTS) return 0;
    if (nextRefillTime === 0) return 0;
    
    const remaining = Math.max(0, nextRefillTime - Date.now());
    return remaining;
  }, [hearts, nextRefillTime]);

  // Charger les vies au démarrage
  useEffect(() => {
    loadHearts();
  }, [loadHearts]);

  // Vérifier périodiquement la régénération
  useEffect(() => {
    if (hearts >= MAX_HEARTS) return;

    const interval = setInterval(() => {
      const timeUntil = getTimeUntilNextHeart();
      if (timeUntil <= 0) {
        loadHearts();
      }
    }, 10000); // Vérifier toutes les 10 secondes

    return () => clearInterval(interval);
  }, [hearts, getTimeUntilNextHeart, loadHearts]);

  return {
    hearts,
    maxHearts: MAX_HEARTS,
    hasHearts: hearts > 0,
    isFull: hearts >= MAX_HEARTS,
    isLoading,
    loseHeart,
    gainHeart,
    refillHearts,
    getTimeUntilNextHeart,
    refillTimeMs: REFILL_TIME_MS
  };
};
