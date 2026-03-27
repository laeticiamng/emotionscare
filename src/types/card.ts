// @ts-nocheck

/**
 * Types pour le système de cartes vivantes (Dashboard)
 */

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type CardTheme = 
  | 'calm'      // Posé ✨ (niveau 0-1 WHO-5)
  | 'gentle'    // Douceur 🌊 (niveau 1-2)
  | 'balanced'  // Équilibre 🌸 (niveau 2-3)
  | 'energized' // Élan 🌱 (niveau 3-4)
  | 'on-fire';  // Cap 🔥 (niveau 4)

export interface WeeklyCard {
  id: string;
  theme: CardTheme;
  badge: string;           // Ex: "Posé ✨"
  mantra: string;          // Phrase courte
  color: string;           // Couleur HSL dominante
  icon: string;            // Emoji ou lucide icon name
  rarity: CardRarity;
  pulledAt: Date;
  weekNumber: number;
  unlocks?: CardUnlock[];
}

export interface CardUnlock {
  type: 'sticker' | 'sound' | 'halo' | 'animation';
  identifier: string;
  unlocked: boolean;
}

export interface CardCollection {
  cards: WeeklyCard[];
  totalWeeks: number;
  rareCount: number;
  currentStreak: number;
}

export const CARD_THEMES: Record<CardTheme, {
  badge: string;
  mantra: string;
  color: string;
  icon: string;
  ctaTone: string;
}> = {
  calm: {
    badge: 'Posé ✨',
    mantra: 'Cette semaine, tout va bien se passer',
    color: 'hsl(220, 70%, 60%)',
    icon: '✨',
    ctaTone: 'Prendre une pause ?'
  },
  gentle: {
    badge: 'Douceur 🌊',
    mantra: 'La douceur est ta force cette semaine',
    color: 'hsl(200, 65%, 55%)',
    icon: '🌊',
    ctaTone: 'Respirer doucement 2 min ?'
  },
  balanced: {
    badge: 'Équilibre 🌸',
    mantra: 'Tu es en harmonie avec toi-même',
    color: 'hsl(280, 60%, 60%)',
    icon: '🌸',
    ctaTone: 'Explorer ton jardin intérieur ?'
  },
  energized: {
    badge: 'Élan 🌱',
    mantra: 'Ton énergie est contagieuse',
    color: 'hsl(140, 65%, 50%)',
    icon: '🌱',
    ctaTone: 'Lancer une nouvelle aventure ?'
  },
  'on-fire': {
    badge: 'Cap 🔥',
    mantra: 'Rien ne peut t\'arrêter cette semaine',
    color: 'hsl(25, 80%, 55%)',
    icon: '🔥',
    ctaTone: 'Conquérir de nouveaux sommets ?'
  }
};
