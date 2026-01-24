/**
 * Tests pour les types du module Notifications
 */

import { describe, it, expect } from 'vitest';
import { DEFAULT_NOTIFICATION_PREFERENCES } from '../types';
import type {
  NotificationCategory,
  NotificationPriority,
  Notification,
  CreateNotificationInput,
  NotificationFilters,
  NotificationPreferences,
  NotificationStats,
} from '../types';

describe('Notification Types', () => {
  describe('NotificationCategory', () => {
    it('should include all notification categories', () => {
      const categories: NotificationCategory[] = [
        'system',
        'social',
        'achievement',
        'reminder',
        'therapeutic',
        'community',
        'update',
        'badge_unlocked',
        'badge_progress',
        'challenge',
        'goal',
      ];
      expect(categories).toHaveLength(11);
    });
  });

  describe('NotificationPriority', () => {
    it('should include all priority levels', () => {
      const priorities: NotificationPriority[] = ['low', 'medium', 'high', 'urgent'];
      expect(priorities).toHaveLength(4);
    });
  });

  describe('DEFAULT_NOTIFICATION_PREFERENCES', () => {
    it('should have push and email enabled by default', () => {
      expect(DEFAULT_NOTIFICATION_PREFERENCES.push_enabled).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.email_enabled).toBe(true);
    });

    it('should have SMS disabled by default', () => {
      expect(DEFAULT_NOTIFICATION_PREFERENCES.sms_enabled).toBe(false);
    });

    it('should enable all category notifications by default', () => {
      expect(DEFAULT_NOTIFICATION_PREFERENCES.system_notifications).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.social_notifications).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.achievement_notifications).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.reminder_notifications).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.therapeutic_notifications).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.community_notifications).toBe(true);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.update_notifications).toBe(true);
    });

    it('should have quiet hours disabled by default', () => {
      expect(DEFAULT_NOTIFICATION_PREFERENCES.quiet_hours_enabled).toBe(false);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.quiet_hours_start).toBe('22:00');
      expect(DEFAULT_NOTIFICATION_PREFERENCES.quiet_hours_end).toBe('08:00');
    });

    it('should have weekly digest enabled, daily disabled', () => {
      expect(DEFAULT_NOTIFICATION_PREFERENCES.daily_digest).toBe(false);
      expect(DEFAULT_NOTIFICATION_PREFERENCES.weekly_digest).toBe(true);
    });

    it('should have a default daily reminder time', () => {
      expect(DEFAULT_NOTIFICATION_PREFERENCES.daily_reminder_time).toBe('09:00');
    });
  });

  describe('Notification', () => {
    it('should validate notification structure', () => {
      const notification: Notification = {
        id: 'notif-123',
        user_id: 'user-456',
        type: 'achievement',
        priority: 'medium',
        title: 'Nouveau badge débloqué !',
        message: 'Vous avez débloqué le badge "Premier Scan"',
        data: { badge_id: 'badge-1' },
        read: false,
        pinned: false,
        snoozed_until: null,
        action_url: '/profile/badges',
        created_at: new Date().toISOString(),
        read_at: null,
      };

      expect(notification.id).toBeDefined();
      expect(notification.type).toBe('achievement');
      expect(notification.read).toBe(false);
    });

    it('should handle read notifications', () => {
      const notification: Notification = {
        id: 'notif-read',
        user_id: 'user-789',
        type: 'system',
        priority: 'low',
        title: 'Mise à jour effectuée',
        message: null,
        data: null,
        read: true,
        pinned: false,
        snoozed_until: null,
        action_url: null,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        read_at: new Date().toISOString(),
      };

      expect(notification.read).toBe(true);
      expect(notification.read_at).not.toBeNull();
    });

    it('should handle pinned notifications', () => {
      const notification: Notification = {
        id: 'notif-pinned',
        user_id: 'user-abc',
        type: 'therapeutic',
        priority: 'high',
        title: 'Rappel important',
        message: 'N\'oubliez pas votre séance de respiration',
        data: null,
        read: false,
        pinned: true,
        snoozed_until: null,
        action_url: '/breathing',
        created_at: new Date().toISOString(),
        read_at: null,
      };

      expect(notification.pinned).toBe(true);
      expect(notification.priority).toBe('high');
    });

    it('should handle snoozed notifications', () => {
      const snoozeUntil = new Date(Date.now() + 3600000).toISOString();
      const notification: Notification = {
        id: 'notif-snoozed',
        user_id: 'user-def',
        type: 'reminder',
        priority: 'medium',
        title: 'Rappel reporté',
        message: 'Ce rappel a été reporté',
        data: null,
        read: false,
        pinned: false,
        snoozed_until: snoozeUntil,
        action_url: null,
        created_at: new Date().toISOString(),
        read_at: null,
      };

      expect(notification.snoozed_until).toBe(snoozeUntil);
    });
  });

  describe('CreateNotificationInput', () => {
    it('should validate minimal input', () => {
      const input: CreateNotificationInput = {
        user_id: 'user-123',
        type: 'system',
        title: 'Notification de test',
      };

      expect(input.user_id).toBeDefined();
      expect(input.type).toBe('system');
      expect(input.title).toBeDefined();
    });

    it('should accept optional fields', () => {
      const input: CreateNotificationInput = {
        user_id: 'user-456',
        type: 'achievement',
        priority: 'high',
        title: 'Badge débloqué',
        message: 'Félicitations !',
        data: { badge_name: 'Expert' },
        action_url: '/badges/expert',
      };

      expect(input.priority).toBe('high');
      expect(input.data?.badge_name).toBe('Expert');
    });
  });

  describe('NotificationFilters', () => {
    it('should accept empty filters', () => {
      const filters: NotificationFilters = {};
      expect(Object.keys(filters)).toHaveLength(0);
    });

    it('should filter by categories', () => {
      const filters: NotificationFilters = {
        categories: ['achievement', 'badge_unlocked'],
      };
      expect(filters.categories).toHaveLength(2);
    });

    it('should filter by priority', () => {
      const filters: NotificationFilters = {
        priority: ['high', 'urgent'],
      };
      expect(filters.priority).toContain('urgent');
    });

    it('should filter by read status', () => {
      const unreadFilters: NotificationFilters = { read: false };
      expect(unreadFilters.read).toBe(false);
    });

    it('should filter by date range', () => {
      const filters: NotificationFilters = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
      };
      expect(filters.dateFrom).toBeDefined();
      expect(filters.dateTo).toBeDefined();
    });

    it('should combine multiple filters', () => {
      const filters: NotificationFilters = {
        categories: ['system', 'update'],
        priority: ['medium', 'high'],
        read: false,
        pinned: true,
        dateFrom: '2024-06-01',
      };

      expect(filters.categories).toHaveLength(2);
      expect(filters.priority).toHaveLength(2);
      expect(filters.read).toBe(false);
      expect(filters.pinned).toBe(true);
    });
  });

  describe('NotificationStats', () => {
    it('should validate stats structure', () => {
      const stats: NotificationStats = {
        total: 150,
        unread: 25,
        byCategory: {
          system: 10,
          social: 30,
          achievement: 20,
          reminder: 40,
          therapeutic: 15,
          community: 20,
          update: 5,
          badge_unlocked: 5,
          badge_progress: 3,
          challenge: 1,
          goal: 1,
        },
        todayCount: 8,
      };

      expect(stats.total).toBe(150);
      expect(stats.unread).toBeLessThan(stats.total);
      expect(stats.todayCount).toBe(8);
    });

    it('should have byCategory for all notification types', () => {
      const categories: NotificationCategory[] = [
        'system', 'social', 'achievement', 'reminder', 'therapeutic',
        'community', 'update', 'badge_unlocked', 'badge_progress',
        'challenge', 'goal'
      ];

      const stats: NotificationStats = {
        total: 100,
        unread: 10,
        byCategory: categories.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {} as Record<NotificationCategory, number>),
        todayCount: 5,
      };

      categories.forEach(cat => {
        expect(stats.byCategory[cat]).toBeDefined();
      });
    });
  });
});
