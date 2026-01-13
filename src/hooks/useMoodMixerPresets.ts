/**
 * Hook pour les presets communautaires Mood Mixer
 * TOP 5 #5 Fonctionnalités - Système de presets partagés
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import type { Sliders } from '@/modules/mood-mixer/types';

export interface CommunityPreset {
  id: string;
  name: string;
  description: string;
  sliders: Sliders;
  creator_id: string;
  creator_name: string;
  creator_avatar: string;
  likes_count: number;
  uses_count: number;
  tags: string[];
  is_featured: boolean;
  is_public: boolean;
  created_at: string;
}

export interface UserPresetLike {
  id: string;
  preset_id: string;
  user_id: string;
  created_at: string;
}

export function useMoodMixerPresets() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [communityPresets, setCommunityPresets] = useState<CommunityPreset[]>([]);
  const [myPresets, setMyPresets] = useState<CommunityPreset[]>([]);
  const [featuredPresets, setFeaturedPresets] = useState<CommunityPreset[]>([]);
  const [likedPresetIds, setLikedPresetIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Charger les presets communautaires
  const fetchCommunityPresets = useCallback(async () => {
    setIsLoading(true);
    try {
      // Presets publics populaires
      const { data: publicPresets, error: pError } = await supabase
        .from('mood_mixer_presets')
        .select('*')
        .eq('is_public', true)
        .order('likes_count', { ascending: false })
        .limit(50);

      if (pError) throw pError;
      setCommunityPresets((publicPresets || []) as CommunityPreset[]);

      // Presets mis en avant
      const featured = (publicPresets || []).filter((p: CommunityPreset) => p.is_featured);
      setFeaturedPresets(featured.slice(0, 6) as CommunityPreset[]);

      // Mes presets
      if (user) {
        const { data: userPresets, error: uError } = await supabase
          .from('mood_mixer_presets')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (!uError) {
          setMyPresets((userPresets || []) as CommunityPreset[]);
        }

        // Mes likes
        const { data: likes, error: lError } = await supabase
          .from('mood_mixer_preset_likes')
          .select('preset_id')
          .eq('user_id', user.id);

        if (!lError) {
          setLikedPresetIds(new Set((likes || []).map((l: { preset_id: string }) => l.preset_id)));
        }
      }

    } catch (error) {
      logger.error('Failed to fetch community presets', error as Error, 'MOOD_MIXER');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Créer un nouveau preset
  const createPreset = useCallback(async (
    name: string,
    sliders: Sliders,
    options: {
      description?: string;
      tags?: string[];
      isPublic?: boolean;
    } = {}
  ) => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Connectez-vous pour créer des presets',
        variant: 'destructive'
      });
      return null;
    }

    try {
      // Récupérer le profil pour le nom
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase
        .from('mood_mixer_presets')
        .insert({
          name,
          description: options.description || '',
          sliders,
          creator_id: user.id,
          creator_name: profile?.display_name || 'Anonyme',
          creator_avatar: profile?.avatar_url || '🎵',
          tags: options.tags || [],
          is_public: options.isPublic ?? false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '✨ Preset créé !',
        description: options.isPublic 
          ? 'Votre preset est visible par la communauté' 
          : 'Preset sauvegardé dans vos presets privés'
      });

      await fetchCommunityPresets();
      return data as CommunityPreset;

    } catch (error) {
      logger.error('Failed to create preset', error as Error, 'MOOD_MIXER');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le preset',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, toast, fetchCommunityPresets]);

  // Liker/Unliker un preset
  const toggleLike = useCallback(async (presetId: string) => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Connectez-vous pour aimer des presets'
      });
      return false;
    }

    const isLiked = likedPresetIds.has(presetId);

    try {
      if (isLiked) {
        // Retirer le like
        await supabase
          .from('mood_mixer_preset_likes')
          .delete()
          .eq('preset_id', presetId)
          .eq('user_id', user.id);

        // Décrémenter le compteur
        await supabase.rpc('decrement_preset_likes', { preset_id: presetId });

        setLikedPresetIds(prev => {
          const next = new Set(prev);
          next.delete(presetId);
          return next;
        });
      } else {
        // Ajouter le like
        await supabase
          .from('mood_mixer_preset_likes')
          .insert({ preset_id: presetId, user_id: user.id });

        // Incrémenter le compteur
        await supabase.rpc('increment_preset_likes', { preset_id: presetId });

        setLikedPresetIds(prev => new Set([...prev, presetId]));
      }

      // Rafraîchir les données
      await fetchCommunityPresets();
      return true;

    } catch (error) {
      logger.error('Failed to toggle like', error as Error, 'MOOD_MIXER');
      return false;
    }
  }, [user, likedPresetIds, toast, fetchCommunityPresets]);

  // Utiliser un preset (incrémenter le compteur)
  const usePreset = useCallback(async (presetId: string) => {
    try {
      await supabase.rpc('increment_preset_uses', { preset_id: presetId });
    } catch (error) {
      // Non-bloquant
      logger.warn('Failed to increment preset uses', { presetId });
    }
  }, []);

  // Supprimer un preset (uniquement les miens)
  const deletePreset = useCallback(async (presetId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('mood_mixer_presets')
        .delete()
        .eq('id', presetId)
        .eq('creator_id', user.id);

      if (error) throw error;

      toast({
        title: 'Preset supprimé',
        description: 'Le preset a été supprimé'
      });

      await fetchCommunityPresets();
      return true;

    } catch (error) {
      logger.error('Failed to delete preset', error as Error, 'MOOD_MIXER');
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le preset',
        variant: 'destructive'
      });
      return false;
    }
  }, [user, toast, fetchCommunityPresets]);

  // Rechercher des presets
  const searchPresets = useCallback(async (query: string, tags?: string[]) => {
    try {
      let queryBuilder = supabase
        .from('mood_mixer_presets')
        .select('*')
        .eq('is_public', true)
        .ilike('name', `%${query}%`);

      if (tags && tags.length > 0) {
        queryBuilder = queryBuilder.contains('tags', tags);
      }

      const { data, error } = await queryBuilder
        .order('likes_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []) as CommunityPreset[];

    } catch (error) {
      logger.error('Failed to search presets', error as Error, 'MOOD_MIXER');
      return [];
    }
  }, []);

  // Charger au montage
  useEffect(() => {
    fetchCommunityPresets();
  }, [fetchCommunityPresets]);

  return {
    communityPresets,
    myPresets,
    featuredPresets,
    likedPresetIds,
    isLoading,
    isLiked: (id: string) => likedPresetIds.has(id),
    createPreset,
    toggleLike,
    usePreset,
    deletePreset,
    searchPresets,
    refresh: fetchCommunityPresets
  };
}

// Presets par défaut populaires
export const DEFAULT_COMMUNITY_PRESETS: Omit<CommunityPreset, 'id' | 'creator_id' | 'created_at'>[] = [
  {
    name: 'Morning Energy',
    description: 'Commencez la journée avec énergie et clarté mentale',
    sliders: { energy: 70, calm: 30, focus: 80, light: 90 },
    creator_name: 'EmotionsCare',
    creator_avatar: '☀️',
    likes_count: 156,
    uses_count: 892,
    tags: ['matin', 'énergie', 'productivité'],
    is_featured: true,
    is_public: true
  },
  {
    name: 'Deep Focus',
    description: 'Concentration maximale pour le travail',
    sliders: { energy: 50, calm: 70, focus: 95, light: 40 },
    creator_name: 'EmotionsCare',
    creator_avatar: '🎯',
    likes_count: 234,
    uses_count: 1205,
    tags: ['concentration', 'travail', 'productivité'],
    is_featured: true,
    is_public: true
  },
  {
    name: 'Evening Calm',
    description: 'Relaxation douce pour la fin de journée',
    sliders: { energy: 20, calm: 90, focus: 30, light: 20 },
    creator_name: 'EmotionsCare',
    creator_avatar: '🌙',
    likes_count: 189,
    uses_count: 756,
    tags: ['soir', 'relaxation', 'calme'],
    is_featured: true,
    is_public: true
  },
  {
    name: 'Creative Flow',
    description: 'État de flux créatif',
    sliders: { energy: 60, calm: 50, focus: 70, light: 60 },
    creator_name: 'EmotionsCare',
    creator_avatar: '🎨',
    likes_count: 145,
    uses_count: 534,
    tags: ['créativité', 'art', 'inspiration'],
    is_featured: true,
    is_public: true
  }
];
