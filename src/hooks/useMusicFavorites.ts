/**
 * useMusicFavorites Hook
 * Gestion des favoris avec sync DB
 */

import { useState, useEffect, useCallback } from 'react';
import {
  saveFavorite,
  removeFavorite,
  getUserFavorites,
  syncFavorites,
} from '@/services/music/favorites-service';
import type { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useMusicFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      
      if (session) {
        // Reload favorites on login
        loadFavorites();
      } else {
        // Clear favorites on logout
        setFavorites([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load favorites from DB
  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const dbFavorites = await getUserFavorites();
      const favoriteIds = dbFavorites.map(f => f.track_id);
      setFavorites(favoriteIds);
      logger.debug('Favorites loaded', { count: favoriteIds.length }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to load favorites', error as Error, 'MUSIC');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (track: MusicTrack) => {
    if (!isAuthenticated) {
      toast.error('Connecte-toi pour sauvegarder tes favoris');
      return;
    }

    const isFav = favorites.includes(track.id);

    // Optimistic update
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== track.id));
    } else {
      setFavorites(prev => [...prev, track.id]);
    }

    try {
      if (isFav) {
        const result = await removeFavorite(track.id);
        if (!result.success) {
          // Rollback on error
          setFavorites(prev => [...prev, track.id]);
          toast.error('Erreur lors de la suppression du favori');
        } else {
          toast.success('Retiré des favoris');
        }
      } else {
        const result = await saveFavorite(track);
        if (!result.success) {
          // Rollback on error
          setFavorites(prev => prev.filter(id => id !== track.id));
          toast.error('Erreur lors de l\'ajout aux favoris');
        } else {
          toast.success('Ajouté aux favoris ❤️');
        }
      }
    } catch (error) {
      // Rollback on error
      if (isFav) {
        setFavorites(prev => [...prev, track.id]);
      } else {
        setFavorites(prev => prev.filter(id => id !== track.id));
      }
      logger.error('Toggle favorite failed', error as Error, 'MUSIC');
      toast.error('Une erreur est survenue');
    }
  }, [favorites, isAuthenticated]);

  // Check if track is favorite
  const isFavorite = useCallback((trackId: string): boolean => {
    return favorites.includes(trackId);
  }, [favorites]);

  // Sync with DB (useful after offline/online transitions)
  const syncWithDB = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const synced = await syncFavorites(favorites);
      setFavorites(synced);
      logger.debug('Favorites synced with DB', { count: synced.length }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to sync favorites', error as Error, 'MUSIC');
    }
  }, [favorites, isAuthenticated]);

  return {
    favorites,
    isLoading,
    isAuthenticated,
    toggleFavorite,
    isFavorite,
    syncWithDB,
    refresh: loadFavorites,
  };
};
