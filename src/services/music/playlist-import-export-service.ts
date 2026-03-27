// @ts-nocheck
/**
 * Service d'export/import de playlists
 *
 * Formats supportés:
 * - JSON (format natif)
 * - M3U (liste de lecture standard)
 * - CSV (données tabulaires)
 * - Spotify URI (pour compatibilité)
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

// ============================================
// TYPES
// ============================================

export type PlaylistFormat = 'json' | 'm3u' | 'csv' | 'spotify';

export interface PlaylistExportOptions {
  format: PlaylistFormat;
  includeCover?: boolean;
  includeMetadata?: boolean;
}

export interface PlaylistImportResult {
  success: boolean;
  playlistId?: string;
  playlistName: string;
  tracksAdded: number;
  errors: { trackIndex: number; reason: string }[];
}

export interface PlaylistData {
  name: string;
  description?: string;
  tracks: {
    title: string;
    artist: string;
    duration?: number;
    album?: string;
    genre?: string;
    mood?: string;
  }[];
  metadata?: {
    createdAt: string;
    updatedAt: string;
    cover?: string;
  };
}

// ============================================
// SERVICE
// ============================================

export const playlistImportExportService = {
  /**
   * Exporter une playlist
   */
  async exportPlaylist(
    playlistId: string,
    options: PlaylistExportOptions
  ): Promise<Blob | string> {
    try {
      // Récupérer les données de la playlist
      const { data: playlist, error: playlistError } = await supabase
        .from('collaborative_playlists')
        .select('*')
        .eq('id', playlistId)
        .single();

      if (playlistError) throw playlistError;

      // Récupérer les tracks
      const { data: tracks, error: tracksError } = await supabase
        .from('playlist_tracks')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('position');

      if (tracksError) throw tracksError;

      // Préparer les données
      const playlistData: PlaylistData = {
        name: playlist.name,
        description: playlist.description,
        tracks: (tracks || []).map(track => ({
          title: track.track_title,
          artist: track.track_artist,
          duration: track.duration,
          album: track.album,
          genre: track.genre,
          mood: track.mood
        })),
        metadata: options.includeMetadata ? {
          createdAt: playlist.created_at,
          updatedAt: playlist.updated_at,
          cover: options.includeCover ? playlist.cover_url : undefined
        } : undefined
      };

      // Exporter dans le format requis
      let exportData: Blob | string;
      let filename: string;

      switch (options.format) {
        case 'json':
          exportData = new Blob([JSON.stringify(playlistData, null, 2)], {
            type: 'application/json'
          });
          filename = `${playlist.name}.json`;
          break;

        case 'm3u':
          exportData = playlistImportExportService.toM3U(playlistData);
          filename = `${playlist.name}.m3u8`;
          break;

        case 'csv':
          exportData = playlistImportExportService.toCSV(playlistData);
          filename = `${playlist.name}.csv`;
          break;

        case 'spotify':
          exportData = playlistImportExportService.toSpotifyURI(playlistData);
          filename = `${playlist.name}.txt`;
          break;

        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }

      // Trigger download
      if (typeof exportData === 'object' && exportData instanceof Blob) {
        const url = window.URL.createObjectURL(exportData);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      logger.info('Playlist exported', {
        playlistId,
        format: options.format,
        trackCount: playlistData.tracks.length
      }, 'MUSIC');

      return exportData;
    } catch (error) {
      logger.error('Failed to export playlist', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Importer une playlist
   */
  async importPlaylist(
    file: File,
    options?: { playlistId?: string; merge?: boolean }
  ): Promise<PlaylistImportResult> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Lire le fichier
      const content = await file.text();

      // Déterminer le format
      let playlistData: PlaylistData;
      const filename = file.name.toLowerCase();

      if (filename.endsWith('.json')) {
        playlistData = JSON.parse(content);
      } else if (filename.endsWith('.csv')) {
        playlistData = playlistImportExportService.parseCSV(content);
      } else if (filename.endsWith('.m3u') || filename.endsWith('.m3u8')) {
        playlistData = playlistImportExportService.parseM3U(content);
      } else if (filename.endsWith('.txt')) {
        // Essayer de parser comme Spotify ou format texte simple
        playlistData = playlistImportExportService.parseText(content);
      } else {
        throw new Error('Unsupported file format');
      }

      // Créer ou récupérer la playlist
      let playlistId = options?.playlistId;

      if (!playlistId) {
        const { data: newPlaylist, error } = await supabase
          .from('collaborative_playlists')
          .insert({
            name: playlistData.name,
            description: playlistData.description,
            owner_id: user.user.id,
            visibility: 'private'
          })
          .select()
          .single();

        if (error) throw error;
        playlistId = newPlaylist.id;
      }

      // Ajouter les tracks
      const errors: { trackIndex: number; reason: string }[] = [];
      let addedCount = 0;

      for (let i = 0; i < playlistData.tracks.length; i++) {
        try {
          const track = playlistData.tracks[i];

          // Chercher la track dans la base de données
          const { data: foundTrack } = await supabase
            .from('music_tracks')
            .select('id')
            .ilike('title', track.title)
            .ilike('artist', track.artist)
            .single();

          if (!foundTrack) {
            errors.push({
              trackIndex: i,
              reason: `Track not found: ${track.title} by ${track.artist}`
            });
            continue;
          }

          // Ajouter à la playlist
          await supabase
            .from('playlist_tracks')
            .insert({
              playlist_id: playlistId,
              track_id: foundTrack.id,
              track_title: track.title,
              track_artist: track.artist,
              added_by: user.user.id,
              position: addedCount + 1
            });

          addedCount++;
        } catch (trackError) {
          logger.warn('Failed to import track', trackError as Error, 'MUSIC');
          errors.push({
            trackIndex: i,
            reason: (trackError as Error).message
          });
        }
      }

      logger.info('Playlist imported', {
        playlistId,
        tracksAdded: addedCount,
        errors: errors.length
      }, 'MUSIC');

      return {
        success: errors.length === 0,
        playlistId,
        playlistName: playlistData.name,
        tracksAdded: addedCount,
        errors
      };
    } catch (error) {
      logger.error('Failed to import playlist', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Convertir en format M3U
   */
  toM3U(playlist: PlaylistData): Blob {
    let m3u = '#EXTM3U\n';

    for (const track of playlist.tracks) {
      const duration = track.duration || -1;
      m3u += `#EXTINF:${duration},${track.artist} - ${track.title}\n`;
      m3u += `${track.artist}/${track.title}.mp3\n`;
    }

    return new Blob([m3u], { type: 'audio/x-mpegurl' });
  },

  /**
   * Convertir en format CSV
   */
  toCSV(playlist: PlaylistData): Blob {
    const headers = ['Title', 'Artist', 'Album', 'Genre', 'Mood', 'Duration'];
    const rows = playlist.tracks.map(track => [
      `"${track.title.replace(/"/g, '""')}"`,
      `"${track.artist.replace(/"/g, '""')}"`,
      `"${(track.album || '').replace(/"/g, '""')}"`,
      `"${(track.genre || '').replace(/"/g, '""')}"`,
      `"${(track.mood || '').replace(/"/g, '""')}"`,
      track.duration || ''
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return new Blob([csv], { type: 'text/csv' });
  },

  /**
   * Convertir en format Spotify URI
   */
  toSpotifyURI(playlist: PlaylistData): string {
    let uris = `# ${playlist.name}\n`;

    for (const track of playlist.tracks) {
      // Format Spotify: spotify:track:ID
      // Ici on exporte juste les infos en format lisible
      uris += `${track.artist} - ${track.title}\n`;
    }

    return uris;
  },

  /**
   * Parser du format CSV
   */
  parseCSV(content: string): PlaylistData {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const tracks = lines.slice(1).map(line => {
      const values = this.parseCSVLine(line);
      return {
        title: values[headers.indexOf('title')] || '',
        artist: values[headers.indexOf('artist')] || '',
        album: values[headers.indexOf('album')],
        genre: values[headers.indexOf('genre')],
        mood: values[headers.indexOf('mood')],
        duration: parseInt(values[headers.indexOf('duration')] || '0')
      };
    });

    return {
      name: 'Imported Playlist',
      tracks
    };
  },

  /**
   * Parser du format M3U
   */
  parseM3U(content: string): PlaylistData {
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#EXTM3U'));
    const tracks = [];

    for (let i = 0; i < lines.length; i += 2) {
      const infoLine = lines[i];
      if (infoLine.startsWith('#EXTINF')) {
        const match = infoLine.match(/#EXTINF:(-?\d+),(.+)/);
        if (match) {
          const duration = parseInt(match[1]);
          const info = match[2];
          const [artist, title] = info.split(' - ');

          tracks.push({
            title: title || 'Unknown',
            artist: artist || 'Unknown',
            duration: duration > 0 ? duration : undefined
          });
        }
      }
    }

    return {
      name: 'Imported Playlist',
      tracks
    };
  },

  /**
   * Parser du format texte simple
   */
  parseText(content: string): PlaylistData {
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    const tracks = lines.map(line => {
      // Essayer de parser "Artist - Title"
      const parts = line.split(' - ');
      if (parts.length >= 2) {
        return {
          artist: parts[0].trim(),
          title: parts.slice(1).join(' - ').trim()
        };
      }

      // Sinon traiter comme titre
      return {
        title: line.trim(),
        artist: 'Unknown'
      };
    });

    return {
      name: 'Imported Playlist',
      tracks
    };
  },

  /**
   * Utilitaire: parser une ligne CSV
   */
  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }
};
