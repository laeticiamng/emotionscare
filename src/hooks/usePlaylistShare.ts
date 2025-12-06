// @ts-nocheck
/**
 * usePlaylistShare - Partage et export de playlists Auto-mix
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export const usePlaylistShare = () => {
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);

  /**
   * Générer un lien de partage public
   */
  const generateShareLink = useCallback(async (playlistId: string) => {
    if (!user) return null;

    setIsSharing(true);
    try {
      const shareToken = crypto.randomUUID();
      const shareUrl = `${window.location.origin}/playlist/${shareToken}`;

      const { data, error } = await supabase
        .from('shared_playlists')
        .insert({
          playlist_id: playlistId,
          user_id: user.id,
          share_token: shareToken,
          is_public: true,
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('✅ Share link generated', { shareToken }, 'SHARE');
      toast.success('Lien de partage créé !');

      return {
        shareUrl,
        shareToken,
      };
    } catch (error) {
      logger.error('❌ Share link generation failed', error as Error, 'SHARE');
      toast.error('Erreur lors de la création du lien');
      return null;
    } finally {
      setIsSharing(false);
    }
  }, [user]);

  /**
   * Partager sur les réseaux sociaux
   */
  const shareToSocial = useCallback(
    (platform: 'twitter' | 'instagram' | 'facebook', shareUrl: string, playlistName: string) => {
      const text = `🎵 Découvrez ma playlist "${playlistName}" sur EmotionsCare`;

      switch (platform) {
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          break;
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          break;
        case 'instagram':
          // Instagram ne supporte pas le partage direct via URL
          // On copie le lien dans le presse-papier
          navigator.clipboard.writeText(`${text}\n${shareUrl}`);
          toast.success('Lien copié ! Collez-le dans Instagram Stories');
          break;
      }

      logger.info('📱 Social share', { platform }, 'SHARE');
    },
    []
  );

  /**
   * Exporter vers Spotify (nécessite OAuth Spotify)
   */
  const exportToSpotify = useCallback(async (playlistId: string) => {
    if (!user) {
      toast.error('Veuillez vous connecter');
      return;
    }

    try {
      logger.info('🎵 Initiating Spotify export', { playlistId }, 'SHARE');

      // Lancer le processus OAuth via edge function
      const response = await supabase.functions.invoke('spotify-auth-callback', {
        body: {
          action: 'init_auth',
          userId: user.id,
          playlistId,
          redirectUri: `${window.location.origin}/auth/spotify/callback`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { authUrl } = response.data;

      // Rediriger vers Spotify pour l'authentification
      window.location.href = authUrl;
    } catch (error) {
      logger.error('❌ Spotify export failed', error as Error, 'SHARE');
      toast.error('Erreur lors de la connexion à Spotify');
    }
  }, [user]);

  /**
   * Exporter vers Apple Music
   */
  const exportToAppleMusic = useCallback(async (playlistId: string) => {
    if (!user) {
      toast.error('Veuillez vous connecter');
      return;
    }

    try {
      logger.info('🍎 Exporting to Apple Music', { playlistId }, 'SHARE');

      // Appeler l'edge function pour exporter vers Apple Music
      const response = await supabase.functions.invoke('apple-music-export', {
        body: {
          userId: user.id,
          playlistId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success('Playlist exportée vers Apple Music !');
      logger.info('✅ Apple Music export successful', { playlistId }, 'SHARE');
    } catch (error) {
      logger.error('❌ Apple Music export failed', error as Error, 'SHARE');
      toast.error('Erreur lors de l\'export Apple Music');
    }
  }, [user]);

  /**
   * Enregistrer une écoute pour les statistiques
   */
  const trackListen = useCallback(
    async (playlistId: string, trackIndex: number, durationSeconds: number, completed: boolean) => {
      if (!user) return;

      try {
        await supabase.from('playlist_listen_stats').insert({
          playlist_id: playlistId,
          user_id: user.id,
          track_index: trackIndex,
          duration_seconds: durationSeconds,
          completed,
        });
      } catch (error) {
        logger.error('❌ Failed to track listen', error as Error, 'SHARE');
      }
    },
    [user]
  );

  /**
   * Récupérer les statistiques d'une playlist
   */
  const getPlaylistStats = useCallback(async (playlistId: string) => {
    try {
      const { data, error } = await supabase
        .from('playlist_listen_stats')
        .select('*')
        .eq('playlist_id', playlistId);

      if (error) throw error;

      const totalListens = data?.length || 0;
      const completedListens = data?.filter((s) => s.completed).length || 0;
      const avgDuration = data?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / totalListens || 0;

      return {
        totalListens,
        completedListens,
        completionRate: totalListens > 0 ? (completedListens / totalListens) * 100 : 0,
        avgDuration: Math.round(avgDuration),
      };
    } catch (error) {
      logger.error('❌ Failed to fetch stats', error as Error, 'SHARE');
      return null;
    }
  }, []);

  return {
    isSharing,
    generateShareLink,
    shareToSocial,
    exportToSpotify,
    exportToAppleMusic,
    trackListen,
    getPlaylistStats,
  };
};
