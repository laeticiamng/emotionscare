
// Re-export everything from the refactored coach module
import * as coachService from './coach/coach-service';
import * as coachTypes from './coach/types';

export type { CoachMessage } from './coach/types';
export type { CoachEvent } from './coach/types';

export const {
  getCoachMessages,
  sendCoachMessage,
  createCoachConversation,
  getCoachConversations,
  updateConversationTitle
} = coachService;

export * from './coach/types';
