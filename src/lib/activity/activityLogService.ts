
import { v4 as uuidv4 } from 'uuid';
import { mockActivityLogs, mockActivityStats } from './mockActivityData';

// Define types
interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  timestamp: Date;
  details: Record<string, any>;
}

interface AnonymizedActivityLog {
  id: string;
  activity_type: string;
  category: string;
  count: number;
  timestamp_day: string;
}

// Singleton service for activity logging
class ActivityLogService {
  private static instance: ActivityLogService;
  private activityLogs: ActivityLog[] = [];

  private constructor() {
    console.log("ActivityLogService initialized");
  }

  public static getInstance(): ActivityLogService {
    if (!ActivityLogService.instance) {
      ActivityLogService.instance = new ActivityLogService();
    }
    return ActivityLogService.instance;
  }

  public logActivity(userId: string, type: string, details: Record<string, any> = {}): void {
    const log: ActivityLog = {
      id: uuidv4(),
      user_id: userId,
      activity_type: type,
      timestamp: new Date(),
      details
    };
    
    this.activityLogs.push(log);
    console.log(`Activity logged for user ${userId}: ${type}`, details);
  }

  public getUserActivities(userId: string): ActivityLog[] {
    return this.activityLogs.filter(log => log.user_id === userId);
  }
  
  public getAllActivities(): ActivityLog[] {
    return [...this.activityLogs];
  }
}

// Singleton instance
export const activityLogService = ActivityLogService.getInstance();

// Helper function to log activities
export const logActivity = (userId: string, type: string, details: Record<string, any> = {}): void => {
  activityLogService.logActivity(userId, type, details);
};

// Helper function to get user activities
export const getUserActivities = (userId: string): ActivityLog[] => {
  return activityLogService.getUserActivities(userId);
};

// Export mock data functions for the admin dashboard
export const getActivityData = (): Promise<AnonymizedActivityLog[]> => {
  console.log("Getting mock activity data...");
  return Promise.resolve(mockActivityLogs);
};

export const getActivityStats = (): Promise<any[]> => {
  console.log("Getting mock activity stats...");
  return Promise.resolve(mockActivityStats);
};
