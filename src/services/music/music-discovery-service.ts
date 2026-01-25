/**
 * Service de découverte musicale améliorée
 *
 * Utilise des algorithmes ML pour:
 * - Recommandations basées sur le contexte
 * - Diversité contrôlée des suggestions
 * - Analyse des préférences utilisateur
 * - Découverte serendipity (recommandations surprises)
 * - Clustering d'artistes et genres similaires
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

// ============================================
// TYPES
// ============================================

export interface DiscoveryTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood?: string;
  imageUrl?: string;
  previewUrl?: string;
  similarity: number; // Score de similarité (0-1)
  serendipity: number; // Score de découverte (0-1)
}

export interface DiscoveryResult {
  recommended: DiscoveryTrack[];
  relatedGenres: { genre: string; score: number }[];
  relatedArtists: { artist: string; score: number }[];
  newGenres: string[]; // Genres à explorer
  executionTime: number;
}

export interface UserMusicProfile {
  favoriteGenres: { genre: string; weight: number }[];
  favoriteMoods: { mood: string; weight: number }[];
  favoriteArtists: { artist: string; weight: number }[];
  averageEnergy: number;
  averageValence: number;
  diversityScore: number;
}

// ============================================
// DISCOVERY SERVICE
// ============================================

export const musicDiscoveryService = {
  /**
   * Obtenir le profil musical de l'utilisateur
   */
  async getUserMusicProfile(userId: string): Promise<UserMusicProfile> {
    try {
      // Récupérer l'historique d'écoute
      const { data: history } = await supabase
        .from('music_listening_history')
        .select('*')
        .eq('user_id', userId)
        .order('played_at', { ascending: false })
        .limit(100);

      if (!history || history.length === 0) {
        return {
          favoriteGenres: [],
          favoriteMoods: [],
          favoriteArtists: [],
          averageEnergy: 0.5,
          averageValence: 0.5,
          diversityScore: 0
        };
      }

      // Analyser les préférences
      const genreMap = new Map<string, number>();
      const moodMap = new Map<string, number>();
      const artistMap = new Map<string, number>();
      let totalEnergy = 0;
      let totalValence = 0;

      history.forEach((track: any) => {
        if (track.genre) {
          genreMap.set(track.genre, (genreMap.get(track.genre) || 0) + 1);
        }
        if (track.mood) {
          moodMap.set(track.mood, (moodMap.get(track.mood) || 0) + 1);
        }
        if (track.artist) {
          artistMap.set(track.artist, (artistMap.get(track.artist) || 0) + 1);
        }
        if (track.energy) totalEnergy += track.energy;
        if (track.valence) totalValence += track.valence;
      });

      // Calculer les scores de diversité
      const diversityScore = Math.min(
        (genreMap.size / 20 + moodMap.size / 10) / 2,
        1
      );

      // Transformer en arrays pondérés
      const maxCount = Math.max(...genreMap.values(), ...moodMap.values(), ...artistMap.values());

      const favoriteGenres = Array.from(genreMap.entries())
        .map(([genre, count]) => ({
          genre,
          weight: count / maxCount
        }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 10);

      const favoriteMoods = Array.from(moodMap.entries())
        .map(([mood, count]) => ({
          mood,
          weight: count / maxCount
        }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 10);

      const favoriteArtists = Array.from(artistMap.entries())
        .map(([artist, count]) => ({
          artist,
          weight: count / maxCount
        }))
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 10);

      return {
        favoriteGenres,
        favoriteMoods,
        favoriteArtists,
        averageEnergy: totalEnergy / history.length,
        averageValence: totalValence / history.length,
        diversityScore
      };
    } catch (error) {
      logger.error('Failed to get user music profile', error as Error, 'MUSIC');
      return {
        favoriteGenres: [],
        favoriteMoods: [],
        favoriteArtists: [],
        averageEnergy: 0.5,
        averageValence: 0.5,
        diversityScore: 0
      };
    }
  },

  /**
   * Découvrir de la musique basée sur le profil utilisateur
   */
  async discoverMusic(
    userId: string,
    options?: {
      diversityFactor?: number; // 0-1, contrôle la diversité
      serendipityFactor?: number; // 0-1, contrôle la découverte
      limit?: number;
    }
  ): Promise<DiscoveryResult> {
    const startTime = performance.now();

    try {
      const diversityFactor = options?.diversityFactor ?? 0.5;
      const serendipityFactor = options?.serendipityFactor ?? 0.3;
      const limit = options?.limit ?? 20;

      // Obtenir le profil utilisateur
      const profile = await musicDiscoveryService.getUserMusicProfile(userId);

      // Récupérer les moods écoutés
      const favoriteGenres = profile.favoriteGenres.slice(0, 3);
      const _favoriteMoods = profile.favoriteMoods.slice(0, 3);

      // Récupérer les tracks candidats
      let query = supabase.from('music_tracks').select('*');

      // Filtrer par genres favoris (mais pas seulement)
      if (favoriteGenres.length > 0) {
        const genreList = favoriteGenres.map(g => g.genre);
        query = query.in('genre', genreList);
      }

      const { data: candidates } = await query.limit(100);

      if (!candidates) {
        return {
          recommended: [],
          relatedGenres: [],
          relatedArtists: [],
          newGenres: [],
          executionTime: performance.now() - startTime
        };
      }

      // Scorer chaque track
      const scoredTracks = candidates
        .map(track => {
          const similarity = musicDiscoveryService.calculateTrackSimilarity(track, profile);
          const serendipity = musicDiscoveryService.calculateSerendipity(track, profile);

          // Score final = combinaison pondérée
          const score = (similarity * (1 - serendipityFactor)) +
            (serendipity * serendipityFactor);

          return {
            ...track,
            similarity,
            serendipity,
            finalScore: score
          };
        })
        .sort((a, b) => b.finalScore - a.finalScore);

      // Sélectionner les tracks avec diversité
      const recommended = musicDiscoveryService.selectDiverseTracks(
        scoredTracks,
        limit,
        diversityFactor
      );

      // Récupérer les genres et artistes liés
      const relatedGenres = await musicDiscoveryService.getRelatedGenres(profile);
      const relatedArtists = await musicDiscoveryService.getRelatedArtists(profile);

      // Identifier les nouveaux genres à explorer
      const newGenres = await musicDiscoveryService.findNewGenresToExplore(profile, recommended);

      logger.info('Music discovery executed', {
        userId,
        recommendedCount: recommended.length,
        executionTime: `${(performance.now() - startTime).toFixed(2)}ms`
      }, 'MUSIC');

      return {
        recommended: recommended.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist,
          genre: track.genre,
          mood: track.mood,
          imageUrl: track.image_url,
          previewUrl: track.preview_url,
          similarity: track.similarity,
          serendipity: track.serendipity
        })),
        relatedGenres,
        relatedArtists,
        newGenres,
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      logger.error('Failed to discover music', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Calculer la similarité d'une track avec le profil utilisateur
   */
  calculateTrackSimilarity(track: any, profile: UserMusicProfile): number {
    let similarity = 0;
    let weightSum = 0;

    // Similarité de genre
    const genreWeight = profile.favoriteGenres.find(g => g.genre === track.genre)?.weight || 0;
    similarity += genreWeight * 0.4;
    weightSum += 0.4;

    // Similarité de mood
    if (track.mood) {
      const moodWeight = profile.favoriteMoods.find(m => m.mood === track.mood)?.weight || 0;
      similarity += moodWeight * 0.3;
      weightSum += 0.3;
    }

    // Similarité d'énergie et valence
    const energyDiff = Math.abs(track.energy - profile.averageEnergy);
    const valenceDiff = Math.abs(track.valence - profile.averageValence);
    const acousticSimilarity = 1 - ((energyDiff + valenceDiff) / 2);
    similarity += Math.max(0, acousticSimilarity) * 0.3;
    weightSum += 0.3;

    return weightSum > 0 ? similarity / weightSum : 0;
  },

  /**
   * Calculer le score de serendipity (découverte)
   */
  calculateSerendipity(track: any, profile: UserMusicProfile): number {
    // Plus l'artiste est peu écouté, plus le score est élevé
    const artistWeight = profile.favoriteArtists.find(a => a.artist === track.artist)?.weight || 0;
    const artistSerendipity = 1 - Math.min(artistWeight, 1);

    // Genres non explorés
    const genreWeight = profile.favoriteGenres.find(g => g.genre === track.genre)?.weight || 0;
    const genreSerendipity = 1 - Math.min(genreWeight, 1);

    return (artistSerendipity * 0.6 + genreSerendipity * 0.4);
  },

  /**
   * Sélectionner les tracks avec diversité
   */
  selectDiverseTracks(
    tracks: any[],
    limit: number,
    diversityFactor: number
  ): any[] {
    const selected = [];
    const genreSet = new Set<string>();
    const artistSet = new Set<string>();

    // Ajouter les meilleurs tracks tout en maintenant la diversité
    for (const track of tracks) {
      if (selected.length >= limit) break;

      const genreCount = Array.from(genreSet).filter(g => g === track.genre).length;
      const artistCount = Array.from(artistSet).filter(a => a === track.artist).length;

      // Pénalité pour manque de diversité
      const diversityPenalty = (genreCount + artistCount) * (1 - diversityFactor) * 0.1;
      const adjustedScore = track.finalScore - diversityPenalty;

      if (adjustedScore > 0 || selected.length < limit / 2) {
        selected.push(track);
        genreSet.add(track.genre);
        artistSet.add(track.artist);
      }
    }

    return selected;
  },

  /**
   * Obtenir les genres liés au profil
   */
  async getRelatedGenres(profile: UserMusicProfile): Promise<{ genre: string; score: number }[]> {
    try {
      const relatedGenres: Map<string, number> = new Map();

      // Pour chaque genre favori, trouver les genres liés
      for (const fav of profile.favoriteGenres.slice(0, 3)) {
        const { data: tracks } = await supabase
          .from('music_tracks')
          .select('genre')
          .eq('genre', fav.genre)
          .limit(50);

        if (tracks) {
          const genreMap = new Map<string, number>();
          tracks.forEach((track: any) => {
            if (track.genre && track.genre !== fav.genre) {
              genreMap.set(track.genre, (genreMap.get(track.genre) || 0) + 1);
            }
          });

          genreMap.forEach((count, genre) => {
            const currentScore = relatedGenres.get(genre) || 0;
            relatedGenres.set(genre, currentScore + (count * fav.weight));
          });
        }
      }

      return Array.from(relatedGenres.entries())
        .map(([genre, score]) => ({ genre, score: Math.min(score, 1) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (error) {
      logger.warn('Failed to get related genres', error as Error, 'MUSIC');
      return [];
    }
  },

  /**
   * Obtenir les artistes liés au profil
   */
  async getRelatedArtists(profile: UserMusicProfile): Promise<{ artist: string; score: number }[]> {
    try {
      const relatedArtists: Map<string, number> = new Map();

      // Pour chaque artiste favori, trouver les artistes liés
      for (const fav of profile.favoriteArtists.slice(0, 3)) {
        const { data: tracks } = await supabase
          .from('music_tracks')
          .select('artist, genre')
          .eq('artist', fav.artist)
          .limit(50);

        if (tracks) {
          const genreSet = new Set(tracks.map((t: any) => t.genre));

          // Trouver d'autres artistes dans le même genre
          for (const genre of genreSet) {
            const { data: relatedTracks } = await supabase
              .from('music_tracks')
              .select('artist')
              .eq('genre', genre)
              .limit(30);

            if (relatedTracks) {
              relatedTracks.forEach((track: any) => {
                if (track.artist && track.artist !== fav.artist) {
                  const currentScore = relatedArtists.get(track.artist) || 0;
                  relatedArtists.set(track.artist, currentScore + (fav.weight / 2));
                }
              });
            }
          }
        }
      }

      return Array.from(relatedArtists.entries())
        .map(([artist, score]) => ({ artist, score: Math.min(score, 1) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    } catch (error) {
      logger.warn('Failed to get related artists', error as Error, 'MUSIC');
      return [];
    }
  },

  /**
   * Trouver les nouveaux genres à explorer
   */
  async findNewGenresToExplore(
    profile: UserMusicProfile,
    recommended: any[]
  ): Promise<string[]> {
    try {
      const exploredGenres = new Set(profile.favoriteGenres.map(g => g.genre));
      const recommendedGenres = new Set(recommended.map(t => t.genre));

      // Les nouveaux genres sont ceux recommandés mais non explorés
      const newGenres = Array.from(recommendedGenres).filter(g => !exploredGenres.has(g));

      return newGenres.slice(0, 5);
    } catch (error) {
      logger.warn('Failed to find new genres', error as Error, 'MUSIC');
      return [];
    }
  }
};
