// @ts-nocheck
import { useCallback } from 'react';
import { useModuleProgress } from './useModuleProgress';

/**
 * Hook spécialisé pour les modules de type Collection
 * (Avatar Flow, Mood Mixer, Story Synth, etc.)
 */
export const useCollectionModule = (moduleName: string) => {
  const {
    progress,
    addPoints,
    incrementCompleted,
    updateProgressData,
    unlockAchievement,
    isLoading
  } = useModuleProgress(moduleName);

  const collection = (progress?.progress_data?.collection || []) as any[];
  const totalPoints = progress?.total_points || 0;
  const level = progress?.level || 1;

  const saveItem = useCallback(async (
    item: any,
    points: number = 25,
    achievementChecks: { count: number; type: string; title: string; emoji: string }[] = []
  ) => {
    // Add to collection
    const newCollection = [...collection, {
      ...item,
      savedAt: new Date().toISOString(),
      id: item.id || Date.now().toString()
    }];

    await updateProgressData({
      collection: newCollection,
      lastSaved: new Date().toISOString()
    });

    // Add points
    await addPoints(points);
    await incrementCompleted();

    // Check for achievements
    for (const check of achievementChecks) {
      if (newCollection.length === check.count) {
        await unlockAchievement(check.type, {
          title: check.title,
          emoji: check.emoji
        });
      }
    }

    return newCollection.length;
  }, [collection, addPoints, incrementCompleted, updateProgressData, unlockAchievement]);

  const deleteItem = useCallback(async (itemId: string) => {
    const newCollection = collection.filter((item: any) => item.id !== itemId);
    await updateProgressData({
      collection: newCollection
    });
  }, [collection, updateProgressData]);

  const updateItem = useCallback(async (itemId: string, updates: any) => {
    const newCollection = collection.map((item: any) =>
      item.id === itemId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    );
    
    await updateProgressData({
      collection: newCollection
    });
  }, [collection, updateProgressData]);

  const getItemById = useCallback((itemId: string) => {
    return collection.find((item: any) => item.id === itemId);
  }, [collection]);

  const getItemsByType = useCallback((type: string) => {
    return collection.filter((item: any) => item.type === type);
  }, [collection]);

  return {
    progress,
    collection,
    totalPoints,
    level,
    isLoading,
    saveItem,
    deleteItem,
    updateItem,
    getItemById,
    getItemsByType,
    unlockAchievement
  };
};
