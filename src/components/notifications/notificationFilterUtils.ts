
import { NotificationFilter } from '@/types/notification';

// Extend the NotificationFilter prototype to add toString method
export const extendNotificationFilter = (filter: NotificationFilter): NotificationFilter => {
  const extended = filter as NotificationFilter & { toString: () => string };
  
  // Add toString method to allow string comparisons
  extended.toString = function() {
    if (this.type) {
      return this.type;
    }
    
    if (this.read === false) {
      return 'unread';
    }
    
    return 'all';
  };
  
  return extended;
};

// Helper to create a notification filter with toString method
export const createNotificationFilter = (options: Partial<NotificationFilter> = {}): NotificationFilter => {
  return extendNotificationFilter(options as NotificationFilter);
};
