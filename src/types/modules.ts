export type ModuleState = 'loading' | 'content' | 'empty' | 'verbal-feedback';

export interface SessionResult {
  badge: string;
  cta?: {
    text: string;
    action: string;
    duration?: string;
  };
  reward?: {
    type: 'aura' | 'sticker' | 'loop' | 'card' | 'theme';
    name: string;
    description: string;
  };
}

export interface ModuleContext {
  id: string;
  name: string;
  duration: number;
  preset?: string;
  userState?: any;
}

export interface DayPlanCard {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  route: string;
  priority: number;
  icon?: string;
}

export interface Reward {
  id: string;
  type: 'aura' | 'sticker' | 'loop' | 'card' | 'theme';
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface UserAura {
  id: string;
  name: string;
  colors: string[];
  active: boolean;
}

export interface VibeSetting {
  energy: number; // 0-100 (doux -> enjoué)
  tone: number;   // 0-100 (calme -> tonique)
  name?: string;
}