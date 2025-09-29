import { LucideIcon } from 'lucide-react';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'health' | 'learning' | 'social';
  difficulty: 'novice' | 'warrior' | 'champion' | 'legend' | 'mythic';
  estMinutes: number;
  xpReward: number;
  requirements: string[];
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress: number;
  maxProgress: number;
  unlockLevel: number;
  prerequisites?: string[];
  rewards: {
    xp: number;
    coins: number;
    artifacts?: Artifact[];
    title?: string;
  };
  flavor: string;
  icon: LucideIcon;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  effect: {
    type: 'xp_boost' | 'time_reduction' | 'unlock_bonus' | 'social_boost';
    value: number;
    duration?: number;
  };
  icon: string;
}

export interface PlayerProfile {
  level: number;
  xp: number;
  coins: number;
  title: string;
  artifacts: Artifact[];
  completedQuests: string[];
  currentStreak: number;
  achievements: string[];
}

export interface ActivityFiltersState {
  dateRange: string;
  activityType: string;
  sortBy: string;
}

export interface AmbitionRun {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  totalSteps: number;
  category: string;
  startDate: string;
  targetDate?: string;
}