// @ts-nocheck
/**
 * Service de gestion des playlists collaboratives
 *
 * Fournit des fonctionnalités pour:
 * - Création et partage de playlists
 * - Collaboration temps réel
 * - Gestion des permissions
 * - Invitations et notifications
 * - Historique des changements
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

// ============================================
// TYPES
// ============================================

export type PlaylistRole = 'owner' | 'editor' | 'viewer';
export type PlaylistVisibility = 'private' | 'friends' | 'public';
export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface CollaborativePlaylist {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  owner_name: string;
  visibility: PlaylistVisibility;
  cover_url?: string;
  track_count: number;
  created_at: string;
  updated_at: string;
  share_token?: string;
  share_url?: string;
}

export interface PlaylistCollaborator {
  id: string;
  playlist_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  role: PlaylistRole;
  joined_at: string;
  added_by: string;
}

export interface PlaylistInvitation {
  id: string;
  playlist_id: string;
  playlist_name: string;
  inviter_id: string;
  inviter_name: string;
  invitee_email: string;
  invitee_id?: string;
  role: PlaylistRole;
  status: InvitationStatus;
  created_at: string;
  expires_at: string;
  message?: string;
}

export interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  track_title: string;
  track_artist: string;
  added_by: string;
  added_at: string;
  position: number;
}

export interface PlaylistActivity {
  id: string;
  playlist_id: string;
  user_id: string;
  user_name: string;
  action: 'created' | 'added_track' | 'removed_track' | 'renamed' | 'changed_visibility';
  details: Record<string, any>;
  created_at: string;
}

// ============================================
// SERVICE
// ============================================

export const collaborativePlaylistService = {
  /**
   * Créer une nouvelle playlist collaborative
   */
  async createPlaylist(
    name: string,
    options?: {
      description?: string;
      visibility?: PlaylistVisibility;
      cover_url?: string;
    }
  ): Promise<CollaborativePlaylist> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('collaborative_playlists')
        .insert({
          name,
          description: options?.description,
          owner_id: user.user.id,
          visibility: options?.visibility || 'private',
          cover_url: options?.cover_url
        })
        .select()
        .single();

      if (error) throw error;

      // Générer un token de partage
      const shareToken = await this.generateShareToken(data.id);

      logger.info('Collaborative playlist created', {
        playlistId: data.id,
        name,
        ownerId: user.user.id
      }, 'MUSIC');

      return {
        ...data,
        share_token: shareToken,
        share_url: `${window.location.origin}/app/music/playlist/${shareToken}`
      };
    } catch (error) {
      logger.error('Failed to create collaborative playlist', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Inviter un utilisateur à une playlist
   */
  async inviteUser(
    playlistId: string,
    email: string,
    role: PlaylistRole = 'viewer',
    message?: string
  ): Promise<PlaylistInvitation> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Vérifier que l'utilisateur est propriétaire ou éditeur
      await this.verifyPermission(playlistId, user.user.id, ['owner', 'editor']);

      // Récupérer les informations de la playlist
      const { data: playlist } = await supabase
        .from('collaborative_playlists')
        .select('name')
        .eq('id', playlistId)
        .single();

      // Créer l'invitation
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expiration dans 7 jours

      const { data, error } = await supabase
        .from('playlist_invitations')
        .insert({
          playlist_id: playlistId,
          inviter_id: user.user.id,
          invitee_email: email.toLowerCase(),
          role,
          message,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('Playlist invitation sent', {
        playlistId,
        inviteeEmail: email,
        role
      }, 'MUSIC');

      return {
        ...data,
        playlist_name: playlist?.name || ''
      };
    } catch (error) {
      logger.error('Failed to invite user to playlist', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Accepter une invitation de playlist
   */
  async acceptInvitation(invitationId: string): Promise<PlaylistCollaborator> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Récupérer et vérifier l'invitation
      const { data: invitation, error: invError } = await supabase
        .from('playlist_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (invError) throw invError;
      if (!invitation) throw new Error('Invitation not found');

      // Vérifier que l'email correspond
      if (invitation.invitee_email !== user.user.email) {
        throw new Error('This invitation is not for you');
      }

      // Ajouter l'utilisateur comme collaborateur
      const { data: collaborator, error: collError } = await supabase
        .from('playlist_collaborators')
        .insert({
          playlist_id: invitation.playlist_id,
          user_id: user.user.id,
          role: invitation.role,
          added_by: invitation.inviter_id
        })
        .select()
        .single();

      if (collError) throw collError;

      // Mettre à jour le statut de l'invitation
      await supabase
        .from('playlist_invitations')
        .update({
          status: 'accepted',
          invitee_id: user.user.id
        })
        .eq('id', invitationId);

      // Enregistrer l'activité
      await this.logActivity(
        invitation.playlist_id,
        user.user.id,
        'added collaborator',
        { email: user.user.email }
      );

      logger.info('Playlist invitation accepted', {
        invitationId,
        playlistId: invitation.playlist_id
      }, 'MUSIC');

      return collaborator;
    } catch (error) {
      logger.error('Failed to accept playlist invitation', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Rejeter une invitation de playlist
   */
  async rejectInvitation(invitationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('playlist_invitations')
        .update({ status: 'rejected' })
        .eq('id', invitationId);

      if (error) throw error;

      logger.info('Playlist invitation rejected', { invitationId }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to reject playlist invitation', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Ajouter une chanson à une playlist collaborative
   */
  async addTrackToPlaylist(
    playlistId: string,
    trackId: string,
    trackTitle: string,
    trackArtist: string
  ): Promise<PlaylistTrack> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Vérifier les permissions
      await this.verifyPermission(playlistId, user.user.id, ['owner', 'editor']);

      // Obtenir la position suivante
      const { data: tracks } = await supabase
        .from('playlist_tracks')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = (tracks?.[0]?.position || 0) + 1;

      // Ajouter la chanson
      const { data, error } = await supabase
        .from('playlist_tracks')
        .insert({
          playlist_id: playlistId,
          track_id: trackId,
          track_title: trackTitle,
          track_artist: trackArtist,
          added_by: user.user.id,
          position: nextPosition
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la date de modification de la playlist
      await supabase
        .from('collaborative_playlists')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', playlistId);

      // Enregistrer l'activité
      await this.logActivity(
        playlistId,
        user.user.id,
        'added_track',
        { trackTitle, trackArtist }
      );

      logger.info('Track added to collaborative playlist', {
        playlistId,
        trackId
      }, 'MUSIC');

      return data;
    } catch (error) {
      logger.error('Failed to add track to collaborative playlist', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Retirer une chanson d'une playlist collaborative
   */
  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Vérifier les permissions
      await this.verifyPermission(playlistId, user.user.id, ['owner', 'editor']);

      const { error } = await supabase
        .from('playlist_tracks')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('track_id', trackId);

      if (error) throw error;

      // Mettre à jour la date de modification
      await supabase
        .from('collaborative_playlists')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', playlistId);

      // Enregistrer l'activité
      await this.logActivity(
        playlistId,
        user.user.id,
        'removed_track',
        { trackId }
      );

      logger.info('Track removed from collaborative playlist', {
        playlistId,
        trackId
      }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to remove track from collaborative playlist', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Obtenir l'historique d'activité d'une playlist
   */
  async getPlaylistActivity(playlistId: string, limit: number = 50): Promise<PlaylistActivity[]> {
    try {
      const { data, error } = await supabase
        .from('playlist_activity')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch playlist activity', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Obtenir les collaborateurs d'une playlist
   */
  async getPlaylistCollaborators(playlistId: string): Promise<PlaylistCollaborator[]> {
    try {
      const { data, error } = await supabase
        .from('playlist_collaborators')
        .select('*')
        .eq('playlist_id', playlistId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error('Failed to fetch playlist collaborators', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Supprimer un collaborateur d'une playlist
   */
  async removeCollaborator(playlistId: string, userId: string): Promise<void> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('User not authenticated');

      // Vérifier que c'est le propriétaire
      await this.verifyPermission(playlistId, currentUser.user.id, ['owner']);

      const { error } = await supabase
        .from('playlist_collaborators')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('user_id', userId);

      if (error) throw error;

      // Enregistrer l'activité
      await this.logActivity(
        playlistId,
        currentUser.user.id,
        'removed_collaborator',
        { removedUserId: userId }
      );

      logger.info('Collaborator removed from playlist', {
        playlistId,
        userId
      }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to remove playlist collaborator', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Changer la visibilité d'une playlist
   */
  async changeVisibility(playlistId: string, visibility: PlaylistVisibility): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Vérifier les permissions
      await this.verifyPermission(playlistId, user.user.id, ['owner']);

      const { error } = await supabase
        .from('collaborative_playlists')
        .update({
          visibility,
          updated_at: new Date().toISOString()
        })
        .eq('id', playlistId);

      if (error) throw error;

      // Enregistrer l'activité
      await this.logActivity(
        playlistId,
        user.user.id,
        'changed_visibility',
        { newVisibility: visibility }
      );

      logger.info('Playlist visibility changed', {
        playlistId,
        visibility
      }, 'MUSIC');
    } catch (error) {
      logger.error('Failed to change playlist visibility', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Vérifier les permissions d'un utilisateur
   */
  async verifyPermission(
    playlistId: string,
    userId: string,
    requiredRoles: PlaylistRole[]
  ): Promise<boolean> {
    const { data: playlist } = await supabase
      .from('collaborative_playlists')
      .select('owner_id')
      .eq('id', playlistId)
      .single();

    if (playlist?.owner_id === userId) return true;

    const { data: collaborator } = await supabase
      .from('playlist_collaborators')
      .select('role')
      .eq('playlist_id', playlistId)
      .eq('user_id', userId)
      .single();

    if (collaborator && requiredRoles.includes(collaborator.role)) {
      return true;
    }

    throw new Error('Insufficient permissions');
  },

  /**
   * Générer un token de partage
   */
  async generateShareToken(playlistId: string): Promise<string> {
    const token = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    await supabase
      .from('collaborative_playlists')
      .update({ share_token: token })
      .eq('id', playlistId);

    return token;
  },

  /**
   * Enregistrer une activité dans l'historique
   */
  async logActivity(
    playlistId: string,
    userId: string,
    action: PlaylistActivity['action'],
    details: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('playlist_activity')
        .insert({
          playlist_id: playlistId,
          user_id: userId,
          action,
          details,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      logger.warn('Failed to log playlist activity', error as Error, 'MUSIC');
    }
  }
};
