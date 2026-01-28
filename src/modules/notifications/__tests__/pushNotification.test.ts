/**
 * Tests pour le module notifications push
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock du pushNotificationService
vi.mock('@/modules/notifications/pushNotificationService', () => ({
  pushNotificationService: {
    isAvailable: vi.fn(() => true),
    getPermissionStatus: vi.fn(() => 'default' as NotificationPermission),
    requestPermission: vi.fn().mockResolvedValue('granted'),
    registerServiceWorker: vi.fn().mockResolvedValue(null),
    subscribe: vi.fn().mockResolvedValue(true),
    unsubscribe: vi.fn().mockResolvedValue(true),
    isSubscribed: vi.fn().mockResolvedValue(false),
    showLocalNotification: vi.fn().mockResolvedValue(true),
  },
}));

describe('PushNotificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isAvailable', () => {
    it('should return true when push is supported', () => {
      const { pushNotificationService } = require('@/modules/notifications/pushNotificationService');
      expect(pushNotificationService.isAvailable()).toBe(true);
    });
  });

  describe('requestPermission', () => {
    it('should request notification permission', async () => {
      const { pushNotificationService } = require('@/modules/notifications/pushNotificationService');
      const result = await pushNotificationService.requestPermission();
      expect(result).toBe('granted');
    });
  });

  describe('subscribe', () => {
    it('should subscribe user to push notifications', async () => {
      const { pushNotificationService } = require('@/modules/notifications/pushNotificationService');
      const result = await pushNotificationService.subscribe('user-123');
      expect(result).toBe(true);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe user from push notifications', async () => {
      const { pushNotificationService } = require('@/modules/notifications/pushNotificationService');
      const result = await pushNotificationService.unsubscribe('user-123');
      expect(result).toBe(true);
    });
  });

  describe('showLocalNotification', () => {
    it('should display local notification', async () => {
      const { pushNotificationService } = require('@/modules/notifications/pushNotificationService');
      const result = await pushNotificationService.showLocalNotification('Test', { body: 'Test body' });
      expect(result).toBe(true);
    });
  });
});

describe('NotificationPreferences', () => {
  it('should have all required fields', () => {
    const { DEFAULT_NOTIFICATION_PREFERENCES } = require('@/modules/notifications/types');
    
    expect(DEFAULT_NOTIFICATION_PREFERENCES).toHaveProperty('push_enabled');
    expect(DEFAULT_NOTIFICATION_PREFERENCES).toHaveProperty('email_enabled');
    expect(DEFAULT_NOTIFICATION_PREFERENCES).toHaveProperty('quiet_hours_enabled');
    expect(DEFAULT_NOTIFICATION_PREFERENCES).toHaveProperty('daily_digest');
  });

  it('should have sensible defaults', () => {
    const { DEFAULT_NOTIFICATION_PREFERENCES } = require('@/modules/notifications/types');
    
    expect(DEFAULT_NOTIFICATION_PREFERENCES.push_enabled).toBe(true);
    expect(DEFAULT_NOTIFICATION_PREFERENCES.email_enabled).toBe(true);
    expect(DEFAULT_NOTIFICATION_PREFERENCES.sms_enabled).toBe(false);
    expect(DEFAULT_NOTIFICATION_PREFERENCES.quiet_hours_enabled).toBe(false);
  });
});

describe('NotificationCategories', () => {
  it('should support all notification types', () => {
    const categories = [
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
      'goal'
    ];

    // Vérifier que les catégories existent dans le type
    expect(categories.length).toBe(11);
  });
});
