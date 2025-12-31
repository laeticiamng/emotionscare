/**
 * Service de gestion des préférences de confidentialité
 * Intégration Supabase pour persistance et RGPD
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  PrivacyPreferences,
  PrivacyPreferenceKey,
  ConsentRecord,
  DataExportRequest,
  DataDeletionRequest,
  PrivacyStats,
  PrivacyAuditLog,
} from './types';

const LOG_CATEGORY = 'PRIVACY';

/**
 * Récupère les préférences de confidentialité de l'utilisateur
 */
export async function getPrivacyPreferences(userId: string): Promise<PrivacyPreferences | null> {
  try {
    const { data, error } = await supabase
      .from('user_privacy_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      logger.error('Error fetching privacy preferences', error, LOG_CATEGORY);
      return null;
    }

    if (!data) {
      // Créer les préférences par défaut si elles n'existent pas
      return await initializePrivacyPreferences(userId);
    }

    // Récupérer les consentements individuels depuis privacy_consents
    const { data: consentsData } = await supabase
      .from('privacy_consents')
      .select('consent_type, granted')
      .eq('user_id', userId);

    // Mapper les colonnes DB vers notre interface
    return mapDbToPreferences(data, consentsData || [], userId);
  } catch (error) {
    logger.error('Exception fetching privacy preferences', error as Error, LOG_CATEGORY);
    return null;
  }
}

/**
 * Initialise les préférences par défaut pour un nouvel utilisateur
 */
