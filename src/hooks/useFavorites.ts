/**
 * useFavorites - Hook pour gérer les favoris persistants
 * Synchronise avec Supabase pour cross-device
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface UseFavoritesOptions {
  type: 'module' | 'activity' | 'track' | 'journal';
}

interface Favorite {
  id: string;
  item_id: string;
  item_type: string;
  created_at: string;
}

interface UseFavoritesReturn {
  favorites: string[];
  isLoading: boolean;
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => Promise<void>;
  addFavorite: (itemId: string) => Promise<void>;
  removeFavorite: (itemId: string) => Promise<void>;
}

export function useFavorites({ type }: UseFavoritesOptions): UseFavoritesReturn {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les favoris
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) {
        // Fallback localStorage pour les non-connectés
        const stored = localStorage.getItem(`favorites_${type}`);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('item_id')
          .eq('user_id', user.id)
          .eq('item_type', type);

        if (error) throw error;

        setFavorites(data?.map(f => f.item_id) || []);
      } catch (error) {
        logger.error('Failed to load favorites', { error, type }, 'FAVORITES');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user?.id, type]);

  const isFavorite = useCallback((itemId: string) => {
    return favorites.includes(itemId);
  }, [favorites]);

  const addFavorite = useCallback(async (itemId: string) => {
    if (favorites.includes(itemId)) return;

    const newFavorites = [...favorites, itemId];
    setFavorites(newFavorites);

    if (!user?.id) {
      localStorage.setItem(`favorites_${type}`, JSON.stringify(newFavorites));
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          item_id: itemId,
          item_type: type
        });

      if (error) throw error;
      
      logger.debug('Favorite added', { itemId, type }, 'FAVORITES');
    } catch (error) {
      // Rollback
      setFavorites(favorites);
      logger.error('Failed to add favorite', { error, itemId }, 'FAVORITES');
    }
  }, [favorites, user?.id, type]);

  const removeFavorite = useCallback(async (itemId: string) => {
    if (!favorites.includes(itemId)) return;

    const newFavorites = favorites.filter(id => id !== itemId);
    setFavorites(newFavorites);

    if (!user?.id) {
      localStorage.setItem(`favorites_${type}`, JSON.stringify(newFavorites));
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('item_type', type);

      if (error) throw error;
      
      logger.debug('Favorite removed', { itemId, type }, 'FAVORITES');
    } catch (error) {
      // Rollback
      setFavorites(favorites);
      logger.error('Failed to remove favorite', { error, itemId }, 'FAVORITES');
    }
  }, [favorites, user?.id, type]);

  const toggleFavorite = useCallback(async (itemId: string) => {
    if (isFavorite(itemId)) {
      await removeFavorite(itemId);
    } else {
      await addFavorite(itemId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite
  };
}
