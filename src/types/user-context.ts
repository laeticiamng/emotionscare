// @ts-nocheck

export interface UserHistory {
  lastInteraction?: string;
  frequentTopics?: string[];
  mostTrackedEmotions?: string[];
  preferredActivities?: string[];
}

import type { UserPreferences } from './preferences';

export interface UserContext {
  id?: string;
  name?: string;
  preferences?: Partial<UserPreferences> & Record<string, any>;
  recentEmotions?: string[];
  recentActivities?: string[];
  userHistory?: UserHistory;
  goals?: string[];
  challengesProgress?: Record<string, number>;
  streakDays?: number;
}
