/**
 * Service de recherche et filtrage avancé pour la musique
 *
 * Fournit des fonctionnalités pour:
 * - Recherche par texte (titre, artiste, genre, mood)
 * - Filtrage par multiple critères
 * - Tri avancé
 * - Recherche facettée
 * - Historique de recherche
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

// ============================================
// TYPES
// ============================================

export interface MusicSearchOptions {
  query?: string;
  genres?: string[];
  moods?: string[];
  minEnergy?: number;
  maxEnergy?: number;
  minValence?: number;
  maxValence?: number;
  artists?: string[];
  languages?: string[];
  fromDate?: string;
  toDate?: string;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'popularity' | 'recent' | 'duration' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFacet {
  genre?: { name: string; count: number }[];
  mood?: { name: string; count: number }[];
  artist?: { name: string; count: number }[];
  language?: { name: string; count: number }[];
  energyRange?: { min: number; max: number };
  valenceRange?: { min: number; max: number };
}

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood?: string;
  duration: number;
  energy?: number;
  valence?: number;
  popularity?: number;
  rating?: number;
  playCount?: number;
  imageUrl?: string;
  previewUrl?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  facets: SearchFacet;
  executionTime: number;
}

// ============================================
// SEARCH SERVICE
// ============================================

export const musicSearchService = {
  /**
   * Rechercher de la musique avec filtres avancés
   */
  async search(options: MusicSearchOptions): Promise<SearchResponse> {
    const startTime = performance.now();

    try {
      let query = supabase.from('music_tracks').select('*', { count: 'exact' });

      // Appliquer les filtres
      if (options.query) {
        // Recherche textuelle sur titre, artiste, genre
        query = query.or(
          `title.ilike.%${options.query}%,artist.ilike.%${options.query}%,genre.ilike.%${options.query}%`
        );
      }

      if (options.genres && options.genres.length > 0) {
        query = query.in('genre', options.genres);
      }

      if (options.moods && options.moods.length > 0) {
        query = query.in('mood', options.moods);
      }

      if (options.artists && options.artists.length > 0) {
        query = query.in('artist', options.artists);
      }

      if (options.languages && options.languages.length > 0) {
        query = query.in('language', options.languages);
      }

      // Filtres numériques
      if (options.minEnergy !== undefined) {
        query = query.gte('energy', options.minEnergy);
      }
      if (options.maxEnergy !== undefined) {
        query = query.lte('energy', options.maxEnergy);
      }

      if (options.minValence !== undefined) {
        query = query.gte('valence', options.minValence);
      }
      if (options.maxValence !== undefined) {
        query = query.lte('valence', options.maxValence);
      }

      if (options.minDuration !== undefined) {
        query = query.gte('duration', options.minDuration);
      }
      if (options.maxDuration !== undefined) {
        query = query.lte('duration', options.maxDuration);
      }

      // Filtres de date
      if (options.fromDate) {
        query = query.gte('created_at', options.fromDate);
      }
      if (options.toDate) {
        query = query.lte('created_at', options.toDate);
      }

      // Tri
      const sortBy = options.sortBy || 'relevance';
      const sortOrder = options.sortOrder === 'asc' ? false : true;

      switch (sortBy) {
        case 'popularity':
          query = query.order('popularity', { ascending: !sortOrder });
          break;
        case 'recent':
          query = query.order('created_at', { ascending: !sortOrder });
          break;
        case 'duration':
          query = query.order('duration', { ascending: !sortOrder });
          break;
        case 'rating':
          query = query.order('rating', { ascending: !sortOrder });
          break;
        case 'relevance':
        default:
          // La pertinence est gérée par les critères de recherche
          query = query.order('popularity', { ascending: !sortOrder });
      }

      // Pagination
      const limit = Math.min(options.limit || 20, 100);
      const offset = options.offset || 0;

      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      const results: SearchResult[] = (data || []).map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        genre: track.genre,
        mood: track.mood,
        duration: track.duration,
        energy: track.energy,
        valence: track.valence,
        popularity: track.popularity,
        rating: track.rating,
        playCount: track.play_count,
        imageUrl: track.image_url,
        previewUrl: track.preview_url
      }));

      // Récupérer les facettes
      const facets = await this.getFacets(options);

      const executionTime = performance.now() - startTime;

      logger.info('Music search executed', {
        query: options.query,
        resultsCount: results.length,
        executionTime: `${executionTime.toFixed(2)}ms`
      }, 'MUSIC');

      return {
        results,
        total: count || 0,
        facets,
        executionTime
      };
    } catch (error) {
      logger.error('Music search failed', error as Error, 'MUSIC');
      throw error;
    }
  },

  /**
   * Obtenir les facettes pour les filtres
   */
  async getFacets(_options: MusicSearchOptions): Promise<SearchFacet> {
    const facets: SearchFacet = {};

    try {
      // Récupérer les genres disponibles
      const { data: genreData } = await supabase
        .from('music_tracks')
        .select('genre')
        .not('genre', 'is', null);

      if (genreData) {
        const genreMap = new Map<string, number>();
        genreData.forEach((item: any) => {
          if (item.genre) {
            genreMap.set(item.genre, (genreMap.get(item.genre) || 0) + 1);
          }
        });
        facets.genre = Array.from(genreMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);
      }

      // Récupérer les moods disponibles
      const { data: moodData } = await supabase
        .from('music_tracks')
        .select('mood')
        .not('mood', 'is', null);

      if (moodData) {
        const moodMap = new Map<string, number>();
        moodData.forEach((item: any) => {
          if (item.mood) {
            moodMap.set(item.mood, (moodMap.get(item.mood) || 0) + 1);
          }
        });
        facets.mood = Array.from(moodMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);
      }

      // Récupérer les plages d'énergie et de valence
      const { data: rangeData } = await supabase
        .from('music_tracks')
        .select('energy, valence')
        .not('energy', 'is', null)
        .not('valence', 'is', null);

      if (rangeData && rangeData.length > 0) {
        const energies = rangeData.map((item: any) => item.energy).filter(Boolean);
        const valences = rangeData.map((item: any) => item.valence).filter(Boolean);

        if (energies.length > 0) {
          facets.energyRange = {
            min: Math.min(...energies),
            max: Math.max(...energies)
          };
        }

        if (valences.length > 0) {
          facets.valenceRange = {
            min: Math.min(...valences),
            max: Math.max(...valences)
          };
        }
      }

      return facets;
    } catch (error) {
      logger.warn('Failed to fetch facets', error as Error, 'MUSIC');
      return facets;
    }
  },

  /**
   * Recherche rapide avec suggestions
   */
  async searchWithSuggestions(query: string, limit: number = 10): Promise<{
    results: SearchResult[];
    suggestions: string[];
  }> {
    try {
      // Recherche principale
      const response = await this.search({
        query,
        limit,
        sortBy: 'relevance'
      });

      // Suggestions basées sur la requête
      const suggestions = await this.getSuggestions(query);

      return {
        results: response.results,
        suggestions
      };
    } catch (error) {
      logger.error('Search with suggestions failed', error as Error, 'MUSIC');
      return {
        results: [],
        suggestions: []
      };
    }
  },

  /**
   * Obtenir des suggestions de recherche
   */
  async getSuggestions(query: string): Promise<string[]> {
    try {
      const lowercaseQuery = query.toLowerCase();

      // Récupérer les artistes et titres correspondants
      const { data: tracks } = await supabase
        .from('music_tracks')
        .select('title, artist')
        .or(
          `title.ilike.%${query}%,artist.ilike.%${query}%`
        )
        .limit(20);

      if (!tracks) {
        return [];
      }

      // Compiler les suggestions uniques
      const suggestions = new Set<string>();

      tracks.forEach((track: any) => {
        if (track.artist && track.artist.toLowerCase().includes(lowercaseQuery)) {
          suggestions.add(track.artist);
        }
        if (track.title && track.title.toLowerCase().includes(lowercaseQuery)) {
          suggestions.add(track.title);
        }
      });

      return Array.from(suggestions).slice(0, 10);
    } catch (error) {
      logger.warn('Failed to fetch suggestions', error as Error, 'MUSIC');
      return [];
    }
  },

  /**
   * Historique de recherche
   */
  async saveSearchHistory(userId: string, query: string): Promise<void> {
    try {
      await supabase
        .from('user_search_history')
        .insert({
          user_id: userId,
          query,
          searched_at: new Date().toISOString()
        });

      logger.debug('Search saved to history', { userId, query }, 'MUSIC');
    } catch (error) {
      logger.warn('Failed to save search history', error as Error, 'MUSIC');
      // Ne pas échouer si l'historique ne peut pas être sauvegardé
    }
  },

  /**
   * Récupérer l'historique de recherche
   */
  async getSearchHistory(userId: string, limit: number = 20): Promise<string[]> {
    try {
      const { data } = await supabase
        .from('user_search_history')
        .select('query')
        .eq('user_id', userId)
        .order('searched_at', { ascending: false })
        .limit(limit);

      return data?.map((item: any) => item.query) || [];
    } catch (error) {
      logger.warn('Failed to fetch search history', error as Error, 'MUSIC');
      return [];
    }
  },

  /**
   * Recherche par mood (helper)
   */
  async searchByMood(mood: string, limit: number = 20): Promise<SearchResult[]> {
    try {
      const response = await this.search({
        moods: [mood],
        limit,
        sortBy: 'popularity'
      });

      return response.results;
    } catch (error) {
      logger.error('Failed to search by mood', error as Error, 'MUSIC');
      return [];
    }
  },

  /**
   * Recherche par genre (helper)
   */
  async searchByGenre(genre: string, limit: number = 20): Promise<SearchResult[]> {
    try {
      const response = await this.search({
        genres: [genre],
        limit,
        sortBy: 'popularity'
      });

      return response.results;
    } catch (error) {
      logger.error('Failed to search by genre', error as Error, 'MUSIC');
      return [];
    }
  },

  /**
   * Recherche par artiste (helper)
   */
  async searchByArtist(artist: string, limit: number = 20): Promise<SearchResult[]> {
    try {
      const response = await this.search({
        artists: [artist],
        limit,
        sortBy: 'popularity'
      });

      return response.results;
    } catch (error) {
      logger.error('Failed to search by artist', error as Error, 'MUSIC');
      return [];
    }
  }
};
