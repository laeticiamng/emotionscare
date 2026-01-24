/**
 * Tests pour les types du module Privacy
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PRIVACY_PREFERENCES,
  PREFERENCE_METADATA,
} from '../types';
import type {
  PrivacyPreferenceKey,
  PrivacyPreferences,
  ConsentRecord,
  DataExportRequest,
  DataDeletionRequest,
  PrivacyStats,
  PrivacyAuditLog,
} from '../types';

describe('Privacy Types', () => {
  describe('DEFAULT_PRIVACY_PREFERENCES', () => {
    it('should have secure defaults for sensor permissions', () => {
      // Les permissions sensibles doivent être désactivées par défaut
      expect(DEFAULT_PRIVACY_PREFERENCES.cam).toBe(false);
      expect(DEFAULT_PRIVACY_PREFERENCES.mic).toBe(false);
      expect(DEFAULT_PRIVACY_PREFERENCES.hr).toBe(false);
      expect(DEFAULT_PRIVACY_PREFERENCES.gps).toBe(false);
    });

    it('should have sharing disabled by default', () => {
      expect(DEFAULT_PRIVACY_PREFERENCES.social).toBe(false);
      expect(DEFAULT_PRIVACY_PREFERENCES.nft).toBe(false);
    });

    it('should have analytics and personalization enabled by default', () => {
      // Ces fonctionnalités améliorent l'expérience sans données sensibles
      expect(DEFAULT_PRIVACY_PREFERENCES.analytics).toBe(true);
      expect(DEFAULT_PRIVACY_PREFERENCES.personalization).toBe(true);
    });
  });

  describe('PREFERENCE_METADATA', () => {
    it('should have metadata for all preference keys', () => {
      const keys: PrivacyPreferenceKey[] = ['cam', 'mic', 'hr', 'gps', 'social', 'nft', 'analytics', 'personalization'];

      keys.forEach(key => {
        expect(PREFERENCE_METADATA[key]).toBeDefined();
        expect(PREFERENCE_METADATA[key].label).toBeDefined();
        expect(PREFERENCE_METADATA[key].description).toBeDefined();
        expect(PREFERENCE_METADATA[key].fallback).toBeDefined();
        expect(PREFERENCE_METADATA[key].icon).toBeDefined();
        expect(PREFERENCE_METADATA[key].category).toBeDefined();
      });
    });

    it('should categorize sensors correctly', () => {
      expect(PREFERENCE_METADATA.cam.category).toBe('sensors');
      expect(PREFERENCE_METADATA.mic.category).toBe('sensors');
      expect(PREFERENCE_METADATA.hr.category).toBe('sensors');
      expect(PREFERENCE_METADATA.gps.category).toBe('sensors');
    });

    it('should categorize sharing correctly', () => {
      expect(PREFERENCE_METADATA.social.category).toBe('sharing');
      expect(PREFERENCE_METADATA.nft.category).toBe('sharing');
    });

    it('should categorize analytics correctly', () => {
      expect(PREFERENCE_METADATA.analytics.category).toBe('analytics');
      expect(PREFERENCE_METADATA.personalization.category).toBe('analytics');
    });

    it('should have French labels', () => {
      expect(PREFERENCE_METADATA.cam.label).toBe('Caméra');
      expect(PREFERENCE_METADATA.mic.label).toBe('Microphone');
      expect(PREFERENCE_METADATA.hr.label).toBe('Capteur cardiaque');
    });
  });

  describe('PrivacyPreferences', () => {
    it('should validate full preferences structure', () => {
      const prefs: PrivacyPreferences = {
        user_id: 'user-123',
        cam: true,
        mic: false,
        hr: false,
        gps: false,
        social: true,
        nft: false,
        analytics: true,
        personalization: true,
        updated_at: new Date().toISOString(),
      };

      expect(prefs.user_id).toBeDefined();
      expect(typeof prefs.cam).toBe('boolean');
      expect(prefs.updated_at).toBeDefined();
    });
  });

  describe('ConsentRecord', () => {
    it('should validate consent record structure', () => {
      const consent: ConsentRecord = {
        id: 'consent-1',
        user_id: 'user-123',
        consent_type: 'analytics',
        granted: true,
        granted_at: new Date().toISOString(),
        version: '1.0.0',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
      };

      expect(consent.id).toBeDefined();
      expect(consent.granted).toBe(true);
      expect(consent.version).toBeDefined();
    });

    it('should handle revoked consent', () => {
      const revokedConsent: ConsentRecord = {
        id: 'consent-2',
        user_id: 'user-456',
        consent_type: 'marketing',
        granted: false,
        granted_at: new Date(Date.now() - 86400000).toISOString(),
        revoked_at: new Date().toISOString(),
        version: '1.0.0',
      };

      expect(revokedConsent.granted).toBe(false);
      expect(revokedConsent.revoked_at).toBeDefined();
    });
  });

  describe('DataExportRequest', () => {
    it('should validate export request structure', () => {
      const request: DataExportRequest = {
        id: 'export-1',
        user_id: 'user-123',
        type: 'all',
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      expect(request.type).toBe('all');
      expect(request.status).toBe('pending');
    });

    it('should accept all export types', () => {
      const types: DataExportRequest['type'][] = ['all', 'personal', 'activity', 'analytics', 'deletion'];
      expect(types).toHaveLength(5);
    });

    it('should accept all status values', () => {
      const statuses: DataExportRequest['status'][] = [
        'pending', 'processing', 'ready', 'expired', 'failed', 'cancelled'
      ];
      expect(statuses).toHaveLength(6);
    });

    it('should handle completed export with file', () => {
      const completedExport: DataExportRequest = {
        id: 'export-2',
        user_id: 'user-123',
        type: 'personal',
        status: 'ready',
        file_url: 'https://storage.example.com/exports/export-2.zip',
        file_size_bytes: 1024000,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        completed_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      };

      expect(completedExport.status).toBe('ready');
      expect(completedExport.file_url).toBeDefined();
      expect(completedExport.file_size_bytes).toBeGreaterThan(0);
    });
  });

  describe('DataDeletionRequest', () => {
    it('should validate deletion request structure', () => {
      const request: DataDeletionRequest = {
        id: 'deletion-1',
        user_id: 'user-123',
        status: 'pending',
        reason: 'Fermeture de compte',
        scheduled_at: new Date(Date.now() + 2592000000).toISOString(), // 30 jours
        created_at: new Date().toISOString(),
      };

      expect(request.status).toBe('pending');
      expect(request.reason).toBeDefined();
    });

    it('should accept all deletion statuses', () => {
      const statuses: DataDeletionRequest['status'][] = [
        'pending', 'processing', 'completed', 'cancelled'
      ];
      expect(statuses).toHaveLength(4);
    });

    it('should handle completed deletion', () => {
      const completed: DataDeletionRequest = {
        id: 'deletion-2',
        user_id: 'user-456',
        status: 'completed',
        scheduled_at: new Date(Date.now() - 86400000).toISOString(),
        completed_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 2592000000).toISOString(),
      };

      expect(completed.status).toBe('completed');
      expect(completed.completed_at).toBeDefined();
    });
  });

  describe('PrivacyStats', () => {
    it('should validate privacy stats structure', () => {
      const stats: PrivacyStats = {
        totalDataRecords: 1500,
        personalDataRecords: 200,
        anonymizedRecords: 1200,
        sharedDataRecords: 50,
        gdprScore: 95,
        lastAuditDate: new Date().toISOString(),
      };

      expect(stats.gdprScore).toBeGreaterThanOrEqual(0);
      expect(stats.gdprScore).toBeLessThanOrEqual(100);
      expect(stats.totalDataRecords).toBeGreaterThanOrEqual(
        stats.personalDataRecords + stats.anonymizedRecords
      );
    });

    it('should accept stats without audit date', () => {
      const stats: PrivacyStats = {
        totalDataRecords: 100,
        personalDataRecords: 10,
        anonymizedRecords: 90,
        sharedDataRecords: 0,
        gdprScore: 80,
      };

      expect(stats.lastAuditDate).toBeUndefined();
    });
  });

  describe('PrivacyAuditLog', () => {
    it('should validate audit log structure', () => {
      const log: PrivacyAuditLog = {
        id: 'audit-1',
        user_id: 'user-123',
        action: 'data_export_requested',
        resource_type: 'user_data',
        resource_id: 'export-1',
        details: {
          format: 'json',
          scope: ['all'],
        },
        ip_address: '192.168.1.1',
        created_at: new Date().toISOString(),
      };

      expect(log.action).toBe('data_export_requested');
      expect(log.resource_type).toBe('user_data');
      expect(log.details).toBeDefined();
    });

    it('should accept log without optional fields', () => {
      const minimalLog: PrivacyAuditLog = {
        id: 'audit-2',
        user_id: 'user-456',
        action: 'consent_updated',
        resource_type: 'consent',
        details: {},
        created_at: new Date().toISOString(),
      };

      expect(minimalLog.resource_id).toBeUndefined();
      expect(minimalLog.ip_address).toBeUndefined();
    });
  });

  describe('RGPD Compliance', () => {
    it('should have all required RGPD consent types', () => {
      // Types de consentement requis par le RGPD
      const requiredConsentTypes = [
        'analytics',
        'personalization',
        'cam',
        'mic',
        'hr',
        'gps',
        'social',
        'nft',
      ];

      requiredConsentTypes.forEach(type => {
        expect(PREFERENCE_METADATA[type as PrivacyPreferenceKey]).toBeDefined();
      });
    });

    it('should provide fallback for each preference', () => {
      const keys = Object.keys(PREFERENCE_METADATA) as PrivacyPreferenceKey[];

      keys.forEach(key => {
        expect(PREFERENCE_METADATA[key].fallback).toBeDefined();
        expect(PREFERENCE_METADATA[key].fallback.length).toBeGreaterThan(0);
      });
    });
  });
});
