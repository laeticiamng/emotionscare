/**
 * Screen Silk Module - Component Types
 */

export interface SilkPattern {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  intensity: 'low' | 'medium' | 'high';
  icon: string;
}

export interface SilkTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  ambient?: string;
}

export interface BlinkExercise {
  id: string;
  name: string;
  interval: number; // seconds between blinks
  duration: number; // total duration
  instructions: string[];
}

export interface SilkSession {
  id: string;
  pattern: SilkPattern;
  theme: SilkTheme;
  startedAt: Date;
  completedAt?: Date;
  blinkCount: number;
  interrupted: boolean;
  label?: 'gain' | 'léger' | 'incertain';
}

export interface SilkStats {
  totalSessions: number;
  completedSessions: number;
  totalBreakMinutes: number;
  averageDuration: number;
  completionRate: number;
  currentStreak: number;
  bestStreak: number;
}
