/**
 * Tests pour les types du module User Preferences
 */

import { describe, it, expect } from 'vitest';
import {
  UserProfile,
  SettingsCategory,
  UserSettings,
  ConsentType,
  ConsentOptions,
  ConsentRecord,
  PrivacySettings,
  NotificationCategory,
  NotificationPriority,
  Notification,
  NotificationPreferences,
  DataExportFormat,
  DataExportScope,
  AccountStatus,
} from '../types';
import type {
  UpdateUserProfile,
  CreateNotification,
  DataExportRequest,
  DataExportResult,
  AccountDeletionRequest,
  AccountDeletionResult,
  UserPreferencesBundle,
} from '../types';

describe('User Preferences Types', () => {
  describe('UserProfile Schema', () => {
    it('should validate a complete user profile', () => {
      const profile = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        display_name: 'Jean Dupont',
        avatar_url: 'https://example.com/avatar.jpg',
        bio: 'Passionné de bien-être',
        university: 'Université de Paris',
        year_of_study: 3,
        speciality: 'Médecine',
        preferences: { theme: 'dark' },
        achievements: { badges: 5 },
        total_study_time: 12000,
        study_streak: 15,
        current_score_average: 85.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = UserProfile.safeParse(profile);
      expect(result.success).toBe(true);
    });

    it('should reject invalid display name', () => {
      const profile = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        display_name: '', // Invalide: vide
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = UserProfile.safeParse(profile);
      expect(result.success).toBe(false);
    });

    it('should accept profile with optional fields null', () => {
      const profile = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        display_name: 'Marie Martin',
        avatar_url: null,
        bio: null,
        university: null,
        year_of_study: null,
        speciality: null,
        preferences: null,
        achievements: null,
        total_study_time: null,
        study_streak: null,
        current_score_average: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = UserProfile.safeParse(profile);
      expect(result.success).toBe(true);
    });
  });

  describe('SettingsCategory Schema', () => {
    it('should accept all valid categories', () => {
      const categories = ['general', 'appearance', 'notifications', 'privacy', 'accessibility', 'language', 'therapeutic'];

      categories.forEach(cat => {
        const result = SettingsCategory.safeParse(cat);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid category', () => {
      const result = SettingsCategory.safeParse('invalid-category');
      expect(result.success).toBe(false);
    });
  });

  describe('UserSettings Schema', () => {
    it('should provide correct defaults', () => {
      const result = UserSettings.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.language).toBe('fr');
        expect(result.data.timezone).toBe('Europe/Paris');
        expect(result.data.theme).toBe('auto');
        expect(result.data.font_size).toBe('medium');
        expect(result.data.email_notifications).toBe(true);
        expect(result.data.push_notifications).toBe(false);
        expect(result.data.profile_visibility).toBe('friends');
        expect(result.data.data_sharing).toBe(false);
        expect(result.data.high_contrast).toBe(false);
        expect(result.data.reduce_animations).toBe(false);
      }
    });

    it('should accept valid theme values', () => {
      const themes = ['light', 'dark', 'auto'];

      themes.forEach(theme => {
        const result = UserSettings.safeParse({ theme });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid font sizes', () => {
      const sizes = ['small', 'medium', 'large'];

      sizes.forEach(font_size => {
        const result = UserSettings.safeParse({ font_size });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid profile visibility values', () => {
      const visibilities = ['public', 'friends', 'private'];

      visibilities.forEach(profile_visibility => {
        const result = UserSettings.safeParse({ profile_visibility });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('ConsentType Schema', () => {
    it('should accept all consent types', () => {
      const types = ['audio', 'video', 'emotionAnalysis', 'dataStorage', 'dataSharing', 'analytics', 'marketing'];

      types.forEach(type => {
        const result = ConsentType.safeParse(type);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('ConsentOptions Schema', () => {
    it('should provide correct defaults', () => {
      const result = ConsentOptions.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.audio).toBe(false);
        expect(result.data.video).toBe(false);
        expect(result.data.emotionAnalysis).toBe(false);
        expect(result.data.dataStorage).toBe(true);
        expect(result.data.dataSharing).toBe(false);
        expect(result.data.analytics).toBe(true);
        expect(result.data.marketing).toBe(false);
      }
    });

    it('should have privacy-safe defaults', () => {
      const result = ConsentOptions.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        // Vérifier que les options sensibles sont désactivées par défaut
        expect(result.data.dataSharing).toBe(false);
        expect(result.data.marketing).toBe(false);
      }
    });
  });

  describe('PrivacySettings Schema', () => {
    it('should provide correct defaults', () => {
      const result = PrivacySettings.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profile_visibility).toBe('friends');
        expect(result.data.show_activity_status).toBe(true);
        expect(result.data.show_achievements).toBe(true);
        expect(result.data.show_statistics).toBe(false);
        expect(result.data.allow_friend_requests).toBe(true);
        expect(result.data.data_retention_days).toBe(365);
        expect(result.data.auto_delete_old_data).toBe(false);
      }
    });
  });

  describe('NotificationCategory Schema', () => {
    it('should accept all categories', () => {
      const categories = ['system', 'social', 'achievement', 'reminder', 'therapeutic', 'community', 'update'];

      categories.forEach(cat => {
        const result = NotificationCategory.safeParse(cat);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('NotificationPriority Schema', () => {
    it('should accept all priorities', () => {
      const priorities = ['low', 'medium', 'high', 'urgent'];

      priorities.forEach(priority => {
        const result = NotificationPriority.safeParse(priority);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Notification Schema', () => {
    it('should validate complete notification', () => {
      const notification = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        category: 'achievement',
        priority: 'high',
        title: 'Nouveau badge débloqué !',
        message: 'Félicitations pour vos 10 jours de streak',
        action_url: 'https://app.example.com/badges',
        read: false,
        archived: false,
        metadata: { badge_id: 'streak-10' },
        created_at: new Date().toISOString(),
        read_at: null,
      };

      const result = Notification.safeParse(notification);
      expect(result.success).toBe(true);
    });
  });

  describe('NotificationPreferences Schema', () => {
    it('should provide correct defaults', () => {
      const result = NotificationPreferences.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email_notifications).toBe(true);
        expect(result.data.push_notifications).toBe(false);
        expect(result.data.sms_notifications).toBe(false);
        expect(result.data.quiet_hours_enabled).toBe(false);
        expect(result.data.daily_digest).toBe(false);
        expect(result.data.weekly_digest).toBe(true);
      }
    });
  });

  describe('DataExportFormat Schema', () => {
    it('should accept all formats', () => {
      const formats = ['json', 'csv', 'pdf'];

      formats.forEach(format => {
        const result = DataExportFormat.safeParse(format);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('DataExportScope Schema', () => {
    it('should accept all scopes', () => {
      const scopes = ['all', 'profile', 'emotions', 'sessions', 'achievements', 'journal', 'statistics'];

      scopes.forEach(scope => {
        const result = DataExportScope.safeParse(scope);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('AccountStatus Schema', () => {
    it('should accept all statuses', () => {
      const statuses = ['active', 'suspended', 'deactivated', 'deleted'];

      statuses.forEach(status => {
        const result = AccountStatus.safeParse(status);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Interface Types', () => {
    it('should validate UpdateUserProfile interface', () => {
      const update: UpdateUserProfile = {
        display_name: 'Nouveau Nom',
        bio: 'Nouvelle bio',
        avatar_url: null,
      };

      expect(update.display_name).toBeDefined();
    });

    it('should validate CreateNotification interface', () => {
      const notification: CreateNotification = {
        user_id: 'user-123',
        category: 'system',
        priority: 'medium',
        title: 'Mise à jour',
        message: 'Nouvelle version disponible',
      };

      expect(notification.user_id).toBeDefined();
      expect(notification.title).toBeDefined();
    });

    it('should validate DataExportRequest interface', () => {
      const request: DataExportRequest = {
        user_id: 'user-123',
        format: 'json',
        scope: ['profile', 'emotions'],
        date_from: '2024-01-01',
        date_to: '2024-12-31',
      };

      expect(request.scope).toHaveLength(2);
    });

    it('should validate DataExportResult interface', () => {
      const result: DataExportResult = {
        id: 'export-1',
        status: 'completed',
        download_url: 'https://storage.example.com/export.zip',
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      };

      expect(result.status).toBe('completed');
    });

    it('should validate AccountDeletionRequest interface', () => {
      const request: AccountDeletionRequest = {
        user_id: 'user-123',
        reason: 'Ne plus besoin du service',
        feedback: 'Bonne expérience globale',
        delete_immediately: false,
      };

      expect(request.delete_immediately).toBe(false);
    });

    it('should validate AccountDeletionResult interface', () => {
      const result: AccountDeletionResult = {
        success: true,
        deletion_scheduled_for: new Date(Date.now() + 2592000000).toISOString(),
        grace_period_days: 30,
        cancellation_url: 'https://app.example.com/cancel-deletion',
      };

      expect(result.success).toBe(true);
      expect(result.grace_period_days).toBe(30);
    });
  });
});
