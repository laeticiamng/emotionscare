// @ts-nocheck
/**
 * Logique métier du système de cartes vivantes
 */

import { CardTheme, WeeklyCard, CardRarity, CARD_THEMES } from '@/types/card';

/**
 * Convertit un niveau WHO-5 (0-4) en thème de carte
 */
export function levelToTheme(level: number): CardTheme {
  if (level <= 1) return 'calm';
  if (level === 2) return 'gentle';
  if (level === 3) return 'balanced';
  if (level === 4) return 'energized';
  return 'on-fire';
}

/**
 * Détermine la rareté de la carte (probabilités)
 */
export function determineRarity(weekNumber: number): CardRarity {
  const rand = Math.random();
  
  // Première carte = toujours common
  if (weekNumber === 1) return 'common';
  
  // Rare drop à la 10e semaine
  if (weekNumber === 10) return 'epic';
  
  // Probabilités standard
  if (rand < 0.60) return 'common';      // 60%
  if (rand < 0.85) return 'rare';        // 25%
  if (rand < 0.97) return 'epic';        // 12%
  return 'legendary';                     // 3%
}

/**
 * Génère une carte à partir d'un niveau WHO-5
 */
export function generateCard(
  level: number,
  weekNumber: number,
  sessionId: string
): WeeklyCard {
  const theme = levelToTheme(level);
  const rarity = determineRarity(weekNumber);
  const themeData = CARD_THEMES[theme];
  
  return {
    id: sessionId,
    theme,
    badge: themeData.badge,
    mantra: themeData.mantra,
    color: themeData.color,
    icon: themeData.icon,
    rarity,
    pulledAt: new Date(),
    weekNumber,
    unlocks: generateUnlocks(rarity)
  };
}

/**
 * Génère les unlocks selon la rareté
 */
function generateUnlocks(rarity: CardRarity): WeeklyCard['unlocks'] {
  const unlocks: WeeklyCard['unlocks'] = [];
  
  if (rarity === 'rare') {
    unlocks.push({ type: 'sticker', identifier: 'rare-sticker', unlocked: true });
  }
  
  if (rarity === 'epic') {
    unlocks.push(
      { type: 'sticker', identifier: 'epic-sticker', unlocked: true },
      { type: 'halo', identifier: 'epic-halo', unlocked: true }
    );
  }
  
  if (rarity === 'legendary') {
    unlocks.push(
      { type: 'sticker', identifier: 'legendary-sticker', unlocked: true },
      { type: 'halo', identifier: 'legendary-halo', unlocked: true },
      { type: 'sound', identifier: 'legendary-sound', unlocked: true },
      { type: 'animation', identifier: 'legendary-anim', unlocked: true }
    );
  }
  
  return unlocks;
}

/**
 * Vérifie si l'utilisateur peut tirer une nouvelle carte
 */
export function canDrawCard(lastPullDate: Date | null): boolean {
  if (!lastPullDate) return true;
  
  const now = new Date();
  const lastMonday = getLastMonday(now);
  const lastPullMonday = getLastMonday(lastPullDate);
  
  return lastMonday > lastPullMonday;
}

/**
 * Retourne le lundi de la semaine d'une date
 */
function getLastMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Dimanche = -6, autres = 1-day
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Calcule le numéro de semaine dans l'année
 */
export function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
