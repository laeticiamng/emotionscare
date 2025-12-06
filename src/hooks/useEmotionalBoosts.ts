// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEmotionalEnergy } from './useEmotionalEnergy';
import { logger } from '@/lib/logger';

interface EmotionalBoost {
  id: string;
  name: string;
  description: string;
  boostType: 'breathing' | 'music' | 'reassurance' | 'meditation' | 'movement';
  durationMinutes: number;
  energyRestore: number;
  icon: string;
  content?: any;
}

/**
 * Hook pour gérer les boosts émotionnels
 * Mini-exercices pour recharger l'énergie quand elle est basse
 */
export const useEmotionalBoosts = () => {
  const { gainEnergy } = useEmotionalEnergy();
  const [boosts, setBoosts] = useState<EmotionalBoost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBoost, setActiveBoost] = useState<EmotionalBoost | null>(null);

  // Charger les boosts disponibles
  const loadBoosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('emotional_boosts')
        .select('*')
        .eq('active', true);

      if (error) throw error;

      setBoosts(data.map(b => ({
        id: b.id,
        name: b.name,
        description: b.description,
        boostType: b.boost_type,
        durationMinutes: b.duration_minutes,
        energyRestore: b.energy_restore,
        icon: b.icon || '✨',
        content: b.content
      })));
    } catch (err) {
      logger.error('Error loading boosts:', err, 'HOOK');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Utiliser un boost
  const useBoost = useCallback(async (boostId: string) => {
    const boost = boosts.find(b => b.id === boostId);
    if (!boost) return false;

    setActiveBoost(boost);

    // Simuler la durée du boost
    await new Promise(resolve => setTimeout(resolve, boost.durationMinutes * 60 * 1000));

    // Donner l'énergie
    await gainEnergy(boost.energyRestore, `Boost: ${boost.name}`);

    setActiveBoost(null);

    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'emotional_boost_used', {
        boost_type: boost.boostType,
        boost_name: boost.name
      });
    }

    return true;
  }, [boosts, gainEnergy]);

  // Charger au démarrage
  useEffect(() => {
    loadBoosts();
  }, [loadBoosts]);

  return {
    boosts,
    isLoading,
    activeBoost,
    useBoost,
    refreshBoosts: loadBoosts
  };
};
