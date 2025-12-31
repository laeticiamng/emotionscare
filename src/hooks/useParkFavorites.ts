/**
 * useParkFavorites - Hook pour gérer les attractions favorites
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface FavoriteAttraction {
  id: string;
  attractionId: string;
  attractionName: string;
  zone: string;
  addedAt: Date;
  visitCount: number;
  lastVisited: Date | null;
  notes?: string;
}

const STORAGE_KEY = 'park_favorites';

export function useParkFavorites() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteAttraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const { data } = await supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', STORAGE_KEY)
            .maybeSingle();

          if (data?.value) {
            const parsed = JSON.parse(data.value);
            setFavorites(parsed.map((f: FavoriteAttraction) => ({
              ...f,
              addedAt: new Date(f.addedAt),
              lastVisited: f.lastVisited ? new Date(f.lastVisited) : null
            })));
          }
        } else {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            setFavorites(parsed.map((f: FavoriteAttraction) => ({
              ...f,
              addedAt: new Date(f.addedAt),
              lastVisited: f.lastVisited ? new Date(f.lastVisited) : null
            })));
          }
        }
      } catch {
        // Use empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Save favorites
  const saveFavorites = useCallback(async (newFavorites: FavoriteAttraction[]) => {
    if (user) {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        key: STORAGE_KEY,
        value: JSON.stringify(newFavorites),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,key' });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
  }, [user]);

  // Add to favorites
  const addFavorite = useCallback(async (
    attractionId: string,
    attractionName: string,
    zone: string
  ) => {
    if (favorites.some(f => f.attractionId === attractionId)) {
      toast({
        title: 'Déjà en favoris',
        description: `${attractionName} est déjà dans vos favoris`
      });
      return;
    }

    const newFavorite: FavoriteAttraction = {
      id: crypto.randomUUID(),
      attractionId,
      attractionName,
      zone,
      addedAt: new Date(),
      visitCount: 0,
      lastVisited: null
    };

    const newFavorites = [...favorites, newFavorite];
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);

    toast({
      title: 'Ajouté aux favoris',
      description: `${attractionName} a été ajouté à vos favoris`
    });
  }, [favorites, saveFavorites, toast]);

  // Remove from favorites
  const removeFavorite = useCallback(async (attractionId: string) => {
    const favorite = favorites.find(f => f.attractionId === attractionId);
    if (!favorite) return;

    const newFavorites = favorites.filter(f => f.attractionId !== attractionId);
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);

    toast({
      title: 'Retiré des favoris',
      description: `${favorite.attractionName} a été retiré de vos favoris`
    });
  }, [favorites, saveFavorites, toast]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (
    attractionId: string,
    attractionName: string,
    zone: string
  ) => {
    const isFav = favorites.some(f => f.attractionId === attractionId);
    if (isFav) {
      await removeFavorite(attractionId);
    } else {
      await addFavorite(attractionId, attractionName, zone);
    }
    return !isFav;
  }, [favorites, addFavorite, removeFavorite]);

  // Check if favorite
  const isFavorite = useCallback((attractionId: string) => {
    return favorites.some(f => f.attractionId === attractionId);
  }, [favorites]);

  // Update visit count
  const recordVisit = useCallback(async (attractionId: string) => {
    const newFavorites = favorites.map(f =>
      f.attractionId === attractionId
        ? { ...f, visitCount: f.visitCount + 1, lastVisited: new Date() }
        : f
    );
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  // Add note to favorite
  const addNote = useCallback(async (attractionId: string, notes: string) => {
    const newFavorites = favorites.map(f =>
      f.attractionId === attractionId ? { ...f, notes } : f
    );
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  // Get favorites by zone
  const getByZone = useCallback((zone: string) => {
    return favorites.filter(f => f.zone === zone);
  }, [favorites]);

  // Get most visited
  const getMostVisited = useCallback((limit = 5) => {
    return [...favorites]
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, limit);
  }, [favorites]);

  // Get recently added
  const getRecentlyAdded = useCallback((limit = 5) => {
    return [...favorites]
      .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
      .slice(0, limit);
  }, [favorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    recordVisit,
    addNote,
    getByZone,
    getMostVisited,
    getRecentlyAdded,
    favoritesCount: favorites.length
  };
}

export default useParkFavorites;
