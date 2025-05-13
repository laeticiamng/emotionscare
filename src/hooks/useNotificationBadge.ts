
import { useState, useCallback } from 'react';

export interface NotificationBadgeState {
  visible: boolean;
  count: number;
  badgesCount?: number; // Added for compatibility
  notificationsCount?: number;
}

export const useNotificationBadge = (initialCount = 0) => {
  const [state, setState] = useState<NotificationBadgeState>({
    visible: initialCount > 0,
    count: initialCount,
    badgesCount: 0,
    notificationsCount: 0
  });

  const show = useCallback((count = 1) => {
    setState(prev => ({
      ...prev,
      visible: true,
      count
    }));
  }, []);

  const hide = useCallback(() => {
    setState(prev => ({
      ...prev,
      visible: false
    }));
  }, []);

  const increment = useCallback((amount = 1) => {
    setState(prev => ({
      ...prev,
      visible: true,
      count: prev.count + amount
    }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      count: 0,
      visible: false
    }));
  }, []);

  const setBadgesCount = useCallback((count: number) => {
    setState(prev => ({
      ...prev,
      badgesCount: count
    }));
  }, []);

  return {
    ...state,
    show,
    hide,
    increment,
    reset,
    setBadgesCount
  };
};
