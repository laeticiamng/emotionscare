/**
 * Types pour le système de récompenses et souvenirs
 */

export interface Reward {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  moduleId: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  visualData: {
    color: string;
    icon: string;
    animation?: string;
  };
  earnedAt: Date;
  metadata?: Record<string, any>;
}

export type RewardType = 
  | 'gem' 
  | 'flower' 
  | 'avatar' 
  | 'constellation' 
  | 'sample' 
  | 'item' 
  | 'card' 
  | 'badge' 
  | 'lantern'
  | 'flame';

export interface UserCollection {
  gems: GlowGem[];
  flowers: EmotionFlower[];
  avatars: EmotionAvatar[];
  constellations: BreathConstellation[];
  samples: BubbleSample[];
  items: GritItem[];
  cards: StoryCard[];
  badges: ScreenBadge[];
  lanterns: SocialLantern[];
  flames: CollabFlame[];
}

export interface GlowGem {
  id: string;
  color: string;
  intensity: number;
  duration: number;
  timestamp: Date;
  glowType: 'energy' | 'calm' | 'focus' | 'joy';
}

export interface EmotionFlower {
  id: string;
  emotion: string;
  color: string;
  bloomStage: number;
  journalEntryId?: string;
  timestamp: Date;
}

export interface EmotionAvatar {
  id: string;
  type: 'water' | 'fire' | 'air' | 'earth';
  valence: number;
  arousal: number;
  visualForm: string;
  timestamp: Date;
}

export interface BreathConstellation {
  id: string;
  starPattern: Array<{ x: number; y: number; brightness: number }>;
  cycleCount: number;
  sessionDuration: number;
  timestamp: Date;
}

export interface BubbleSample {
  id: string;
  beats: Array<{ time: number; sound: string; intensity: number }>;
  duration: number;
  mood: string;
  timestamp: Date;
}

export interface GritItem {
  id: string;
  itemType: 'sword' | 'key' | 'armor' | 'shield' | 'crown';
  forgedBy: string; // objectif/défi
  strength: number;
  timestamp: Date;
}

export interface StoryCard {
  id: string;
  storyTitle: string;
  visualSnapshot: string; // URL ou data
  emotions: string[];
  landscape: string;
  timestamp: Date;
}

export interface ScreenBadge {
  id: string;
  sessionDuration: number;
  eyeRestLevel: number;
  blinkCount: number;
  timestamp: Date;
}

export interface SocialLantern {
  id: string;
  postContent: string;
  height: number; // hauteur dans le ciel
  glowIntensity: number;
  reactions: Array<{ type: string; count: number }>;
  timestamp: Date;
}

export interface CollabFlame {
  id: string;
  teamContribution: string;
  flameColor: string;
  teamMoodAverage: number;
  contributorCount: number;
  timestamp: Date;
}