/**
 * Consent Management Service
 * GDPR Article 7 - Conditions for consent
 * Corrigé: Suppression de l'appel API externe pour IP (respect vie privée)
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export type ConsentType =
  | 'terms_of_service'
  | 'privacy_policy'
  | 'data_processing'
  | 'marketing_emails'
  | 'analytics'
  | 'cookies'
  | 'third_party_sharing'
  | 'ai_processing'
  | 'medical_data';

export interface ConsentRecord {
  id: string;
  user_id: string;
  consent_type: ConsentType;
  version: string;
  granted: boolean;
  granted_at: string | null;
  revoked_at: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ConsentRequest {
  consent_type: ConsentType;
  version: string;
  granted: boolean;
  metadata?: Record<string, any>;
}

export class ConsentManagementService {
  /**
   * Record user consent
   */
  static async recordConsent(
    userId: string,
    request: ConsentRequest
  ): Promise<ConsentRecord> {
    try {
      // Générer un hash anonyme au lieu d'utiliser l'IP réelle
      const anonymousHash = await this.generateAnonymousHash();
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'server';

      const consentData = {
        user_id: userId,
        consent_type: request.consent_type,
        version: request.version,
        granted: request.granted,
        granted_at: request.granted ? new Date().toISOString() : null,
        revoked_at: !request.granted ? new Date().toISOString() : null,
        ip_address: anonymousHash, // Hash anonyme, pas l'IP réelle
        user_agent: userAgent,
        metadata: request.metadata || {},
      };

      // Check if consent record already exists
      const { data: existing, error: fetchError } = await supabase
        .from('consent_records')
        .select('*')
        .eq('user_id', userId)
        .eq('consent_type', request.consent_type)
        .eq('version', request.version)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let data: ConsentRecord;

      if (existing) {
        // Update existing consent
        const { data: updated, error: updateError } = await supabase
          .from('consent_records')
          .update(consentData)
          .eq('id', existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        data = updated as ConsentRecord;
      } else {
        // Create new consent record
        const { data: created, error: createError } = await supabase
          .from('consent_records')
          .insert(consentData)
          .select()
          .single();

        if (createError) throw createError;
        data = created as ConsentRecord;
      }

      logger.info('Consent recorded', {
        userId,
        consentType: request.consent_type,
        granted: request.granted,
      }, 'GDPR');

      return data;
    } catch (error) {
      logger.error('Failed to record consent', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Revoke user consent
   */
  static async revokeConsent(
    userId: string,
    consentType: ConsentType,
    version: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('consent_records')
        .update({
          granted: false,
          revoked_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('consent_type', consentType)
        .eq('version', version);

      if (error) throw error;

      logger.info('Consent revoked', {
        userId,
        consentType,
        version,
      }, 'GDPR');
    } catch (error) {
      logger.error('Failed to revoke consent', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Get all consents for a user
   */
  static async getUserConsents(userId: string): Promise<ConsentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('consent_records')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as ConsentRecord[]) || [];
    } catch (error) {
      logger.error('Failed to get user consents', error, 'GDPR');
      return [];
    }
  }

  /**
   * Get active consents for a user
   */
  static async getActiveConsents(userId: string): Promise<ConsentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('consent_records')
        .select('*')
        .eq('user_id', userId)
        .eq('granted', true)
        .is('revoked_at', null)
        .order('granted_at', { ascending: false });

      if (error) throw error;

      return (data as ConsentRecord[]) || [];
    } catch (error) {
      logger.error('Failed to get active consents', error, 'GDPR');
      return [];
    }
  }

  /**
   * Check if user has granted specific consent
   */
  static async hasConsent(
    userId: string,
    consentType: ConsentType,
    version?: string
  ): Promise<boolean> {
    try {
      let query = supabase
        .from('consent_records')
        .select('granted')
        .eq('user_id', userId)
        .eq('consent_type', consentType)
        .eq('granted', true)
        .is('revoked_at', null);

      if (version) {
        query = query.eq('version', version);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data?.granted === true;
    } catch (error) {
      logger.error('Failed to check consent', error, 'GDPR');
      return false;
    }
  }

  /**
   * Get consent history for a specific type
   */
  static async getConsentHistory(
    userId: string,
    consentType: ConsentType
  ): Promise<ConsentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('consent_records')
        .select('*')
        .eq('user_id', userId)
        .eq('consent_type', consentType)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data as ConsentRecord[]) || [];
    } catch (error) {
      logger.error('Failed to get consent history', error, 'GDPR');
      return [];
    }
  }

  /**
   * Bulk record consents (e.g., during onboarding)
   */
  static async recordMultipleConsents(
    userId: string,
    requests: ConsentRequest[]
  ): Promise<ConsentRecord[]> {
    try {
      const results: ConsentRecord[] = [];

      for (const request of requests) {
        const consent = await this.recordConsent(userId, request);
        results.push(consent);
      }

      return results;
    } catch (error) {
      logger.error('Failed to record multiple consents', error, 'GDPR');
      throw error;
    }
  }

  /**
   * Get consent statistics for a user
   */
  static async getConsentStats(userId: string): Promise<{
    total: number;
    granted: number;
    revoked: number;
    byType: Record<ConsentType, { granted: boolean; version: string } | null>;
  }> {
    try {
      const consents = await this.getUserConsents(userId);

      const stats = {
        total: consents.length,
        granted: consents.filter((c) => c.granted && !c.revoked_at).length,
        revoked: consents.filter((c) => c.revoked_at).length,
        byType: {} as Record<ConsentType, { granted: boolean; version: string } | null>,
      };

      const consentTypes: ConsentType[] = [
        'terms_of_service',
        'privacy_policy',
        'data_processing',
        'marketing_emails',
        'analytics',
        'cookies',
        'third_party_sharing',
        'ai_processing',
        'medical_data',
      ];

      for (const type of consentTypes) {
        const typeConsents = consents.filter((c) => c.consent_type === type);
        if (typeConsents.length > 0) {
          const latest = typeConsents[0];
          stats.byType[type] = {
            granted: latest.granted && !latest.revoked_at,
            version: latest.version,
          };
        } else {
          stats.byType[type] = null;
        }
      }

      return stats;
    } catch (error) {
      logger.error('Failed to get consent stats', error, 'GDPR');
      return {
        total: 0,
        granted: 0,
        revoked: 0,
        byType: {} as Record<ConsentType, { granted: boolean; version: string } | null>,
      };
    }
  }

  /**
   * Generate anonymous hash for audit trail (GDPR compliant)
   * Does NOT use real IP address
   */
  private static async generateAnonymousHash(): Promise<string> {
    try {
      const data = [
        typeof navigator !== 'undefined' ? navigator.language : 'en',
        new Date().toISOString().split('T')[0],
        Math.random().toString(36).substring(7),
      ].join('-');

      // Use Web Crypto API for hashing
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
      }
      
      // Fallback for environments without crypto.subtle
      return 'anon-' + Date.now().toString(36);
    } catch {
      return 'anon-' + Date.now().toString(36);
    }
  }

  /**
   * Helper: Get consent type label
   */
  static getConsentLabel(type: ConsentType): string {
    const labels: Record<ConsentType, string> = {
      terms_of_service: 'Conditions d\'utilisation',
      privacy_policy: 'Politique de confidentialité',
      data_processing: 'Traitement des données',
      marketing_emails: 'Emails marketing',
      analytics: 'Analyse et statistiques',
      cookies: 'Cookies',
      third_party_sharing: 'Partage avec des tiers',
      ai_processing: 'Traitement par IA',
      medical_data: 'Données médicales',
    };

    return labels[type] || type;
  }

  /**
   * Helper: Get consent type description
   */
  static getConsentDescription(type: ConsentType): string {
    const descriptions: Record<ConsentType, string> = {
      terms_of_service:
        'Acceptation des conditions générales d\'utilisation de la plateforme',
      privacy_policy:
        'Consentement au traitement de vos données personnelles selon notre politique de confidentialité',
      data_processing:
        'Autorisation de traiter vos données pour améliorer nos services',
      marketing_emails:
        'Réception d\'emails promotionnels et d\'actualités',
      analytics:
        'Collecte de données d\'utilisation pour améliorer l\'expérience',
      cookies:
        'Utilisation de cookies pour personnaliser votre expérience',
      third_party_sharing:
        'Partage de données avec des partenaires de confiance',
      ai_processing:
        'Utilisation de l\'intelligence artificielle pour analyser vos données',
      medical_data:
        'Traitement de données relatives à votre santé et bien-être',
    };

    return descriptions[type] || '';
  }
}
