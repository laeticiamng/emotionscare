// @ts-nocheck

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Mode de sélection */
export type SelectionMode = 'single' | 'multiple' | 'range';

/** État de sélection */
export type SelectionState = 'none' | 'some' | 'all';

/** Données utilisateur pour sélection */
export interface SelectableUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  metadata?: Record<string, unknown>;
}

/** Action groupée */
export interface BulkAction {
  id: string;
  label: string;
  icon?: string;
  action: (userIds: string[]) => Promise<void>;
  requireConfirmation?: boolean;
  confirmMessage?: string;
}

/** Historique de sélection */
export interface SelectionHistoryEntry {
  userIds: string[];
  timestamp: Date;
  action: 'select' | 'deselect' | 'clear' | 'selectAll';
}

/** Configuration du hook */
export interface UseSelectedUsersConfig {
  mode?: SelectionMode;
  maxSelection?: number;
  persistSelection?: boolean;
  storageKey?: string;
  enableHistory?: boolean;
  maxHistorySize?: number;
  onSelectionChange?: (selectedIds: string[]) => void;
  filterFn?: (user: SelectableUser) => boolean;
}

const DEFAULT_CONFIG: UseSelectedUsersConfig = {
  mode: 'multiple',
  maxSelection: Infinity,
  persistSelection: false,
  storageKey: 'selected-users',
  enableHistory: true,
  maxHistorySize: 10
};

