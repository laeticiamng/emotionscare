
export interface ChatMessage {
  id: string;
  sender: string;
  text?: string;
  content?: string;
  timestamp: string;
  conversation_id?: string;
  role: string;
}

export interface CoachEvent {
  id: string;
  type: string;
  timestamp: string;
  data: any;
}

export interface CoachAction {
  id: string;
  type: string;
  payload: any;
}

// Re-export from other modules
export { calculateEmotionalStats } from './coach/emotional-data';
export { analyzeEmotionalState } from './coach/analyzer';
export { generateRecommendation } from './coach/recommender';

// Mock implementations for functions not yet implemented
export async function createConversation(userId: string, title?: string) {
  return { id: `conv-${Date.now()}`, title: title || 'New Conversation', created_at: new Date().toISOString() };
}

export async function listConversations(userId: string) {
  return [];
}

export async function updateConversationTitle(conversationId: string, title: string) {
  return true;
}

// Emotional data services
export async function getEmotionalTrends(userId: string, timeframe: string) {
  return { trends: [], average: 0.5 };
}

export async function getRecentEmotions(userId: string, limit = 5) {
  return [];
}

export async function recordEmotion(data: any) {
  return { id: `emotion-${Date.now()}`, ...data };
}

// Notification services
export async function createNotification(userId: string, notification: any) {
  return { id: `notif-${Date.now()}`, ...notification, created_at: new Date().toISOString() };
}

export async function markNotificationAsRead(notificationId: string) {
  return true;
}

export async function getUserNotifications(userId: string) {
  return [];
}

// Action services
export async function getSupportedActions() {
  return [];
}

// Routine services
export async function scheduleRoutine(userId: string, routine: any) {
  return { id: `routine-${Date.now()}`, ...routine };
}

export async function cancelRoutine(routineId: string) {
  return true;
}
