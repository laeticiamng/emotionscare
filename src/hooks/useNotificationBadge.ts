
import { useState, useCallback } from 'react';
import { NotificationBadge } from '@/types/notification';

export function useNotificationBadge(): NotificationBadge {
  const [badgeCount, setBadgeCount] = useState(0);

  const setBadgesCountCompat = useCallback((count: number) => {
    setBadgeCount(count);
  }, []);

  return {
    count: badgeCount,
    badgeCount,
    notificationsCount: badgeCount, // For compatibility
    badgesCount: badgeCount, // For backward compatibility
    setBadgeCount,
    setBadgesCount: setBadgesCountCompat // For backward compatibility
  };
}