export const useSelectedUsers = (
  userIds: string[],
  config?: Partial<UseSelectedUsersConfig>
) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // État initial depuis le storage
  const [selectedUsers, setSelectedUsers] = useState<string[]>(() => {
    if (!mergedConfig.persistSelection || typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(mergedConfig.storageKey!);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Filtrer pour ne garder que les IDs valides
        return parsed.filter((id: string) => userIds.includes(id));
      }
    } catch {}
    return [];
  });

  const [history, setHistory] = useState<SelectionHistoryEntry[]>([]);
  const [lastSelected, setLastSelected] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const historyRef = useRef<SelectionHistoryEntry[]>([]);

  // Persister la sélection
  useEffect(() => {
    if (mergedConfig.persistSelection && typeof window !== 'undefined') {
      localStorage.setItem(mergedConfig.storageKey!, JSON.stringify(selectedUsers));
    }
  }, [selectedUsers, mergedConfig.persistSelection, mergedConfig.storageKey]);

  // Notifier les changements
  useEffect(() => {
    mergedConfig.onSelectionChange?.(selectedUsers);
  }, [selectedUsers, mergedConfig.onSelectionChange]);

  // Ajouter à l'historique
  const addToHistory = useCallback((
    userIdsChanged: string[],
    action: SelectionHistoryEntry['action']
  ) => {
    if (!mergedConfig.enableHistory) return;

    const entry: SelectionHistoryEntry = {
      userIds: userIdsChanged,
      timestamp: new Date(),
      action
    };

    setHistory(prev => {
      const newHistory = [entry, ...prev].slice(0, mergedConfig.maxHistorySize);
      historyRef.current = newHistory;
      return newHistory;
    });
  }, [mergedConfig.enableHistory, mergedConfig.maxHistorySize]);

  // Sélectionner un utilisateur
  const selectUser = useCallback((userId: string) => {
    if (!userIds.includes(userId)) return;

    if (mergedConfig.mode === 'single') {
      setSelectedUsers([userId]);
      addToHistory([userId], 'select');
    } else {
      setSelectedUsers(prev => {
        if (prev.includes(userId)) return prev;
        if (prev.length >= mergedConfig.maxSelection!) return prev;
        return [...prev, userId];
      });
      addToHistory([userId], 'select');
    }
    setLastSelected(userId);
  }, [userIds, mergedConfig.mode, mergedConfig.maxSelection, addToHistory]);

  // Désélectionner un utilisateur
  const deselectUser = useCallback((userId: string) => {
    setSelectedUsers(prev => prev.filter(id => id !== userId));
    addToHistory([userId], 'deselect');
  }, [addToHistory]);

  // Toggle sélection
  const toggleUserSelection = useCallback((userId: string, shiftKey?: boolean) => {
    if (!userIds.includes(userId)) return;

    // Mode range avec Shift
    if (shiftKey && mergedConfig.mode === 'multiple' && lastSelected) {
      const startIndex = userIds.indexOf(lastSelected);
      const endIndex = userIds.indexOf(userId);

      if (startIndex !== -1 && endIndex !== -1) {
        const rangeStart = Math.min(startIndex, endIndex);
        const rangeEnd = Math.max(startIndex, endIndex);
        const rangeIds = userIds.slice(rangeStart, rangeEnd + 1);

        setSelectedUsers(prev => {
          const newSelection = new Set(prev);
          rangeIds.forEach(id => newSelection.add(id));
          const result = Array.from(newSelection).slice(0, mergedConfig.maxSelection);
          return result;
        });
        addToHistory(rangeIds, 'select');
        return;
      }
    }

    setSelectedUsers(prev => {
      if (mergedConfig.mode === 'single') {
        return prev.includes(userId) ? [] : [userId];
      }

      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else if (prev.length < mergedConfig.maxSelection!) {
        return [...prev, userId];
      }
      return prev;
    });

    setLastSelected(userId);
    addToHistory([userId], selectedUsers.includes(userId) ? 'deselect' : 'select');
  }, [userIds, selectedUsers, lastSelected, mergedConfig.mode, mergedConfig.maxSelection, addToHistory]);

  // Sélectionner tout
  const selectAll = useCallback(() => {
    const toSelect = userIds.slice(0, mergedConfig.maxSelection);
    setSelectedUsers(toSelect);
    addToHistory(toSelect, 'selectAll');
  }, [userIds, mergedConfig.maxSelection, addToHistory]);

  // Toggle tout
  const toggleSelectAll = useCallback(() => {
    if (selectedUsers.length === userIds.length) {
      setSelectedUsers([]);
      addToHistory(userIds, 'clear');
    } else {
      selectAll();
    }
  }, [selectedUsers.length, userIds, selectAll, addToHistory]);

  // Effacer la sélection
  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
    addToHistory(selectedUsers, 'clear');
    setLastSelected(null);
  }, [selectedUsers, addToHistory]);

  // Sélectionner par filtre
  const selectByFilter = useCallback((filterFn: (id: string) => boolean) => {
    const toSelect = userIds.filter(filterFn).slice(0, mergedConfig.maxSelection);
    setSelectedUsers(toSelect);
    addToHistory(toSelect, 'select');
  }, [userIds, mergedConfig.maxSelection, addToHistory]);

  // Inverser la sélection
  const invertSelection = useCallback(() => {
    const inverted = userIds.filter(id => !selectedUsers.includes(id))
      .slice(0, mergedConfig.maxSelection);
    setSelectedUsers(inverted);
    addToHistory(inverted, 'select');
  }, [userIds, selectedUsers, mergedConfig.maxSelection, addToHistory]);

  // Undo
  const undo = useCallback(() => {
    if (history.length < 2) return;

    const [, previousEntry] = history;
    if (previousEntry) {
      setSelectedUsers(previousEntry.userIds);
      setHistory(prev => prev.slice(1));
    }
  }, [history]);

  // Exécuter une action groupée
  const executeBulkAction = useCallback(async (
    action: BulkAction,
    onComplete?: () => void
  ) => {
    if (selectedUsers.length === 0) return false;

    setIsProcessing(true);
    try {
      await action.action(selectedUsers);
      onComplete?.();
      return true;
    } catch (error) {
      logger.error('Bulk action failed', error as Error, 'SYSTEM');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [selectedUsers]);

  // Récupérer les détails des utilisateurs sélectionnés
  const getSelectedUsersDetails = useCallback(async (): Promise<SelectableUser[]> => {
    if (selectedUsers.length === 0) return [];

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, role, status, metadata')
        .in('id', selectedUsers);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Failed to fetch selected users details', error as Error, 'SYSTEM');
      return [];
    }
  }, [selectedUsers]);

  // État de sélection
  const selectionState = useMemo((): SelectionState => {
    if (selectedUsers.length === 0) return 'none';
    if (selectedUsers.length === userIds.length) return 'all';
    return 'some';
  }, [selectedUsers.length, userIds.length]);

  // Statistiques
  const stats = useMemo(() => ({
    selectedCount: selectedUsers.length,
    totalCount: userIds.length,
    percentage: userIds.length > 0
      ? Math.round((selectedUsers.length / userIds.length) * 100)
      : 0,
    remainingSlots: mergedConfig.maxSelection! - selectedUsers.length,
    canSelectMore: selectedUsers.length < mergedConfig.maxSelection!
  }), [selectedUsers.length, userIds.length, mergedConfig.maxSelection]);

  // Vérifications
  const allSelected = userIds.length > 0 && selectedUsers.length === userIds.length;
  const hasSelectedUsers = selectedUsers.length > 0;
  const isSelected = useCallback((userId: string) => selectedUsers.includes(userId), [selectedUsers]);
  const canUndo = history.length > 1;

  return {
    // État
    selectedUsers,
    selectionState,
    allSelected,
    hasSelectedUsers,
    isProcessing,

    // Sélection individuelle
    selectUser,
    deselectUser,
    toggleUserSelection,
    isSelected,

    // Sélection groupée
    selectAll,
    toggleSelectAll,
    clearSelection,
    selectByFilter,
    invertSelection,

    // Historique
    history: mergedConfig.enableHistory ? history : [],
    undo,
    canUndo,

    // Actions groupées
    executeBulkAction,
    getSelectedUsersDetails,

    // Stats
    stats,

    // Configuration
    mode: mergedConfig.mode,
    maxSelection: mergedConfig.maxSelection
  };
};

/** Hook pour actions groupées prédéfinies */
export function useUserBulkActions() {
  const deleteUsers = useCallback(async (userIds: string[]) => {
    // Soft delete
    await supabase
      .from('users')
      .update({ status: 'deleted', deleted_at: new Date().toISOString() })
      .in('id', userIds);
  }, []);

  const activateUsers = useCallback(async (userIds: string[]) => {
    await supabase
      .from('users')
      .update({ status: 'active' })
      .in('id', userIds);
  }, []);

  const deactivateUsers = useCallback(async (userIds: string[]) => {
    await supabase
      .from('users')
      .update({ status: 'inactive' })
      .in('id', userIds);
  }, []);

  const updateRole = useCallback(async (userIds: string[], role: string) => {
    await supabase
      .from('users')
      .update({ role })
      .in('id', userIds);
  }, []);

  return {
    deleteUsers,
    activateUsers,
    deactivateUsers,
    updateRole,
    actions: [
      { id: 'activate', label: 'Activer', action: activateUsers },
      { id: 'deactivate', label: 'Désactiver', action: deactivateUsers },
      { id: 'delete', label: 'Supprimer', action: deleteUsers, requireConfirmation: true }
    ] as BulkAction[]
  };
}

export default useSelectedUsers;
