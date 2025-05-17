
export interface UserHistory {
  lastInteraction?: string;
  frequentTopics?: string[];
  mostTrackedEmotions?: string[];
  preferredActivities?: string[];
}

export interface UserPreferences {
  dailyReminders?: boolean;
  notificationsEnabled?: boolean;
  preferredTheme?: string;
  emotionTrackingFrequency?: 'daily' | 'weekly' | 'onDemand';
  notificationTone?: 'friendly' | 'neutral' | 'formal' | 'casual' | 'direct' | 'professional' | 'motivational';
}

export interface UserContext {
  id?: string;
  name?: string;
  preferences?: UserPreferences;
  recentEmotions?: string[];
  recentActivities?: string[];
  userHistory?: UserHistory;
  goals?: string[];
  challengesProgress?: Record<string, number>;
  streakDays?: number;
}
