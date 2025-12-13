/**
 * useStorageMigration - Hook centralisé pour migrer tous les localStorage restants vers Supabase
 * Gère la migration automatique au login + préserve le fallback offline
 */

import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

// Liste exhaustive des clés localStorage à migrer
const MIGRATION_KEYS = [
  // Theme & UI
  'theme',
  'i18nextLng',
  
  // Accessibility
  'accessibility-settings',
  
  // Coach & Sessions
  'coachMessages',
  'coach-conversation-history',
  
  // Journal
  'pending_memos',
  'journal_prompt_timestamp',
  'journal_drafts',
  
  // Music
  'music:cachedTracks',
  'music:integrations',
  'music:preset',
  'music:favorites',
  'music:history',
  
  // Orchestration & WHO-5
  'orchestration:snooze',
  'who5:lastPrompt',
  
  // Gamification & Tips
  'dismissed-tips',
  'glow-tip-favorites',
  
  // Tours & Onboarding
  'emotional-park-tour-completed',
  'emotional-profile',
  'onboarding-completed',
  'tour-completed',
  
  // Preferences
  'user-preferences',
  'notification-preferences',
  'privacy-preferences',
  
  // Session data
  'session-events',
  'community-bookmarks',
  'community-reactions',
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
      return { migrated: [], failed: [], skipped: MIGRATION_KEYS.slice() };
    }

    const migrated: string[] = [];
    const failed: string[] = [];
    const skipped: string[] = [];

    setStatus('migrating');

    for (const key of MIGRATION_KEYS) {
      try {
        const localData = localStorage.getItem(key);
        
        if (!localData) {
          skipped.push(key);
          continue;
        }

        // Vérifier si déjà migré dans Supabase
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

        if (error) {
          throw error;
        }

        // Migration réussie - supprimer du localStorage
        localStorage.removeItem(key);
        migrated.push(key);
        
      } catch (e) {
        logger.error(`[StorageMigration] Failed to migrate ${key}:`, e, 'STORAGE');
        failed.push(key);
      }
    }

    const result = { migrated, failed, skipped };
    setResult(result);
    setStatus(migrated.length > 0 || failed.length === 0 ? 'completed' : 'error');

    logger.info('[StorageMigration] Migration complete', { 
      migrated: migrated.length, 
      failed: failed.length, 
      skipped: skipped.length 
    }, 'STORAGE');

    return result;
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
