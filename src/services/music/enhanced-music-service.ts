/**
 * Enhanced Music Service - Service enrichi pour gestion musicale avancée
 * Fonctionnalités: playlists, historique, favoris, partage
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { generateMusic, extendMusic, addVocals, type SunoGenerateRequest } from '../suno-client';
import { validateInput, CreatePlaylistSchema, ShareMusicSchema, AddToPlaylistSchema } from '@/validators/music';
import { quotaService } from './quota-service';

export interface MusicGeneration {
  id: string;
  userId: string;
  title: string;
  style: string;
  prompt?: string;
  model: string;
  audioUrl?: string;
  audioId?: string;
  durationSeconds?: number;
  instrumental: boolean;
  vocalGender?: 'm' | 'f' | null;
  styleWeight?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
}

export interface MusicPlaylist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  coverImageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  tracksCount?: number;
}

export interface PlaylistTrack {
  id: string;
  playlistId: string;
  musicGenerationId?: string;
  externalTrackId?: string;
  position: number;
  addedAt: string;
  musicGeneration?: MusicGeneration;
}

export interface MusicShare {
  id: string;
  musicGenerationId: string;
  sharedBy: string;
  sharedWith?: string;
  isPublic: boolean;
  shareToken?: string;
  message?: string;
  createdAt: string;
  expiresAt?: string;
  musicGeneration?: MusicGeneration;
}

class EnhancedMusicService {
  /**
   * Générer une nouvelle musique avec tracking
   */
  async generateMusicWithTracking(
    request: Omit<SunoGenerateRequest, 'callBackUrl'>
  ): Promise<MusicGeneration> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // 1. Vérifier le quota utilisateur
    const quotaCheck = await quotaService.checkQuota(user.id);
    if (!quotaCheck.canGenerate) {
      throw new Error(quotaCheck.reason || 'Quota de générations épuisé');
    }

    // 2. Vérifier la durée demandée
    const duration = request.durationSeconds || 180;
    const durationCheck = await quotaService.canGenerateWithDuration(user.id, duration);
    if (!durationCheck.canGenerate) {
      throw new Error(durationCheck.reason || 'Durée trop longue pour votre tier');
    }

    // 3. Vérifier les générations concurrentes
    const concurrentCheck = await quotaService.checkConcurrentGenerations(user.id);
    if (!concurrentCheck.canGenerate) {
      throw new Error(concurrentCheck.reason || 'Trop de générations en cours');
    }

    // 4. Incrémenter le quota
    const incremented = await quotaService.incrementUsage(user.id);
    if (!incremented) {
      throw new Error('Impossible d\'incrémenter le quota');
    // Validation des entrées
    if (!request.title || request.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!request.style || request.style.trim().length === 0) {
      throw new Error('Style is required');
    }
    if (request.title.length > 200) {
      throw new Error('Title too long (max 200 characters)');
    }
    if (request.prompt && request.prompt.length > 1000) {
      throw new Error('Prompt too long (max 1000 characters)');
    }

    // Créer l'entrée dans la DB
    const { data: generation, error: dbError } = await supabase
      .from('music_generations')
      .insert({
        user_id: user.id,
        title: request.title,
        style: request.style,
        prompt: request.prompt,
        model: request.model,
        instrumental: request.instrumental,
        vocal_gender: request.vocalGender,
        style_weight: request.styleWeight,
        status: 'processing',
        metadata: {
          negativeTags: request.negativeTags,
          weirdnessConstraint: request.weirdnessConstraint,
          audioWeight: request.audioWeight,
          durationSeconds: request.durationSeconds,
        }
      })
      .select()
      .single();

    if (dbError) {
      // Décrémenter le quota en cas d'erreur
      await quotaService.decrementUsage(user.id);
      throw dbError;
    }

    try {
      // Appeler Suno API
      const callBackUrl = `${window.location.origin}/api/music/callback/${generation.id}`;
      const result = await generateMusic({ ...request, callBackUrl });

      // Mettre à jour avec l'audio_id
      const { data: updated } = await supabase
        .from('music_generations')
        .update({
          audio_id: result.audioId || result.id,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', generation.id)
        .select()
        .single();

      return this.mapToMusicGeneration(updated);
    } catch (error) {
      // Marquer comme échoué
      await supabase
        .from('music_generations')
        .update({ status: 'failed' })
        .eq('id', generation.id);

      // Décrémenter le quota en cas d'échec
      await quotaService.decrementUsage(user.id);

      logger.error('Failed to generate music', error as Error, 'MUSIC');
      throw error;
    }
  }

  /**
   * Récupérer l'historique des générations
   */
  async getMusicHistory(limit = 50, offset = 0): Promise<MusicGeneration[]> {
    const { data, error } = await supabase
      .from('music_generations')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (data || []).map(this.mapToMusicGeneration);
  }

  /**
   * Récupérer une génération par ID
   */
  async getMusicGeneration(id: string): Promise<MusicGeneration | null> {
    const { data, error } = await supabase
      .from('music_generations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;

    return this.mapToMusicGeneration(data);
  }

  // ============================================
  // PLAYLISTS
  // ============================================

  /**
   * Créer une nouvelle playlist
   */
  async createPlaylist(
    name: string,
    description?: string,
    isPublic = false,
    tags: string[] = []
  ): Promise<MusicPlaylist> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Valider les données
    const validation = validateInput(CreatePlaylistSchema, {
      name,
      description,
      isPublic,
      tags
    });

    if (!validation.success) {
      throw new Error(`Invalid playlist data: ${validation.errors.join(', ')}`);
    }

    const validData = validation.data;

    const { data, error } = await supabase
      .from('music_playlists')
      .insert({
        user_id: user.id,
        name: validData.name,
        description: validData.description,
        is_public: validData.isPublic,
        tags: validData.tags
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Playlist created', { playlistId: data.id, name: validData.name }, 'MUSIC');

    return this.mapToPlaylist(data);
  }

  /**
   * Récupérer les playlists de l'utilisateur
   */
  async getUserPlaylists(): Promise<MusicPlaylist[]> {
    const { data, error } = await supabase
      .from('music_playlists')
      .select('*, playlist_tracks(count)')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(playlist => ({
      ...this.mapToPlaylist(playlist),
      tracksCount: playlist.playlist_tracks?.[0]?.count || 0
    }));
  }

  /**
   * Récupérer les playlists publiques
   */
  async getPublicPlaylists(limit = 20): Promise<MusicPlaylist[]> {
    const { data, error } = await supabase
      .from('music_playlists')
      .select('*, playlist_tracks(count)')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map(playlist => ({
      ...this.mapToPlaylist(playlist),
      tracksCount: playlist.playlist_tracks?.[0]?.count || 0
    }));
  }

  /**
   * Ajouter une musique à une playlist
   */
  async addToPlaylist(playlistId: string, musicGenerationId: string): Promise<void> {
    // Valider les IDs
    const validation = validateInput(AddToPlaylistSchema, {
      playlistId,
      musicGenerationId
    });

    if (!validation.success) {
      throw new Error(`Invalid data: ${validation.errors.join(', ')}`);
    }

    // Récupérer la position maximale
    const { data: tracks } = await supabase
      .from('playlist_tracks')
      .select('position')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = (tracks?.[0]?.position || 0) + 1;

    const { error } = await supabase
      .from('playlist_tracks')
      .insert({
        playlist_id: playlistId,
        music_generation_id: musicGenerationId,
        position: nextPosition
      });

    if (error) throw error;

    // Mettre à jour la date de modification de la playlist
    await supabase
      .from('music_playlists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', playlistId);

    logger.info('Track added to playlist', { playlistId, musicGenerationId }, 'MUSIC');
  }

  /**
   * Retirer une musique d'une playlist
   */
  async removeFromPlaylist(playlistId: string, trackId: string): Promise<void> {
    const { error } = await supabase
      .from('playlist_tracks')
      .delete()
      .eq('id', trackId)
      .eq('playlist_id', playlistId);

    if (error) throw error;

    await supabase
      .from('music_playlists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', playlistId);
  }

  /**
   * Récupérer les morceaux d'une playlist
   */
  async getPlaylistTracks(playlistId: string): Promise<PlaylistTrack[]> {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select('*, music_generations(*)')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true });

    if (error) throw error;

    return (data || []).map(track => ({
      id: track.id,
      playlistId: track.playlist_id,
      musicGenerationId: track.music_generation_id,
      externalTrackId: track.external_track_id,
      position: track.position,
      addedAt: track.added_at,
      musicGeneration: track.music_generations ? this.mapToMusicGeneration(track.music_generations) : undefined
    }));
  }

  /**
   * Supprimer une playlist
   */
  async deletePlaylist(playlistId: string): Promise<void> {
    const { error } = await supabase
      .from('music_playlists')
      .delete()
      .eq('id', playlistId);

    if (error) throw error;
  }

  // ============================================
  // FAVORIS
  // ============================================

  /**
   * Ajouter aux favoris
   */
  async addToFavorites(musicGenerationId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('music_favorites')
      .insert({
        user_id: user.id,
        music_generation_id: musicGenerationId
      });

    if (error && error.code !== '23505') { // Ignore duplicate error
      throw error;
    }
  }

  /**
   * Retirer des favoris
   */
  async removeFromFavorites(musicGenerationId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('music_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('music_generation_id', musicGenerationId);

    if (error) throw error;
  }

  /**
   * Récupérer les favoris
   */
  async getFavorites(): Promise<MusicGeneration[]> {
    const { data, error } = await supabase
      .from('music_favorites')
      .select('music_generations(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || [])
      .filter(fav => fav.music_generations)
      .map(fav => this.mapToMusicGeneration(fav.music_generations));
  }

  /**
   * Vérifier si une musique est dans les favoris
   */
  async isFavorite(musicGenerationId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('music_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('music_generation_id', musicGenerationId)
      .single();

    return !error && !!data;
  }

  // ============================================
  // PARTAGE
  // ============================================

  /**
   * Partager une musique
   */
  async shareMusic(
    musicGenerationId: string,
    options: {
      sharedWith?: string;
      isPublic?: boolean;
      message?: string;
      expiresInDays?: number;
    } = {}
  ): Promise<MusicShare> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Valider les données de partage
    const validation = validateInput(ShareMusicSchema, {
      musicGenerationId,
      ...options
    });

    if (!validation.success) {
      throw new Error(`Invalid share data: ${validation.errors.join(', ')}`);
    }

    const validData = validation.data;

    const shareToken = validData.isPublic ? this.generateShareToken() : undefined;
    const expiresAt = validData.expiresInDays
      ? new Date(Date.now() + validData.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    const { data, error } = await supabase
      .from('music_shares')
      .insert({
        music_generation_id: validData.musicGenerationId,
        shared_by: user.id,
        shared_with: validData.sharedWith,
        is_public: validData.isPublic,
        share_token: shareToken,
        message: validData.message,
        expires_at: expiresAt
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Music shared', { musicGenerationId: validData.musicGenerationId, isPublic: validData.isPublic }, 'MUSIC');

    return this.mapToMusicShare(data);
  }

  /**
   * Récupérer les musiques partagées avec moi
   */
  async getSharedWithMe(): Promise<MusicShare[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('music_shares')
      .select('*, music_generations(*)')
      .eq('shared_with', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(share => ({
      ...this.mapToMusicShare(share),
      musicGeneration: share.music_generations ? this.mapToMusicGeneration(share.music_generations) : undefined
    }));
  }

  /**
   * Récupérer une musique par token de partage
   */
  async getMusicByShareToken(token: string): Promise<MusicGeneration | null> {
    const { data, error } = await supabase
      .from('music_shares')
      .select('music_generations(*)')
      .eq('share_token', token)
      .eq('is_public', true)
      .single();

    if (error || !data?.music_generations) return null;

    // Vérifier l'expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    return this.mapToMusicGeneration(data.music_generations);
  }

  // ============================================
  // HELPERS
  // ============================================

  private mapToMusicGeneration(data: any): MusicGeneration {
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      style: data.style,
      prompt: data.prompt,
      model: data.model,
      audioUrl: data.audio_url,
      audioId: data.audio_id,
      durationSeconds: data.duration_seconds,
      instrumental: data.instrumental,
      vocalGender: data.vocal_gender,
      styleWeight: data.style_weight,
      status: data.status,
      metadata: data.metadata,
      createdAt: data.created_at,
      completedAt: data.completed_at
    };
  }

  private mapToPlaylist(data: any): MusicPlaylist {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      isPublic: data.is_public,
      coverImageUrl: data.cover_image_url,
      tags: data.tags || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapToMusicShare(data: any): MusicShare {
    return {
      id: data.id,
      musicGenerationId: data.music_generation_id,
      sharedBy: data.shared_by,
      sharedWith: data.shared_with,
      isPublic: data.is_public,
      shareToken: data.share_token,
      message: data.message,
      createdAt: data.created_at,
      expiresAt: data.expires_at
    };
  }

  private generateShareToken(): string {
    // Génère un token sécurisé avec crypto API si disponible
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return `share_${Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')}`;
    }
    // Fallback pour environnements sans crypto API
    return `share_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
  }
}

export const enhancedMusicService = new EnhancedMusicService();
