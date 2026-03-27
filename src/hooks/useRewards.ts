// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';

export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockRequirement: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
  unlockRequirement: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ParticleEffect {
  id: string;
  name: string;
  type: 'sparkles' | 'stars' | 'hearts' | 'cosmic' | 'rainbow';
  unlockRequirement: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const REWARDS_STORAGE_KEY = 'emotional-park-rewards';

const AVAILABLE_AVATARS: Avatar[] = [
  { id: 'starter', name: 'Explorateur', emoji: '🌟', description: 'Avatar de départ', unlockRequirement: 0, rarity: 'common' },
  { id: 'calm-master', name: 'Maître du Calme', emoji: '🧘', description: 'Débloquer toutes les zones de calme', unlockRequirement: 2, rarity: 'rare' },
  { id: 'energy-warrior', name: 'Guerrier d\'Énergie', emoji: '⚡', description: 'Maîtriser l\'énergie vitale', unlockRequirement: 3, rarity: 'rare' },
  { id: 'creative-soul', name: 'Âme Créative', emoji: '🎨', description: 'Débloquer toutes zones créatives', unlockRequirement: 3, rarity: 'rare' },
  { id: 'wisdom-keeper', name: 'Gardien de Sagesse', emoji: '🦉', description: 'Sagesse et introspection', unlockRequirement: 4, rarity: 'epic' },
  { id: 'social-butterfly', name: 'Papillon Social', emoji: '🦋', description: 'Champion de la communauté', unlockRequirement: 4, rarity: 'epic' },
  { id: 'cosmic-traveler', name: 'Voyageur Cosmique', emoji: '🌌', description: 'Explorer toutes les dimensions', unlockRequirement: 6, rarity: 'epic' },
  { id: 'master-all', name: 'Maître Absolu', emoji: '👑', description: 'Débloquer TOUTES les zones', unlockRequirement: 8, rarity: 'legendary' }
];

const AVAILABLE_THEMES: Theme[] = [
  { id: 'default', name: 'Classique', primary: 'hsl(var(--primary))', secondary: 'hsl(var(--secondary))', gradient: 'from-primary to-secondary', unlockRequirement: 0, rarity: 'common' },
  { id: 'ocean', name: 'Océan Profond', primary: '#0ea5e9', secondary: '#06b6d4', gradient: 'from-sky-500 to-cyan-500', unlockRequirement: 2, rarity: 'rare' },
  { id: 'sunset', name: 'Coucher de Soleil', primary: '#f97316', secondary: '#ec4899', gradient: 'from-orange-500 to-pink-500', unlockRequirement: 3, rarity: 'rare' },
  { id: 'forest', name: 'Forêt Mystique', primary: '#10b981', secondary: '#059669', gradient: 'from-emerald-500 to-green-600', unlockRequirement: 3, rarity: 'rare' },
  { id: 'cosmic', name: 'Cosmos Infini', primary: '#8b5cf6', secondary: '#6366f1', gradient: 'from-violet-500 to-indigo-500', unlockRequirement: 5, rarity: 'epic' },
  { id: 'aurora', name: 'Aurore Boréale', primary: '#06b6d4', secondary: '#a855f7', gradient: 'from-cyan-500 via-purple-500 to-pink-500', unlockRequirement: 6, rarity: 'epic' },
  { id: 'golden', name: 'Or Royal', primary: '#f59e0b', secondary: '#eab308', gradient: 'from-amber-500 to-yellow-500', unlockRequirement: 8, rarity: 'legendary' }
];

const AVAILABLE_PARTICLES: ParticleEffect[] = [
  { id: 'none', name: 'Aucun', type: 'sparkles', unlockRequirement: 0, rarity: 'common' },
  { id: 'sparkles', name: 'Étincelles', type: 'sparkles', unlockRequirement: 2, rarity: 'rare' },
  { id: 'stars', name: 'Étoiles Filantes', type: 'stars', unlockRequirement: 3, rarity: 'rare' },
  { id: 'hearts', name: 'Cœurs Flottants', type: 'hearts', unlockRequirement: 4, rarity: 'epic' },
  { id: 'cosmic', name: 'Poussière Cosmique', type: 'cosmic', unlockRequirement: 5, rarity: 'epic' },
  { id: 'rainbow', name: 'Arc-en-ciel Magique', type: 'rainbow', unlockRequirement: 7, rarity: 'legendary' }
];

export const useRewards = (badgeCount: number) => {
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>(['starter']);
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(['default']);
  const [unlockedParticles, setUnlockedParticles] = useState<string[]>(['none']);
  const [selectedAvatar, setSelectedAvatar] = useState('starter');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedParticle, setSelectedParticle] = useState('none');
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(REWARDS_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setUnlockedAvatars(data.avatars || ['starter']);
      setUnlockedThemes(data.themes || ['default']);
      setUnlockedParticles(data.particles || ['none']);
      setSelectedAvatar(data.selectedAvatar || 'starter');
      setSelectedTheme(data.selectedTheme || 'default');
      setSelectedParticle(data.selectedParticle || 'none');
    }
  }, []);

  useEffect(() => {
    const newUnlocks: string[] = [];

    AVAILABLE_AVATARS.forEach(avatar => {
      if (badgeCount >= avatar.unlockRequirement && !unlockedAvatars.includes(avatar.id)) {
        setUnlockedAvatars(prev => [...prev, avatar.id]);
        newUnlocks.push(`avatar:${avatar.id}`);
      }
    });

    AVAILABLE_THEMES.forEach(theme => {
      if (badgeCount >= theme.unlockRequirement && !unlockedThemes.includes(theme.id)) {
        setUnlockedThemes(prev => [...prev, theme.id]);
        newUnlocks.push(`theme:${theme.id}`);
      }
    });

    AVAILABLE_PARTICLES.forEach(particle => {
      if (badgeCount >= particle.unlockRequirement && !unlockedParticles.includes(particle.id)) {
        setUnlockedParticles(prev => [...prev, particle.id]);
        newUnlocks.push(`particle:${particle.id}`);
      }
    });

    if (newUnlocks.length > 0) {
      setNewlyUnlocked(newUnlocks);
    }
  }, [badgeCount, unlockedAvatars, unlockedThemes, unlockedParticles]);

  useEffect(() => {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify({
      avatars: unlockedAvatars,
      themes: unlockedThemes,
      particles: unlockedParticles,
      selectedAvatar,
      selectedTheme,
      selectedParticle
    }));
  }, [unlockedAvatars, unlockedThemes, unlockedParticles, selectedAvatar, selectedTheme, selectedParticle]);

  const clearNewlyUnlocked = () => setNewlyUnlocked([]);

  const selectAvatar = (id: string) => {
    if (unlockedAvatars.includes(id)) {
      setSelectedAvatar(id);
    }
  };

  const selectTheme = (id: string) => {
    if (unlockedThemes.includes(id)) {
      setSelectedTheme(id);
    }
  };

  const selectParticle = (id: string) => {
    if (unlockedParticles.includes(id)) {
      setSelectedParticle(id);
    }
  };

  const currentAvatar = useMemo(
    () => AVAILABLE_AVATARS.find(a => a.id === selectedAvatar),
    [selectedAvatar]
  );

  const currentTheme = useMemo(
    () => AVAILABLE_THEMES.find(t => t.id === selectedTheme),
    [selectedTheme]
  );

  const currentParticle = useMemo(
    () => AVAILABLE_PARTICLES.find(p => p.id === selectedParticle),
    [selectedParticle]
  );

  return {
    availableAvatars: AVAILABLE_AVATARS,
    availableThemes: AVAILABLE_THEMES,
    availableParticles: AVAILABLE_PARTICLES,
    unlockedAvatars,
    unlockedThemes,
    unlockedParticles,
    selectedAvatar,
    selectedTheme,
    selectedParticle,
    currentAvatar,
    currentTheme,
    currentParticle,
    selectAvatar,
    selectTheme,
    selectParticle,
    newlyUnlocked,
    clearNewlyUnlocked
  };
};
