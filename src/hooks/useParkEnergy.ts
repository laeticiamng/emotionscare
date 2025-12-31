/**
 * useParkEnergy - Hook pour la gestion de l'énergie du parc avec persistance
 * Régénération automatique et sauvegarde via Supabase
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUserPreference } from '@/hooks/useSupabaseStorage';
import { logger } from '@/lib/logger';

interface EnergyData {
  current: number;
  lastUpdated: string;
}

interface UseParkEnergyOptions {
  maxEnergy?: number;
  regenRate?: number; // énergie régénérée par heure
  energyCost?: number; // coût par action
}

const DEFAULT_OPTIONS: Required<UseParkEnergyOptions> = {
  maxEnergy: 100,
  regenRate: 10,
  energyCost: 10
};

export function useParkEnergy(options: UseParkEnergyOptions = {}) {
  const { maxEnergy, regenRate, energyCost } = { ...DEFAULT_OPTIONS, ...options };
  
  const [energyData, setEnergyData] = useUserPreference<EnergyData>('park-energy', {
    current: maxEnergy,
    lastUpdated: new Date().toISOString()
  });

  const [displayEnergy, setDisplayEnergy] = useState(energyData.current);

  // Calculer l'énergie régénérée depuis la dernière mise à jour
  const calculateRegenerated = useCallback((data: EnergyData): number => {
    const lastUpdate = new Date(data.lastUpdated).getTime();
    const now = Date.now();
    const hoursElapsed = (now - lastUpdate) / (1000 * 60 * 60);
    const regenerated = Math.floor(hoursElapsed * regenRate);
    return Math.min(maxEnergy, data.current + regenerated);
  }, [regenRate, maxEnergy]);

  // Appliquer la régénération au chargement
  useEffect(() => {
    const regeneratedEnergy = calculateRegenerated(energyData);
    if (regeneratedEnergy !== energyData.current) {
      const newData = {
        current: regeneratedEnergy,
        lastUpdated: new Date().toISOString()
      };
      setEnergyData(newData);
      setDisplayEnergy(regeneratedEnergy);
    } else {
      setDisplayEnergy(energyData.current);
    }
  }, [energyData.current, energyData.lastUpdated, calculateRegenerated, setEnergyData]);

  // Régénération en temps réel
  useEffect(() => {
    const regenIntervalMs = (60 * 60 * 1000) / regenRate; // intervalle pour +1 énergie
    
    const interval = setInterval(() => {
      setDisplayEnergy(prev => {
        if (prev >= maxEnergy) return prev;
        const newEnergy = Math.min(maxEnergy, prev + 1);
        
        // Sauvegarder périodiquement
        setEnergyData({
          current: newEnergy,
          lastUpdated: new Date().toISOString()
        });
        
        return newEnergy;
      });
    }, regenIntervalMs);

    return () => clearInterval(interval);
  }, [regenRate, maxEnergy, setEnergyData]);

  // Consommer de l'énergie
  const consumeEnergy = useCallback((cost: number = energyCost): boolean => {
    if (displayEnergy < cost) {
      logger.warn('Not enough energy', { current: displayEnergy, cost }, 'PARK');
      return false;
    }
    
    const newEnergy = Math.max(0, displayEnergy - cost);
    setDisplayEnergy(newEnergy);
    setEnergyData({
      current: newEnergy,
      lastUpdated: new Date().toISOString()
    });
    
    return true;
  }, [displayEnergy, energyCost, setEnergyData]);

  // Restaurer de l'énergie (bonus)
  const restoreEnergy = useCallback((amount: number) => {
    const newEnergy = Math.min(maxEnergy, displayEnergy + amount);
    setDisplayEnergy(newEnergy);
    setEnergyData({
      current: newEnergy,
      lastUpdated: new Date().toISOString()
    });
  }, [displayEnergy, maxEnergy, setEnergyData]);

  // Réinitialiser l'énergie
  const resetEnergy = useCallback(() => {
    setDisplayEnergy(maxEnergy);
    setEnergyData({
      current: maxEnergy,
      lastUpdated: new Date().toISOString()
    });
  }, [maxEnergy, setEnergyData]);

  // Temps jusqu'à plein en minutes
  const timeToFull = useMemo(() => {
    if (displayEnergy >= maxEnergy) return 0;
    const remaining = maxEnergy - displayEnergy;
    const hoursToFull = remaining / regenRate;
    return Math.ceil(hoursToFull * 60);
  }, [displayEnergy, maxEnergy, regenRate]);

  // Format du temps restant
  const timeToFullFormatted = useMemo(() => {
    if (timeToFull === 0) return '';
    if (timeToFull < 60) return `${timeToFull} min`;
    const hours = Math.floor(timeToFull / 60);
    const mins = timeToFull % 60;
    return `${hours}h ${mins}min`;
  }, [timeToFull]);

  const percentage = useMemo(() => {
    return Math.round((displayEnergy / maxEnergy) * 100);
  }, [displayEnergy, maxEnergy]);

  const canAfford = useCallback((cost: number = energyCost): boolean => {
    return displayEnergy >= cost;
  }, [displayEnergy, energyCost]);

  return {
    energy: displayEnergy,
    maxEnergy,
    regenRate,
    energyCost,
    percentage,
    timeToFull,
    timeToFullFormatted,
    consumeEnergy,
    restoreEnergy,
    resetEnergy,
    canAfford,
    isLow: displayEnergy < maxEnergy * 0.3,
    isFull: displayEnergy >= maxEnergy
  };
}

export default useParkEnergy;
