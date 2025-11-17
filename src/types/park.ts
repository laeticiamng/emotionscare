import { LucideIcon } from 'lucide-react';

/**
 * Zone keys for the emotional park
 */
export type ZoneKey = 'hub' | 'calm' | 'creative' | 'wisdom' | 'explore' | 'energy' | 'challenge' | 'social';

/**
 * Zone configuration
 */
export interface Zone {
  name: string;
  color: string;
  emoji: string;
}

/**
 * Attraction in the emotional park
 */
export interface Attraction {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  route: string;
  gradient: string;
  collection: string;
  zone: ZoneKey;
}

/**
 * Journey attraction with narrative
 */
export interface JourneyAttraction {
  number: number;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  narrative: string;
  gradient: string;
  route: string;
}

/**
 * Zone progress data
 */
export interface ZoneProgressData extends Zone {
  key: ZoneKey;
  visited: number;
  total: number;
  percentage: number;
  isUnlocked: boolean;
}

/**
 * Park statistics
 */
export interface ParkStat {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  gradient: string;
  description: string;
}

/**
 * Mood options
 */
export type MoodValue = 'happy' | 'calm' | 'anxious' | 'sad' | 'excited';

/**
 * Mood option with display info
 */
export interface MoodOption {
  value: MoodValue;
  emoji: string;
  label: string;
}

/**
 * Recommendation data
 */
export interface RecommendationData {
  attraction: Attraction;
  score: number;
  reason: string;
}
