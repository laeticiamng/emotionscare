// @ts-nocheck
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { MoodPreset } from '../useMoodMixerEnriched';

export interface SharedPreset {
  id: string;
  presetData: MoodPreset;
  sharedBy: string;
  sharedByName?: string;
  shareCode: string;
  isPublic: boolean;
  likes: number;
  downloads: number;
  createdAt: string;
}

export interface UsePresetSharingReturn {
  sharedPresets: SharedPreset[];
  isLoadingShared: boolean;
  sharePreset: (preset: MoodPreset, isPublic?: boolean) => Promise<string>;
  importPreset: (shareCode: string) => Promise<MoodPreset | null>;
  likePreset: (presetId: string) => void;
  isSharing: boolean;
  isImporting: boolean;
  getShareLink: (shareCode: string) => string;
  copyShareLink: (shareCode: string) => void;
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function usePresetSharing(userId?: string): UsePresetSharingReturn {
  const queryClient = useQueryClient();
  const [isSharing, setIsSharing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const { data: sharedPresets = [], isLoading: isLoadingShared } = useQuery({
    queryKey: ['shared-presets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mood_preset_shares')
        .select('*')
        .eq('is_public', true)
        .order('likes', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erreur chargement presets partagés:', error);
        return [];
      }

      return (data || []).map(share => ({
        id: share.id,
        presetData: share.preset_data as MoodPreset,
        sharedBy: share.shared_by,
        sharedByName: share.shared_by_name,
        shareCode: share.share_code,
        isPublic: share.is_public,
        likes: share.likes || 0,
        downloads: share.downloads || 0,
        createdAt: share.created_at,
      })) as SharedPreset[];
    },
    staleTime: 60000,
  });

  const sharePreset = useCallback(async (preset: MoodPreset, isPublic = false): Promise<string> => {
    if (!userId) {
      toast.error('Connectez-vous pour partager');
      return '';
    }

    setIsSharing(true);
    try {
      const shareCode = generateShareCode();
      
      const { error } = await supabase
        .from('mood_preset_shares')
        .insert({
          preset_data: preset as any,
          shared_by: userId,
          share_code: shareCode,
          is_public: isPublic,
          likes: 0,
          downloads: 0,
        });

      if (error) throw error;

      toast.success('Preset partagé !');
      queryClient.invalidateQueries({ queryKey: ['shared-presets'] });
      
      return shareCode;
    } catch (error) {
      console.error('Erreur partage:', error);
      toast.error('Erreur lors du partage');
      return '';
    } finally {
      setIsSharing(false);
    }
  }, [userId, queryClient]);

  const importPreset = useCallback(async (shareCode: string): Promise<MoodPreset | null> => {
    setIsImporting(true);
    try {
      const { data, error } = await supabase
        .from('mood_preset_shares')
        .select('*')
        .eq('share_code', shareCode.toUpperCase())
        .single();

      if (error || !data) {
        toast.error('Code de partage invalide');
        return null;
      }

      // Increment downloads
      await supabase
        .from('mood_preset_shares')
        .update({ downloads: (data.downloads || 0) + 1 })
        .eq('id', data.id);

      toast.success('Preset importé !');
      return data.preset_data as MoodPreset;
    } catch (error) {
      console.error('Erreur import:', error);
      toast.error('Erreur lors de l\'import');
      return null;
    } finally {
      setIsImporting(false);
    }
  }, []);

  const likeMutation = useMutation({
    mutationFn: async (presetId: string) => {
      const { data: current } = await supabase
        .from('mood_preset_shares')
        .select('likes')
        .eq('id', presetId)
        .single();

      const { error } = await supabase
        .from('mood_preset_shares')
        .update({ likes: (current?.likes || 0) + 1 })
        .eq('id', presetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-presets'] });
    },
    onError: () => {
      toast.error('Erreur lors du like');
    },
  });

  const likePreset = useCallback((presetId: string) => {
    likeMutation.mutate(presetId);
  }, [likeMutation]);

  const getShareLink = useCallback((shareCode: string): string => {
    return `${window.location.origin}/app/mood-mixer?import=${shareCode}`;
  }, []);

  const copyShareLink = useCallback((shareCode: string) => {
    const link = getShareLink(shareCode);
    navigator.clipboard.writeText(link);
    toast.success('Lien copié !');
  }, [getShareLink]);

  return {
    sharedPresets,
    isLoadingShared,
    sharePreset,
    importPreset,
    likePreset,
    isSharing,
    isImporting,
    getShareLink,
    copyShareLink,
  };
}
