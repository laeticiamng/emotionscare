/**
 * useStorageMigration - Hook centralisé pour migrer tous les localStorage vers Supabase
 * Migration automatique au login + fallback offline
 */

import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

// Liste exhaustive de TOUTES les clés localStorage à migrer
const MIGRATION_KEYS = [
  // Theme & UI
  'theme',
  'i18nextLng',
  'userMode',
  
  // Accessibility
  'accessibility-settings',
  
  // Coach & Sessions
  'coachMessages',
  'coach-conversation-history',
  'unified_coach_conversations',
  
  // Journal
  'pending_memos',
  'journal_prompt_timestamp',
  'journal_drafts',
  
  // Music & Audio
  'music:cachedTracks',
  'music:integrations',
  'music:preset',
  'music:favorites',
  'music:history',
  'music:lastPlayed',
  'music:email',
  'music:audio-urls-cache',
  'adaptive-music:persisted-session',
  'adaptive-music:favorites-sync',
  'sleep_preset',
  
  // Orchestration & WHO-5
  'orchestration:snooze',
  'who5:lastPrompt',
  'who5.invite.snooze_until',
  
  // Gamification & Tips
  'dismissed-tips',
  'glow-tip-favorites',
  
  // Tours & Onboarding
  'emotional-park-tour-completed',
  'emotional-profile',
  'onboarding-completed',
  'tour-completed',
  
  // Preferences & Consent
  'user-preferences',
  'notification-preferences',
  'privacy-preferences',
  'emotionscare.consent.preferences',
  'predictiveAnalyticsEnabled',
  'predictionEnabled',
  
  // Session & Mood data
  'session-events',
  'community-bookmarks',
  'community-reactions',
  'current_mood',
  'hume-emotion-history',
  
  // Flash Glow
  'flash_glow_suds_cooldown',
  'flash_glow_suds_opt_in',
  
  // Community banners
  'community_nudge_ucla3_last_seen',
  'community_nudge_mspss_last_seen',
  
  // Voice & Help
  'voice_command_history',
  'help_search_history',
  
  // Dashboard
  'sleep_reminder',
  
  // Sort preferences (dynamic keys handled separately)
  'sort-preferences',
] as const;

export type MigrationStatus = 'idle' | 'migrating' | 'completed' | 'error';

interface MigrationResult {
  migrated: string[];
  failed: string[];
  skipped: string[];
}

export function useStorageMigration() {
  const { user } = useAuth();
  const [status, setStatus] = useState<MigrationStatus>('idle');
  const [result, setResult] = useState<MigrationResult | null>(null);

  const migrateAll = useCallback(async (): Promise<MigrationResult> => {
    if (!user) {
      return { migrated: [], failed: [], skipped: [...MIGRATION_KEYS] };
    }

    const migrated: string[] = [];
    const failed: string[] = [];
    const skipped: string[] = [];

    setStatus('migrating');

    // Collecter toutes les clés à migrer (incluant clés dynamiques)
    const allKeys = new Set<string>(MIGRATION_KEYS);
    
    // Ajouter les clés dynamiques de sort-preferences
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sort-preferences:') || 
            key.startsWith('banner-cooldown:') ||
            key.startsWith('_sec_')) {
          allKeys.add(key);
        }
      });
    }

    for (const key of allKeys) {
      try {
        const localData = localStorage.getItem(key);
        
        if (!localData) {
          skipped.push(key);
          continue;
        }

        // Ignorer les clés sensibles qui ne doivent pas être migrées
        if (key.startsWith('_sec_') || key === 'auth_session' || key === 'auth_token') {
          skipped.push(key);
          continue;
        }

        // Vérifier si déjà migré
        const { data: existing } = await supabase
          .from('user_settings')
          .select('id')
          .eq('user_id', user.id)
          .eq('key', key)
          .maybeSingle();

        if (existing) {
          skipped.push(key);
          continue;
        }

        // Parser la valeur
        let value: unknown;
        try {
          value = JSON.parse(localData);
        } catch {
          value = localData;
        }

        // Insérer dans Supabase
        const { error } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            key,
            value: JSON.stringify(value),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        // Migration réussie - supprimer du localStorage
        localStorage.removeItem(key);
        migrated.push(key);
        
      } catch (e) {
        logger.error(`[StorageMigration] Failed to migrate ${key}:`, e, 'STORAGE');
        failed.push(key);
      }
    }

    const finalResult = { migrated, failed, skipped };
    setResult(finalResult);
    setStatus(migrated.length > 0 || failed.length === 0 ? 'completed' : 'error');

    logger.info('[StorageMigration] Migration complete', { 
      migrated: migrated.length, 
      failed: failed.length, 
      skipped: skipped.length 
    }, 'STORAGE');

    return finalResult;
  }, [user]);

  // Auto-migration au login
  useEffect(() => {
    if (user && status === 'idle') {
      const hasLocalData = MIGRATION_KEYS.some(key => localStorage.getItem(key) !== null);
      
      if (hasLocalData) {
        migrateAll();
      } else {
        setStatus('completed');
      }
    }
  }, [user, status, migrateAll]);

  return {
    status,
    result,
    migrateAll,
    isComplete: status === 'completed',
    hasPendingMigration: status === 'idle' && user !== null
  };
}

export default useStorageMigration;