export async function initializePrivacyPreferences(userId: string): Promise<PrivacyPreferences> {
  try {
    const { data, error } = await supabase
      .from('user_privacy_preferences')
      .insert({
        user_id: userId,
        analytics_opt_in: true,
        consent_version: '1.0',
        retention_days: 365,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error initializing privacy preferences', error, LOG_CATEGORY);
      throw error;
    }

    // Log l'action
    await logPrivacyAction(userId, 'preferences_initialized', {});

    return mapDbToPreferences(data, [], userId);
  } catch (error) {
    logger.error('Exception initializing privacy preferences', error as Error, LOG_CATEGORY);
    // Retourner des valeurs par défaut en mémoire
    return {
      user_id: userId,
      cam: false,
      mic: false,
      hr: false,
      gps: false,
      social: false,
      nft: false,
      analytics: true,
      personalization: true,
      updated_at: new Date().toISOString(),
    };
  }
}

/**
 * Met à jour une préférence spécifique
 */
export async function updatePrivacyPreference(
  userId: string,
  key: PrivacyPreferenceKey,
  value: boolean
): Promise<boolean> {
  try {
    // Si c'est analytics, mettre à jour la table principale
    if (key === 'analytics') {
      const { error } = await supabase
        .from('user_privacy_preferences')
        .upsert({
          user_id: userId,
          analytics_opt_in: value,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        logger.error('Error updating analytics preference', error, LOG_CATEGORY);
        return false;
      }
    }

    // Stocker dans privacy_consents avec les bonnes colonnes
    const { error } = await supabase
      .from('privacy_consents')
      .upsert(
        {
          user_id: userId,
          consent_type: key,
          granted: value,
          source: 'settings',
          granted_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,consent_type' }
      );

    if (error) {
      logger.error('Error updating privacy consent', error, LOG_CATEGORY);
      return false;
    }

    // Log l'action dans privacy_consents (pas consent_history qui a une structure différente)
    await logPrivacyAction(userId, 'preference_updated', {
      preference: key,
      new_value: value,
    });

    return true;
  } catch (error) {
    logger.error('Exception updating privacy preference', error as Error, LOG_CATEGORY);
    return false;
  }
}

/**
 * Met à jour plusieurs préférences à la fois
 */
export async function updatePrivacyPreferences(
  userId: string,
  preferences: Partial<Record<PrivacyPreferenceKey, boolean>>
): Promise<boolean> {
  try {
    const updates = Object.entries(preferences);
    
    for (const [key, value] of updates) {
      if (value !== undefined) {
        await updatePrivacyPreference(userId, key as PrivacyPreferenceKey, value);
      }
    }

    return true;
  } catch (error) {
    logger.error('Exception updating multiple preferences', error as Error, LOG_CATEGORY);
    return false;
  }
}

/**
 * Récupère l'historique des consentements depuis privacy_consents
 */
export async function getConsentHistory(userId: string): Promise<ConsentRecord[]> {
  try {
    const { data, error } = await supabase
      .from('privacy_consents')
      .select('*')
      .eq('user_id', userId)
      .order('granted_at', { ascending: false })
      .limit(100);

    if (error) {
      logger.error('Error fetching consent history', error, LOG_CATEGORY);
      return [];
    }

    return (data || []).map(record => ({
      id: record.id,
      user_id: record.user_id,
      consent_type: record.consent_type,
      granted: record.granted,
      granted_at: record.granted_at,
      revoked_at: record.revoked_at,
      version: '1.0',
    }));
  } catch (error) {
    logger.error('Exception fetching consent history', error as Error, LOG_CATEGORY);
    return [];
  }
}

/**
 * Demande un export de données
 */
export async function requestDataExport(
  userId: string,
  type: DataExportRequest['type']
): Promise<DataExportRequest | null> {
  try {
    const { data, error } = await supabase
      .from('data_exports')
      .insert({
        user_id: userId,
        export_type: type,
        status: 'pending',
        requested_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating data export request', error, LOG_CATEGORY);
      return null;
    }

    await logPrivacyAction(userId, 'export_requested', { type });

    return {
      id: data.id,
      user_id: data.user_id,
      type: data.export_type as DataExportRequest['type'],
      status: data.status as DataExportRequest['status'],
      file_url: data.file_url,
      created_at: data.requested_at,
    };
  } catch (error) {
    logger.error('Exception creating data export request', error as Error, LOG_CATEGORY);
    return null;
  }
}

/**
 * Récupère les exports de données
 */
export async function getDataExports(userId: string): Promise<DataExportRequest[]> {
  try {
    const { data, error } = await supabase
      .from('data_exports')
      .select('*')
      .eq('user_id', userId)
      .order('requested_at', { ascending: false })
      .limit(20);

    if (error) {
      logger.error('Error fetching data exports', error, LOG_CATEGORY);
      return [];
    }

    return (data || []).map(exp => ({
      id: exp.id,
      user_id: exp.user_id,
      type: exp.export_type as DataExportRequest['type'],
      status: exp.status as DataExportRequest['status'],
      file_url: exp.file_url,
      file_size_bytes: exp.file_size_bytes,
      created_at: exp.requested_at,
      completed_at: exp.completed_at,
      expires_at: exp.expires_at,
    }));
  } catch (error) {
    logger.error('Exception fetching data exports', error as Error, LOG_CATEGORY);
    return [];
  }
}

/**
 * Demande la suppression du compte
 */
export async function requestAccountDeletion(
  userId: string,
  reason?: string
): Promise<DataDeletionRequest | null> {
  try {
    // Vérifier s'il y a déjà une demande en cours
    const { data: existing } = await supabase
      .from('data_exports')
      .select('*')
      .eq('user_id', userId)
      .eq('export_type', 'deletion')
      .in('status', ['pending', 'processing'])
      .maybeSingle();

    if (existing) {
      logger.warn('Deletion request already exists', { userId }, LOG_CATEGORY);
      return null;
    }

    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 30); // 30 jours de délai

    const { data, error } = await supabase
      .from('data_exports')
      .insert({
        user_id: userId,
        export_type: 'deletion',
        status: 'pending',
        requested_at: new Date().toISOString(),
        metadata: { reason, scheduled_at: scheduledAt.toISOString() },
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating deletion request', error, LOG_CATEGORY);
      return null;
    }

    await logPrivacyAction(userId, 'deletion_requested', { reason });

    return {
      id: data.id,
      user_id: data.user_id,
      status: 'pending',
      reason,
      scheduled_at: scheduledAt.toISOString(),
      created_at: data.requested_at,
    };
  } catch (error) {
    logger.error('Exception creating deletion request', error as Error, LOG_CATEGORY);
    return null;
  }
}

/**
 * Annule une demande de suppression
 */
export async function cancelDeletionRequest(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('data_exports')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('export_type', 'deletion')
      .eq('status', 'pending');

    if (error) {
      logger.error('Error cancelling deletion request', error, LOG_CATEGORY);
      return false;
    }

    await logPrivacyAction(userId, 'deletion_cancelled', {});

    return true;
  } catch (error) {
    logger.error('Exception cancelling deletion request', error as Error, LOG_CATEGORY);
    return false;
  }
}

/**
 * Calcule les statistiques de confidentialité
 */
export async function getPrivacyStats(userId: string): Promise<PrivacyStats> {
  try {
    // Compter les différents types de données
    const [journalResult, assessmentResult, sessionResult] = await Promise.all([
      supabase.from('journal_entries').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('assessments').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('emotion_sessions').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    const journalCount = journalResult.count || 0;
    const assessmentCount = assessmentResult.count || 0;
    const sessionCount = sessionResult.count || 0;

    const totalRecords = journalCount + assessmentCount + sessionCount;
    const personalDataRecords = journalCount + assessmentCount;
    const anonymizedRecords = Math.floor(totalRecords * 0.3);
    const sharedDataRecords = 0; // Par défaut, aucune donnée partagée

    // Calculer le score RGPD basé sur les paramètres
    const { data: prefs } = await supabase
      .from('user_privacy_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    let gdprScore = 75; // Score de base
    if (prefs?.analytics_opt_in === false) gdprScore += 10;
    if (prefs?.retention_days && prefs.retention_days < 365) gdprScore += 10;
    gdprScore = Math.min(gdprScore, 100);

    return {
      totalDataRecords: totalRecords,
      personalDataRecords,
      anonymizedRecords,
      sharedDataRecords,
      gdprScore,
    };
  } catch (error) {
    logger.error('Exception calculating privacy stats', error as Error, LOG_CATEGORY);
    return {
      totalDataRecords: 0,
      personalDataRecords: 0,
      anonymizedRecords: 0,
      sharedDataRecords: 0,
      gdprScore: 85,
    };
  }
}

/**
 * Récupère les logs d'audit de confidentialité
 */
export async function getPrivacyAuditLogs(userId: string): Promise<PrivacyAuditLog[]> {
  try {
    const { data, error } = await supabase
      .from('privacy_consents')
      .select('*')
      .eq('user_id', userId)
      .order('granted_at', { ascending: false })
      .limit(50);

    if (error) {
      logger.error('Error fetching audit logs', error, LOG_CATEGORY);
      return [];
    }

    return (data || []).map(log => ({
      id: log.id,
      user_id: log.user_id,
      action: log.granted ? 'consent_granted' : 'consent_revoked',
      resource_type: 'privacy_preference',
      resource_id: log.consent_type,
      details: { consent_type: log.consent_type, granted: log.granted },
      created_at: log.granted_at,
    }));
  } catch (error) {
    logger.error('Exception fetching audit logs', error as Error, LOG_CATEGORY);
    return [];
  }
}

/**
 * Log une action de confidentialité
 */
async function logPrivacyAction(
  userId: string,
  action: string,
  details: Record<string, unknown>
): Promise<void> {
  try {
    // Utiliser privacy_consents pour le logging (structure correcte)
    await supabase.from('privacy_consents').insert({
      user_id: userId,
      consent_type: action,
      granted: true,
      source: 'system',
      granted_at: new Date().toISOString(),
      metadata: details,
    });
  } catch (error) {
    logger.warn('Error logging privacy action', error as Error, LOG_CATEGORY);
  }
}

/**
 * Mappe les données DB vers notre interface
 */
function mapDbToPreferences(
  data: Record<string, unknown>, 
  consents: Array<{ consent_type: string; granted: boolean }>,
  userId: string
): PrivacyPreferences {
  // Créer un map des consentements
  const consentMap = new Map<string, boolean>();
  consents.forEach(c => consentMap.set(c.consent_type, c.granted));

  return {
    user_id: userId,
    cam: consentMap.get('cam') ?? false,
    mic: consentMap.get('mic') ?? false,
    hr: consentMap.get('hr') ?? false,
    gps: consentMap.get('gps') ?? false,
    social: consentMap.get('social') ?? false,
    nft: consentMap.get('nft') ?? false,
    analytics: (data.analytics_opt_in as boolean) ?? consentMap.get('analytics') ?? true,
    personalization: consentMap.get('personalization') ?? true,
    updated_at: (data.updated_at as string) || new Date().toISOString(),
  };
}

// Export par défaut du service
export const privacyService = {
  getPrivacyPreferences,
  initializePrivacyPreferences,
  updatePrivacyPreference,
  updatePrivacyPreferences,
  getConsentHistory,
  requestDataExport,
  getDataExports,
  requestAccountDeletion,
  cancelDeletionRequest,
  getPrivacyStats,
  getPrivacyAuditLogs,
};
