
// Re-export from the activity module
import { activityLogService, logActivity, getUserActivities } from './activity';
import { getActivityData, getActivityStats } from './activity/activityDataService';

export { 
  activityLogService, 
  logActivity, 
  getUserActivities, 
  getActivityData, 
  getActivityStats 
};
