/**
 * useJournalAutoSave - Hook pour sauvegarde automatique du journal
 * Sauvegarde toutes les 30 secondes si du texte a été modifié
 * @version 1.0.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/logger';

const AUTOSAVE_INTERVAL = 30_000; // 30 secondes
const AUTOSAVE_KEY = 'journal.autosave';

interface AutoSaveState {
  text: string;
  tags: string[];
  savedAt: string;
}

interface UseJournalAutoSaveOptions {
  text: string;
  tags: string[];
  onRestore?: (state: AutoSaveState) => void;
}

interface UseJournalAutoSaveReturn {
  hasAutoSave: boolean;
  lastSavedAt: Date | null;
  restore: () => AutoSaveState | null;
  clear: () => void;
  isSaving: boolean;
}

export function useJournalAutoSave({
  text,
  tags,
  onRestore,
}: UseJournalAutoSaveOptions): UseJournalAutoSaveReturn {
  const [hasAutoSave, setHasAutoSave] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedTextRef = useRef<string>('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Vérifier s'il existe une sauvegarde au montage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        const parsed: AutoSaveState = JSON.parse(saved);
        if (parsed.text && parsed.text.trim().length > 0) {
          setHasAutoSave(true);
          // Proposer la restauration
          if (onRestore) {
            onRestore(parsed);
          }
        }
      }
    } catch (error) {
      logger.warn('Failed to check autosave', { error }, 'JOURNAL');
    }
  }, [onRestore]);

  // Fonction de sauvegarde
  const save = useCallback(() => {
    if (!text.trim() || text === lastSavedTextRef.current) {
      return;
    }

    setIsSaving(true);
    try {
      const state: AutoSaveState = {
        text: text.trim(),
        tags,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state));
      lastSavedTextRef.current = text;
      setLastSavedAt(new Date());
      setHasAutoSave(true);
      logger.debug('Journal auto-saved', { length: text.length }, 'JOURNAL');
    } catch (error) {
      logger.error('Failed to auto-save journal', { error }, 'JOURNAL');
    } finally {
      setIsSaving(false);
    }
  }, [text, tags]);

  // Intervalle de sauvegarde automatique
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      save();
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [save]);

  // Sauvegarder avant fermeture de la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (text.trim() && text !== lastSavedTextRef.current) {
        const state: AutoSaveState = {
          text: text.trim(),
          tags,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [text, tags]);

  // Restaurer une sauvegarde
  const restore = useCallback((): AutoSaveState | null => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        return JSON.parse(saved) as AutoSaveState;
      }
    } catch (error) {
      logger.error('Failed to restore autosave', { error }, 'JOURNAL');
    }
    return null;
  }, []);

  // Effacer la sauvegarde
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
      lastSavedTextRef.current = '';
      setHasAutoSave(false);
      setLastSavedAt(null);
      logger.debug('Journal autosave cleared', {}, 'JOURNAL');
    } catch (error) {
      logger.error('Failed to clear autosave', { error }, 'JOURNAL');
    }
  }, []);

  return {
    hasAutoSave,
    lastSavedAt,
    restore,
    clear,
    isSaving,
  };
}
