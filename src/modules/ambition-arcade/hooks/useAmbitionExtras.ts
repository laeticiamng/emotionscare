/**
 * Hooks pour les fonctionnalités étendues Ambition Arcade
 * Favoris, Ratings, Export, Recommendations
 */
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEYS = {
  favorites: 'ambition_favorites',
  ratings: 'ambition_ratings',
};

// ===================== FAVORITES =====================

export function useAmbitionFavorites() {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((runId: string) => {
    setFavorites(prev => {
      const isCurrentlyFavorite = prev.includes(runId);
      const newFavorites = isCurrentlyFavorite
        ? prev.filter(id => id !== runId)
        : [...prev, runId];
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(newFavorites));
      
      toast({
        title: isCurrentlyFavorite ? '💔 Retiré des favoris' : '❤️ Ajouté aux favoris',
        description: isCurrentlyFavorite 
          ? 'Objectif retiré de vos favoris' 
          : 'Objectif ajouté à vos favoris',
      });
      
      return newFavorites;
    });
  }, [toast]);

  const isFavorite = useCallback((runId: string) => {
    return favorites.includes(runId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}

// ===================== RATINGS =====================

export function useAmbitionRatings() {
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ratings) || '{}');
    } catch {
      return {};
    }
  });

  const rateRun = useCallback((runId: string, rating: number) => {
    const validRating = Math.max(1, Math.min(5, rating));
    setRatings(prev => {
      const newRatings = { ...prev, [runId]: validRating };
      localStorage.setItem(STORAGE_KEYS.ratings, JSON.stringify(newRatings));
      return newRatings;
    });
  }, []);

  const getRating = useCallback((runId: string): number | undefined => {
    return ratings[runId];
  }, [ratings]);

  return { ratings, rateRun, getRating };
}

// ===================== EXPORT =====================

export function useAmbitionExport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportData = useCallback(async () => {
    if (!user?.id) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      // Fetch all runs
      const { data: runs, error: runsError } = await supabase
        .from('ambition_runs')
        .select('*')
        .eq('user_id', user.id);

      if (runsError) throw runsError;

      const runIds = runs?.map(r => r.id) || [];

      // Fetch quests and artifacts
      const [questsRes, artifactsRes] = await Promise.all([
        supabase.from('ambition_quests').select('*').in('run_id', runIds.length > 0 ? runIds : ['none']),
        supabase.from('ambition_artifacts').select('*').in('run_id', runIds.length > 0 ? runIds : ['none']),
      ]);

      const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || '[]');
      const ratings = JSON.parse(localStorage.getItem(STORAGE_KEYS.ratings) || '{}');

      const exportPayload = {
        exportDate: new Date().toISOString(),
        runs: runs || [],
        quests: questsRes.data || [],
        artifacts: artifactsRes.data || [],
        favorites,
        ratings,
      };

      // Download
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ambition_arcade_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: 'Vos données ont été téléchargées',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter vos données',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [user, toast]);

  return { exportData, isExporting };
}

// ===================== RECOMMENDATIONS =====================

export interface RunRecommendation {
  id: string;
  type: 'continue' | 'similar' | 'popular' | 'new';
  title: string;
  description: string;
  tags: string[];
  confidence: number;
  basedOn?: string;
}

export function useAmbitionRecommendations() {
  const { user } = useAuth();
  const { favorites } = useAmbitionFavorites();

  return useQuery({
    queryKey: ['ambition-recommendations', user?.id],
    queryFn: async (): Promise<RunRecommendation[]> => {
      if (!user?.id) return [];

      const { data: runs } = await supabase
        .from('ambition_runs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const recommendations: RunRecommendation[] = [];

      // Continue incomplete runs
      const activeRuns = runs?.filter(r => r.status === 'active') || [];
      activeRuns.slice(0, 2).forEach(run => {
        recommendations.push({
          id: `continue_${run.id}`,
          type: 'continue',
          title: `Continuer: ${run.objective || 'Sans titre'}`,
          description: 'Reprendre là où vous vous êtes arrêté',
          tags: run.tags || [],
          confidence: 0.95,
          basedOn: run.id
        });
      });

      // Based on favorites
      const favoriteTags = runs
        ?.filter(r => favorites.includes(r.id))
        .flatMap(r => r.tags || []) || [];

      const tagCounts: Record<string, number> = {};
      favoriteTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });

      const topTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([tag]) => tag);

      if (topTags.length > 0) {
        recommendations.push({
          id: 'similar_favorites',
          type: 'similar',
          title: 'Basé sur vos favoris',
          description: `Objectifs liés à: ${topTags.join(', ')}`,
          tags: topTags,
          confidence: 0.8
        });
      }

      // Popular suggestions
      const popularGoals = [
        { title: 'Développer une routine matinale', tags: ['routine', 'productivité', 'bien-être'] },
        { title: 'Apprendre une nouvelle compétence', tags: ['apprentissage', 'développement'] },
        { title: 'Améliorer ma condition physique', tags: ['fitness', 'santé', 'bien-être'] },
        { title: 'Lire 12 livres cette année', tags: ['lecture', 'apprentissage'] },
        { title: 'Méditer quotidiennement', tags: ['méditation', 'bien-être', 'routine'] },
      ];

      popularGoals.slice(0, 3).forEach((goal, idx) => {
        recommendations.push({
          id: `popular_${idx}`,
          type: 'popular',
          title: goal.title,
          description: 'Objectif populaire parmi les utilisateurs',
          tags: goal.tags,
          confidence: 0.7 - idx * 0.1
        });
      });

      return recommendations;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ===================== ARTIFACTS SYSTEM =====================

export function useAwardArtifact() {
  const { toast } = useToast();

  const awardArtifact = useCallback(async (
    runId: string, 
    name: string, 
    rarity: 'common' | 'rare' | 'epic' | 'legendary',
    description?: string,
    icon?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('ambition_artifacts')
        .insert({
          run_id: runId,
          name,
          rarity,
          description,
          icon,
          obtained_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '🏆 Nouvel artefact !',
        description: `${name} (${rarity})`,
      });

      return data;
    } catch (error) {
      console.error('Error awarding artifact:', error);
      return null;
    }
  }, [toast]);

  return { awardArtifact };
}

export function useAmbitionArtifacts(runId?: string) {
  return useQuery({
    queryKey: ['ambition-artifacts', runId],
    queryFn: async () => {
      if (!runId) return [];

      const { data, error } = await supabase
        .from('ambition_artifacts')
        .select('*')
        .eq('run_id', runId)
        .order('obtained_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!runId,
  });
}
