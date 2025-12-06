import { useState, useEffect, useCallback } from 'react';
import { Reward, UserAura } from '@/types/modules';

export const useRewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [auras, setAuras] = useState<UserAura[]>([]);
  const [dailyCard, setDailyCard] = useState<string | null>(null);

  // Load user rewards from localStorage
  useEffect(() => {
    const savedRewards = localStorage.getItem('ec_rewards');
    const savedAuras = localStorage.getItem('ec_auras');
    const savedCard = localStorage.getItem('ec_daily_card');
    
    if (savedRewards) {
      setRewards(JSON.parse(savedRewards));
    }
    if (savedAuras) {
      setAuras(JSON.parse(savedAuras));
    }
    if (savedCard) {
      setDailyCard(savedCard);
    }
  }, []);

  const unlockReward = useCallback((reward: Omit<Reward, 'id' | 'unlocked' | 'unlockedAt'>) => {
    const newReward: Reward = {
      ...reward,
      id: Date.now().toString(),
      unlocked: true,
      unlockedAt: new Date()
    };
    
    setRewards(prev => {
      const updated = [...prev, newReward];
      localStorage.setItem('ec_rewards', JSON.stringify(updated));
      return updated;
    });

    return newReward;
  }, []);

  const setActiveAura = useCallback((auraId: string) => {
    setAuras(prev => {
      const updated = prev.map(aura => ({
        ...aura,
        active: aura.id === auraId
      }));
      localStorage.setItem('ec_auras', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const generateDailyCard = useCallback(() => {
    const cards = [
      "La douceur est une force",
      "Chaque souffle compte",
      "Tu es là où tu dois être",
      "La pause fait partie du chemin",
      "Petit pas, grand cœur"
    ];
    
    const today = new Date().toDateString();
    const lastCard = localStorage.getItem('ec_daily_card_date');
    
    if (lastCard !== today) {
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      setDailyCard(randomCard);
      localStorage.setItem('ec_daily_card', randomCard);
      localStorage.setItem('ec_daily_card_date', today);
    }
  }, []);

  const getActiveAura = useCallback(() => {
    return auras.find(aura => aura.active);
  }, [auras]);

  return {
    rewards,
    auras,
    dailyCard,
    unlockReward,
    setActiveAura,
    generateDailyCard,
    getActiveAura
  };
};