
import { useCallback, useState } from 'react';

export interface NotificationBadgeState {
  visible: boolean;
  count: number;
  notificationsCount?: number;
  badgesCount?: number;
  unreadCount?: number;
}

export interface NotificationBadgeActions {
  show: (count?: number) => void;
  hide: () => void;
  increment: (amount?: number) => void;
  reset: () => void;
  setBadgesCount: (count: number) => void;
  setUnreadCount?: (count: number) => void; // Added this method
}

export type UseNotificationBadgeResult = NotificationBadgeState & NotificationBadgeActions;

export function useNotificationBadge(initialCount: number = 0): UseNotificationBadgeResult {
  const [visible, setVisible] = useState(initialCount > 0);
  const [count, setCount] = useState(initialCount);
  const [badgesCount, setBadgesCount] = useState<number | undefined>(undefined);
  const [notificationsCount, setNotificationsCount] = useState<number | undefined>(undefined);
  const [unreadCount, setUnreadCount] = useState<number | undefined>(undefined);

  const show = useCallback((newCount?: number) => {
    if (newCount !== undefined) {
      setCount(newCount);
    }
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  const increment = useCallback((amount: number = 1) => {
    setCount(prev => prev + amount);
    setVisible(true);
  }, []);

  const reset = useCallback(() => {
    setCount(0);
    setVisible(false);
  }, []);

  return {
    visible,
    count,
    badgesCount,
    notificationsCount,
    unreadCount,
    show,
    hide,
    increment,
    reset,
    setBadgesCount,
    setUnreadCount
  };
}

export default useNotificationBadge;
