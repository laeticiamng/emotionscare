
export interface CoachAction {
  id: string;
  type: string;
  payload: any;
}

export const scheduleRoutine = async (userId: string, routine: any) => {
  console.log(`Scheduling routine for user ${userId}`, routine);
  return { id: "routine-id", ...routine };
};

export const cancelRoutine = async (routineId: string) => {
  console.log(`Cancelling routine ${routineId}`);
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
