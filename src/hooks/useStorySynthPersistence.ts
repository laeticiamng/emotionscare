/**
 * Hook pour persister les histoires Story Synth dans Supabase
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface StorySynthStory {
  id: string;
  title: string;
  content: string;
  intentions: string[];
  audio_url?: string;
  duration_seconds: number;
  is_favorite: boolean;
  play_count: number;
  created_at: string;
}

export function useStorySynthPersistence() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stories, setStories] = useState<StorySynthStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStories = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('story_synth_stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories((data || []) as StorySynthStory[]);
    } catch (error) {
      logger.error('Failed to fetch stories', error as Error, 'STORY_SYNTH');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const saveStory = useCallback(async (story: Omit<StorySynthStory, 'id' | 'created_at' | 'play_count'>) => {
    if (!user) {
      toast({ title: 'Connexion requise', description: 'Connectez-vous pour sauvegarder vos histoires.', variant: 'destructive' });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('story_synth_stories')
        .insert({
          user_id: user.id,
          title: story.title,
          content: story.content,
          intentions: story.intentions,
          audio_url: story.audio_url,
          duration_seconds: story.duration_seconds,
          is_favorite: story.is_favorite
        })
        .select()
        .single();

      if (error) throw error;
      
      setStories(prev => [data as StorySynthStory, ...prev]);
      toast({ title: '✨ Histoire sauvegardée', description: 'Votre histoire a été ajoutée à votre collection.' });
      return data as StorySynthStory;
    } catch (error) {
      logger.error('Failed to save story', error as Error, 'STORY_SYNTH');
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder l\'histoire.', variant: 'destructive' });
      return null;
    }
  }, [user, toast]);

  const toggleFavorite = useCallback(async (storyId: string) => {
    if (!user) return;

    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    try {
      const { error } = await supabase
        .from('story_synth_stories')
        .update({ is_favorite: !story.is_favorite })
        .eq('id', storyId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setStories(prev => prev.map(s => 
        s.id === storyId ? { ...s, is_favorite: !s.is_favorite } : s
      ));
    } catch (error) {
      logger.error('Failed to toggle favorite', error as Error, 'STORY_SYNTH');
    }
  }, [user, stories]);

  const incrementPlayCount = useCallback(async (storyId: string) => {
    if (!user) return;

    try {
      const story = stories.find(s => s.id === storyId);
      if (!story) return;

      const { error } = await supabase
        .from('story_synth_stories')
        .update({ play_count: story.play_count + 1 })
        .eq('id', storyId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setStories(prev => prev.map(s => 
        s.id === storyId ? { ...s, play_count: s.play_count + 1 } : s
      ));
    } catch (error) {
      logger.error('Failed to increment play count', error as Error, 'STORY_SYNTH');
    }
  }, [user, stories]);

  const deleteStory = useCallback(async (storyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('story_synth_stories')
        .delete()
        .eq('id', storyId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setStories(prev => prev.filter(s => s.id !== storyId));
      toast({ title: 'Histoire supprimée' });
    } catch (error) {
      logger.error('Failed to delete story', error as Error, 'STORY_SYNTH');
    }
  }, [user, toast]);

  return {
    stories,
    isLoading,
    fetchStories,
    saveStory,
    toggleFavorite,
    incrementPlayCount,
    deleteStory
  };
}
