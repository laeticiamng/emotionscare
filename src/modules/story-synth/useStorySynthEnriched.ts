/**
 * Hook enrichi Story Synth - Gestion complète des sessions de narration
 * @module story-synth
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { StoryTheme, StoryTone, StoryContent, StorySynthStats, StoryPov, StoryStyle } from './types';
import { synthParagraphs } from '@/lib/story-synth/templates';
import { downloadText } from '@/lib/story-synth/export';

// ============================================================================
// TYPES
// ============================================================================

export interface StorySynthSessionEnriched {
  id: string;
  user_id: string;
  theme: StoryTheme | null;
  tone: StoryTone | null;
  story_theme: string | null;
  story_content: string | null;
  choices_made: any[] | null;
  emotion_tags: string[] | null;
  duration_seconds: number | null;
  reading_duration_seconds: number | null;
  is_favorite: boolean;
  user_context: string | null;
  created_at: string;
  updated_at: string | null;
  completed_at: string | null;
}

export interface StoryGenerationConfig {
  theme: StoryTheme;
  tone: StoryTone;
  pov: StoryPov;
  style: StoryStyle;
  protagonist: string;
  location: string;
  length: number;
  seed?: string;
  userContext?: string;
  ambient?: string;
}

export interface StorySynthAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

// ============================================================================
// ACHIEVEMENTS DEFINITIONS
// ============================================================================

const ACHIEVEMENTS_DEF = [
  { id: 'first_story', name: 'Premier récit', description: 'Lire votre première histoire', icon: '📖', condition: (s: StorySynthStats) => s.total_stories_read >= 1 },
  { id: 'series_5', name: 'Série de 5', description: 'Lire 5 histoires', icon: '🔥', condition: (s: StorySynthStats) => s.total_stories_read >= 5 },
  { id: 'reading_30', name: '30 min lecture', description: 'Cumuler 30 minutes de lecture', icon: '⏰', condition: (s: StorySynthStats) => s.total_reading_time_minutes >= 30 },
  { id: 'explorer', name: 'Explorateur', description: 'Lire 10 histoires', icon: '🏆', condition: (s: StorySynthStats) => s.total_stories_read >= 10 },
  { id: 'deep_reader', name: 'Lecteur profond', description: 'Cumuler 1 heure de lecture', icon: '📚', condition: (s: StorySynthStats) => s.total_reading_time_minutes >= 60 },
  { id: 'completionist', name: 'Perfectionniste', description: '100% de complétion', icon: '✨', condition: (s: StorySynthStats) => s.completion_rate >= 1 && s.total_stories_read >= 5 },
];

// ============================================================================
// HOOK
// ============================================================================

export function useStorySynthEnriched(userId?: string) {
  const queryClient = useQueryClient();
  const [currentStory, setCurrentStory] = useState<StoryContent | null>(null);
  const [currentConfig, setCurrentConfig] = useState<StoryGenerationConfig | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);

  // --------------------------------------------------------------------------
  // QUERIES
  // --------------------------------------------------------------------------

  const { data: sessions = [], isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['story-synth-sessions', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('story_synth_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as StorySynthSessionEnriched[];
    },
    enabled: !!userId,
  });

  // Compute stats from sessions
  const stats: StorySynthStats = {
    total_stories_read: sessions.filter(s => s.completed_at).length,
    total_reading_time_minutes: Math.round(
      sessions.reduce((sum, s) => sum + (s.reading_duration_seconds || s.duration_seconds || 0), 0) / 60
    ),
    favorite_theme: getMostFrequent(sessions.filter(s => s.completed_at).map(s => s.theme).filter(Boolean) as StoryTheme[]),
    favorite_tone: getMostFrequent(sessions.filter(s => s.completed_at).map(s => s.tone).filter(Boolean) as StoryTone[]),
    completion_rate: sessions.length > 0 
      ? sessions.filter(s => s.completed_at).length / sessions.length 
      : 0,
  };

  // Achievements
  const achievements: StorySynthAchievement[] = ACHIEVEMENTS_DEF.map(def => ({
    id: def.id,
    name: def.name,
    description: def.description,
    icon: def.icon,
    unlocked: def.condition(stats),
  }));

  // Weekly progress
  const weeklyProgress = sessions.filter(s => {
    const date = new Date(s.created_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo && s.completed_at;
  }).length;

  // Streak calculation
  const streak = calculateStreak(sessions);

  // --------------------------------------------------------------------------
  // MUTATIONS
  // --------------------------------------------------------------------------

  const createSessionMutation = useMutation({
    mutationFn: async (config: StoryGenerationConfig) => {
      if (!userId) throw new Error('User not authenticated');

      const paragraphs = synthParagraphs({
        genre: config.theme,
        pov: config.pov,
        hero: config.protagonist,
        place: config.location,
        length: config.length,
        style: config.style,
        seed: config.seed,
      });

      const storyContent: StoryContent = {
        title: `${config.protagonist} et ${config.location}`,
        paragraphs: paragraphs.map((text, i) => ({
          id: `p-${i}`,
          text,
          emphasis: i === 0 ? 'strong' : i === paragraphs.length - 1 ? 'soft' : 'normal',
        })),
        estimated_duration_seconds: paragraphs.length * 8,
        ambient_music: config.ambient !== 'aucun' ? config.ambient : undefined,
      };

      const { data, error } = await supabase
        .from('story_synth_sessions')
        .insert({
          user_id: userId,
          theme: config.theme,
          tone: config.tone,
          story_theme: config.theme,
          story_content: JSON.stringify(storyContent),
          user_context: config.userContext,
          reading_duration_seconds: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return { session: data as StorySynthSessionEnriched, story: storyContent };
    },
    onSuccess: ({ story }) => {
      setCurrentStory(story);
      setIsReading(true);
      setReadingStartTime(Date.now());
      toast.success('Histoire générée !');
      queryClient.invalidateQueries({ queryKey: ['story-synth-sessions', userId] });
    },
    onError: () => {
      toast.error('Erreur lors de la génération');
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async ({ sessionId, durationSeconds }: { sessionId: string; durationSeconds: number }) => {
      const { data, error } = await supabase
        .from('story_synth_sessions')
        .update({
          reading_duration_seconds: durationSeconds,
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['story-synth-sessions', userId] });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('story_synth_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Histoire supprimée');
      queryClient.invalidateQueries({ queryKey: ['story-synth-sessions', userId] });
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) throw new Error('Session not found');

      const { data, error } = await supabase
        .from('story_synth_sessions')
        .update({ is_favorite: !session.is_favorite })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      toast.success(data.is_favorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
      queryClient.invalidateQueries({ queryKey: ['story-synth-sessions', userId] });
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  // --------------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------------

  const generateStory = useCallback((config: StoryGenerationConfig) => {
    setIsGenerating(true);
    setCurrentConfig(config);
    createSessionMutation.mutate(config, {
      onSettled: () => setIsGenerating(false),
    });
  }, [createSessionMutation]);

  const completeReading = useCallback((duration: number) => {
    setIsReading(false);
    setReadingStartTime(null);

    // Find most recent session to complete
    const latestSession = sessions[0];
    if (latestSession && !latestSession.completed_at) {
      completeSessionMutation.mutate({
        sessionId: latestSession.id,
        durationSeconds: duration,
      });
    }

    toast.success(`Lecture terminée ! ${Math.round(duration / 60)} min de lecture.`);
  }, [sessions, completeSessionMutation]);

  const saveCurrentStory = useCallback(() => {
    if (!currentStory || !userId) return;
    toast.success('Histoire sauvegardée dans votre bibliothèque !');
  }, [currentStory, userId]);

  const exportStory = useCallback((sessionId?: string) => {
    if (sessionId) {
      const session = sessions.find(s => s.id === sessionId);
      if (session?.story_content) {
        try {
          const content = typeof session.story_content === 'string' 
            ? JSON.parse(session.story_content) 
            : session.story_content;
          const filename = `histoire-${session.theme || 'story'}-${new Date(session.created_at).toLocaleDateString('fr-FR')}.txt`;
          const paragraphs = content.paragraphs?.map((p: any) => p.text) || [content];
          downloadText(filename, paragraphs);
          toast.success('Histoire exportée !');
        } catch {
          toast.error('Erreur lors de l\'export');
        }
      }
    } else if (currentStory) {
      const filename = `${currentStory.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
      const content = currentStory.paragraphs.map(p => p.text);
      downloadText(filename, content);
      toast.success('Histoire exportée !');
    }
  }, [sessions, currentStory]);

  const readFromLibrary = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session?.story_content) {
      try {
        const content = typeof session.story_content === 'string' 
          ? JSON.parse(session.story_content) 
          : session.story_content;
        
        setCurrentStory(content);
        setCurrentConfig({
          theme: (session.theme as StoryTheme) || 'calme',
          tone: (session.tone as StoryTone) || 'apaisant',
          pov: 'je',
          style: 'sobre',
          protagonist: 'Alex',
          location: 'la ville',
          length: content.paragraphs?.length || 5,
          ambient: content.ambient_music,
        });
        setIsReading(true);
        setReadingStartTime(Date.now());
      } catch {
        toast.error('Impossible de charger cette histoire');
      }
    } else {
      toast.info('Contenu de l\'histoire non disponible');
    }
  }, [sessions]);

  const closeReader = useCallback(() => {
    setIsReading(false);
    setCurrentStory(null);
    setCurrentConfig(null);
    setReadingStartTime(null);
  }, []);

  // --------------------------------------------------------------------------
  // RETURN
  // --------------------------------------------------------------------------

  return {
    // Data
    sessions,
    stats,
    achievements,
    weeklyProgress,
    streak,
    currentStory,
    currentConfig,
    
    // State
    isReading,
    isGenerating,
    isLoadingHistory,
    readingStartTime,

    // Actions
    generateStory,
    completeReading,
    saveCurrentStory,
    exportStory,
    readFromLibrary,
    closeReader,
    deleteSession: deleteSessionMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    refetchHistory,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function getMostFrequent<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  const counts = arr.reduce((acc, val) => {
    acc.set(val, (acc.get(val) || 0) + 1);
    return acc;
  }, new Map<T, number>());
  
  let maxCount = 0;
  let mostFrequent: T | null = null;
  counts.forEach((count, val) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = val;
    }
  });
  return mostFrequent;
}

function calculateStreak(sessions: StorySynthSessionEnriched[]): number {
  const completedDates = sessions
    .filter(s => s.completed_at)
    .map(s => new Date(s.completed_at!).toDateString())
    .filter((date, i, arr) => arr.indexOf(date) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (completedDates.length === 0) return 0;

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  // Check if streak is active (today or yesterday)
  if (completedDates[0] !== today && completedDates[0] !== yesterday) {
    return 0;
  }

  let currentDate = new Date(completedDates[0]);
  for (const dateStr of completedDates) {
    const date = new Date(dateStr);
    const diffDays = Math.round((currentDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays <= 1) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }

  return streak;
}

export type UseStorySynthEnrichedReturn = ReturnType<typeof useStorySynthEnriched>;
