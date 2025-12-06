import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';

const FAVORITES_STORAGE_KEY = 'journal-favorites';

/**
 * Hook pour gérer les notes favorites
 * Utilise localStorage pour la persistance
 */
export function useJournalFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Persister dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      logger.error('Failed to save favorites', error as Error, 'UI');
    }
  }, [favorites]);

  const toggleFavorite = useCallback((noteId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((noteId: string) => {
    return favorites.has(noteId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
  }, []);

  const getFavoritesCount = useCallback(() => {
    return favorites.size;
  }, [favorites]);

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    clearFavorites,
    getFavoritesCount,
  };
}
