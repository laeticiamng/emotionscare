
// Re-export from coach service modules
export { 
  getCoachMessages, 
  sendCoachMessage, 
  createConversation, 
  listConversations,
  updateConversationTitle
} from './coach/coach-service';

// Explicitly re-export the types to avoid ambiguity
export type { 
  CoachMessage,
  CoachEvent 
} from './coach/coach-service';

// Export other coach-related services
export {
  getEmotionalTrends,
  getRecentEmotions,
  recordEmotion
} from './coach/emotional-data-service';

export {
  createNotification,
  markNotificationAsRead,
  getUserNotifications
} from './coach/notification-service';

export {
  executeAction,
  getSupportedActions
} from './coach/action-executor';

export {
  scheduleRoutine,
  cancelRoutine
} from './coach/routines';

