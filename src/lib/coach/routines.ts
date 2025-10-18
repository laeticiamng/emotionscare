// @ts-nocheck

import { logger } from '@/lib/logger';

export interface CoachAction {
  id: string;
  type: string;
  payload: any;
}

export const scheduleRoutine = async (userId: string, routine: any) => {
  logger.info(`Scheduling routine for user`, { userId, routine }, 'API');
  return { id: "routine-id", ...routine };
};

export const cancelRoutine = async (routineId: string) => {
  logger.info(`Cancelling routine`, { routineId }, 'API');
  return { success: true };
};

// Helper function to create actions with IDs
const createAction = (type: string, payload: any): CoachAction => {
  return {
    id: `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    payload
  };
};

// Example scheduled actions that were missing IDs
export const createReminderAction = (message: string, importance: string): CoachAction => {
  return createAction('reminder', { message, importance });
};

export const createReportAction = (reportType: string): CoachAction => {
  return createAction('report', { reportType });
};
