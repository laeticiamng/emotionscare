/**
 * Storage Migration Component
 * Migre automatiquement les données sensibles de localStorage vers secure storage
 * S'exécute une seule fois au démarrage de l'application
 */

import { useEffect, useState } from 'react';
import { migrateToSecureStorage } from '@/lib/secureStorage';
import { logger } from '@/lib/logger';

// Liste des clés sensibles à migrer vers secure storage
const SENSITIVE_KEYS = [
  'user_preferences',
  'privacy_settings',
  'accessibility_settings',
  'journal_draft',
  'coach_history',
  'assessment_cache',
];

export const useStorageMigration = () => {
  const [migrationComplete, setMigrationComplete] = useState(false);

  useEffect(() => {
    const runMigration = async () => {
      // Vérifier si migration déjà effectuée
      const migrationFlag = localStorage.getItem('_storage_migration_v1');
      if (migrationFlag === 'completed') {
        setMigrationComplete(true);
        return;
      }

      logger.info('[StorageMigration] Starting migration to secure storage', {}, 'SYSTEM');

      let migrated = 0;
      let errors = 0;

      for (const key of SENSITIVE_KEYS) {
        try {
          const success = await migrateToSecureStorage(key);
          if (success) {
            migrated++;
          }
        } catch (error) {
          errors++;
          logger.error(`[StorageMigration] Failed to migrate ${key}`, error as Error, 'SYSTEM');
        }
      }

      // Marquer la migration comme terminée
      localStorage.setItem('_storage_migration_v1', 'completed');
      setMigrationComplete(true);

      logger.info('[StorageMigration] Migration complete', { migrated, errors }, 'SYSTEM');
    };

    runMigration();
  }, []);

  return migrationComplete;
};

/**
 * Composant de migration (ne rend rien, exécute juste la migration)
 */
export const StorageMigration: React.FC = () => {
  useStorageMigration();
  return null;
};

export default StorageMigration;
