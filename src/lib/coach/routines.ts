
import { CoachAction } from './types';

/**
 * Routines for the coach IA
 */
export const routines = {
  /**
   * Get daily reminder actions
   */
  getDailyReminder(): CoachAction[] {
    return [
      { type: 'check_scan_status', payload: {} },
      { type: 'suggest_wellness_activity', payload: {} }
    ];
  },
  
  /**
   * Get weekly routine actions
   */
  getWeeklyRoutine(): CoachAction[] {
    return [
      { type: 'check_trend_alert', payload: { period: 'week' } },
      { type: 'suggest_journal_entry', payload: { template: 'weekly_reflection' } }
    ];
  }
};
