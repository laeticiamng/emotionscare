/**
 * Music Search and Filter - Recherche avancée et filtrage
 * Full-text search, filtres par mood/genre/durée
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  X,
  Sliders,
  Music,
  Clock,
  Zap,
  Heart,
  Brain,
} from 'lucide-react';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood: string;
  category: string;
  color: string;
}

interface FilterOptions {
  moods: string[];
  categories: string[];
  durationRange: [number, number]; // in minutes
}

interface MusicSearchAndFilterProps {
  tracks: MusicTrack[];
  onTracksFiltered?: (tracks: MusicTrack[]) => void;
  onTrackSelect?: (track: MusicTrack) => void;
}

const MOOD_OPTIONS = ['Calme', 'Énergique', 'Heureux', 'Triste', 'Concentré', 'Créatif'];
const CATEGORY_OPTIONS = ['doux', 'énergique', 'créatif', 'guérison'];

const moodIcons: Record<string, React.ReactNode> = {
  'Calme': '😌',
  'Énergique': '⚡',
  'Heureux': '😊',
  'Triste': '😢',
  'Concentré': '🧠',
  'Créatif': '✨',
};

export const MusicSearchAndFilter: React.FC<MusicSearchAndFilterProps> = ({
  tracks,
  onTracksFiltered,
  onTrackSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    moods: [],
    categories: [],
    durationRange: [0, 600], // 0 to 10 minutes
  });

  // Filtered results
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      // Text search
      const matchesSearch =
        !searchQuery ||
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase());

      // Mood filter
      const matchesMood =
        filters.moods.length === 0 ||
        filters.moods.some((mood) =>
          track.mood.toLowerCase().includes(mood.toLowerCase())
        );

      // Category filter
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(track.category);

      // Duration filter
      const trackDuration = Math.floor(track.duration / 60);
      const matchesDuration =
        trackDuration >= filters.durationRange[0] &&
        trackDuration <= filters.durationRange[1];

      return matchesSearch && matchesMood && matchesCategory && matchesDuration;
    });
  }, [tracks, searchQuery, filters]);

  // Update parent with filtered results
  React.useEffect(() => {
    onTracksFiltered?.(filteredTracks);
  }, [filteredTracks, onTracksFiltered]);

  // Toggle filter
  const toggleFilter = (type: 'mood' | 'category', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      moods: [],
      categories: [],
      durationRange: [0, 600],
    });
  };

  const activeFilterCount =
    filters.moods.length + filters.categories.length +
    (filters.durationRange[0] > 0 || filters.durationRange[1] < 600 ? 1 : 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre ou artiste..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            {searchQuery && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSearchQuery('')}
                className="h-10 w-10 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 gap-2"
            >
              <Sliders className="h-4 w-4" />
              Filtres
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {filteredTracks.length} résultat{filteredTracks.length !== 1 ? 's' : ''}
            {searchQuery && ` pour "${searchQuery}"`}
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4 border-t pt-4">
              {/* Mood Filter */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Humeur
                </h4>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((mood) => (
                    <Button
                      key={mood}
                      size="sm"
                      variant={
                        filters.moods.includes(mood) ? 'default' : 'outline'
                      }
                      onClick={() => toggleFilter('mood', mood)}
                      className="gap-1"
                    >
                      <span>{moodIcons[mood]}</span>
                      {mood}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Catégorie
                </h4>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((category) => {
                    const categoryEmoji = {
                      doux: '💙',
                      énergique: '⚡',
                      créatif: '✨',
                      guérison: '🧠',
                    }[category] || '🎵';

                    return (
                      <Button
                        key={category}
                        size="sm"
                        variant={
                          filters.categories.includes(category)
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => toggleFilter('category', category)}
                        className="gap-1 capitalize"
                      >
                        <span>{categoryEmoji}</span>
                        {category}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Durée
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {filters.durationRange[0]} - {filters.durationRange[1]} min
                  </span>
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="600"
                    value={filters.durationRange[0]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        durationRange: [
                          parseInt(e.target.value),
                          prev.durationRange[1],
                        ],
                      }))
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="600"
                    value={filters.durationRange[1]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        durationRange: [
                          prev.durationRange[0],
                          parseInt(e.target.value),
                        ],
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2 text-xs">
                  {['Court (0-3 min)', 'Moyen (3-5 min)', 'Long (5-10 min)'].map(
                    (label, idx) => (
                      <Button
                        key={label}
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => {
                          const ranges = [
                            [0, 180],
                            [180, 300],
                            [300, 600],
                          ];
                          setFilters((prev) => ({
                            ...prev,
                            durationRange: ranges[idx] as [number, number],
                          }));
                        }}
                      >
                        {label}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Reset Button */}
              {activeFilterCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      {filteredTracks.length > 0 && (
        <CardContent className="pt-4">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredTracks.map((track) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 border cursor-pointer transition-all hover:shadow-md"
                  onClick={() => onTrackSelect?.(track)}
                >
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm truncate">
                      {track.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${track.color}20`,
                          color: track.color,
                        }}
                      >
                        {track.mood}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {Math.floor(track.duration / 60)}:
                        {(track.duration % 60).toString().padStart(2, '0')}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      )}

      {/* Empty State */}
      {filteredTracks.length === 0 && (
        <CardContent className="py-12 text-center">
          <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            {searchQuery || activeFilterCount > 0
              ? 'Aucun titre ne correspond à vos critères'
              : 'Aucun titre disponible'}
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default MusicSearchAndFilter;
