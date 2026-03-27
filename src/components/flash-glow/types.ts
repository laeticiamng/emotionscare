// @ts-nocheck
/**
 * Types pour le module Flash Glow
 */

export interface FlashGlowSession {
  id: string;
  date: string;
  duration_s: number;
  label: 'gain' | 'léger' | 'incertain';
  glow_type: string;
  intensity: number;
  score: number;
  mood_delta?: number | null;
}

export interface FlashGlowStats {
  total_sessions: number;
  avg_duration: number;
  recent_sessions: FlashGlowSession[];
  streak: number;
  totalPoints: number;
  weeklyTrend: number[];
  achievements: FlashGlowAchievement[];
  bestSession: { duration: number; score: number; date: string } | null;
}

export interface FlashGlowAchievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface GlowType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export const GLOW_TYPES: GlowType[] = [
  { id: 'energy', name: 'Énergie', description: 'Boost d\'énergie vitale', color: 'from-yellow-400 to-orange-500', icon: '⚡' },
  { id: 'calm', name: 'Calme', description: 'Relaxation profonde', color: 'from-blue-400 to-cyan-500', icon: '🌊' },
  { id: 'creativity', name: 'Créativité', description: 'Stimule l\'imagination', color: 'from-purple-400 to-pink-500', icon: '🎨' },
  { id: 'confidence', name: 'Confiance', description: 'Renforce l\'estime', color: 'from-amber-400 to-yellow-500', icon: '💪' },
  { id: 'love', name: 'Amour', description: 'Ouvre le cœur', color: 'from-pink-400 to-rose-500', icon: '❤️' },
];

export interface FlashGlowConfig {
  glowType: string;
  intensity: number;
  duration: number;
  audioEnabled: boolean;
  hapticsEnabled: boolean;
}
