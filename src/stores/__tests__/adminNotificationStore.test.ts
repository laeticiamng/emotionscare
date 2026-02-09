import { describe, it, expect, beforeEach } from 'vitest';
import { useAdminNotificationStore } from '../adminNotificationStore';
import { act } from '@testing-library/react';

describe('adminNotificationStore', () => {
  beforeEach(() => {
    act(() => {
      useAdminNotificationStore.getState().clearAll();
    });
  });

  it('starts with empty state', () => {
    const state = useAdminNotificationStore.getState();
    expect(state.notifications).toHaveLength(0);
    expect(state.unreadCount).toBe(0);
  });

  it('adds a notification', () => {
    act(() => {
      useAdminNotificationStore.getState().addNotification({
        title: 'Test alert',
        description: 'Something happened',
        type: 'info',
        priority: 'medium',
      });
    });

    const state = useAdminNotificationStore.getState();
    expect(state.notifications).toHaveLength(1);
    expect(state.unreadCount).toBe(1);
    expect(state.notifications[0].title).toBe('Test alert');
    expect(state.notifications[0].read).toBe(false);
  });

  it('marks a notification as read', () => {
    act(() => {
      useAdminNotificationStore.getState().addNotification({
        title: 'Read me',
        description: 'desc',
        type: 'success',
        priority: 'low',
      });
    });

    const id = useAdminNotificationStore.getState().notifications[0].id;

    act(() => {
      useAdminNotificationStore.getState().markAsRead(id);
    });

    const state = useAdminNotificationStore.getState();
    expect(state.notifications[0].read).toBe(true);
    expect(state.unreadCount).toBe(0);
  });

  it('marks all as read', () => {
    act(() => {
      const store = useAdminNotificationStore.getState();
      store.addNotification({ title: 'A', description: '', type: 'info', priority: 'low' });
      store.addNotification({ title: 'B', description: '', type: 'warning', priority: 'high' });
    });

    expect(useAdminNotificationStore.getState().unreadCount).toBe(2);

    act(() => {
      useAdminNotificationStore.getState().markAllAsRead();
    });

    expect(useAdminNotificationStore.getState().unreadCount).toBe(0);
  });

  it('dismisses a notification', () => {
    act(() => {
      useAdminNotificationStore.getState().addNotification({
        title: 'Dismiss me',
        description: '',
        type: 'error',
        priority: 'critical',
      });
    });

    const id = useAdminNotificationStore.getState().notifications[0].id;

    act(() => {
      useAdminNotificationStore.getState().dismiss(id);
    });

    expect(useAdminNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('limits notifications to 100', () => {
    act(() => {
      const store = useAdminNotificationStore.getState();
      for (let i = 0; i < 110; i++) {
        store.addNotification({
          title: `Notif ${i}`,
          description: '',
          type: 'info',
          priority: 'low',
        });
      }
    });

    expect(useAdminNotificationStore.getState().notifications.length).toBeLessThanOrEqual(100);
  });

  it('clears all notifications', () => {
    act(() => {
      const store = useAdminNotificationStore.getState();
      store.addNotification({ title: 'A', description: '', type: 'info', priority: 'low' });
      store.addNotification({ title: 'B', description: '', type: 'info', priority: 'low' });
    });

    act(() => {
      useAdminNotificationStore.getState().clearAll();
    });

    const state = useAdminNotificationStore.getState();
    expect(state.notifications).toHaveLength(0);
    expect(state.unreadCount).toBe(0);
  });

  it('newest notifications appear first', () => {
    act(() => {
      const store = useAdminNotificationStore.getState();
      store.addNotification({ title: 'First', description: '', type: 'info', priority: 'low' });
      store.addNotification({ title: 'Second', description: '', type: 'info', priority: 'low' });
    });

    const titles = useAdminNotificationStore.getState().notifications.map((n) => n.title);
    expect(titles[0]).toBe('Second');
    expect(titles[1]).toBe('First');
  });
});
