// @ts-nocheck

export interface GlowWeek {
  week_start: string;
  glowScore: number;
  coherence: number;
  moveMinutes: number;
  calmIndex: number;
  mindfulScore: number;
  moodScore: number;
}

export interface GlowBreathState {
  weeks: GlowWeek[];
  loading: boolean;
  error?: string;
  lastFetch?: number;
  fetchWeeks: () => Promise<void>;
}
