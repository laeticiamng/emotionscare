/**
 * Bibliothèque d'histoires
 * @module story-synth
 */

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library, 
  Search, 
  Filter, 
  SortAsc,
  Heart,
  Grid,
  List,
  BookOpen
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { StoryCard } from './StoryCard';

interface Story {
  id: string;
  title?: string;
  theme?: string;
  tone?: string;
  reading_duration_seconds?: number;
  created_at: string;
  completed_at?: string;
  is_favorite?: boolean;
}

interface StoryLibraryProps {
  stories: Story[];
  isLoading?: boolean;
  onReadStory: (id: string) => void;
  onDeleteStory?: (id: string) => void;
  onExportStory?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

type SortOption = 'recent' | 'oldest' | 'duration' | 'theme';
type FilterOption = 'all' | 'completed' | 'in_progress' | 'favorites';
type ViewMode = 'grid' | 'list';

const themeLabels: Record<string, string> = {
  calme: 'Calme',
  aventure: 'Aventure',
  poetique: 'Poétique',
  mysterieux: 'Mystérieux',
  romance: 'Romance',
  introspection: 'Introspection',
  nature: 'Nature',
};

export const StoryLibrary = memo(function StoryLibrary({
  stories,
  isLoading,
  onReadStory,
  onDeleteStory,
  onExportStory,
  onToggleFavorite,
}: StoryLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');

  // Filter and sort stories
  const filteredStories = stories
    .filter(story => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = story.title?.toLowerCase().includes(query);
        const matchesTheme = story.theme?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTheme) return false;
      }

      // Filter
      if (filterBy === 'completed' && !story.completed_at) return false;
      if (filterBy === 'in_progress' && story.completed_at) return false;
      if (filterBy === 'favorites' && !story.is_favorite) return false;

      // Theme
      if (selectedTheme !== 'all' && story.theme !== selectedTheme) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'duration':
          return (b.reading_duration_seconds || 0) - (a.reading_duration_seconds || 0);
        case 'theme':
          return (a.theme || '').localeCompare(b.theme || '');
        default:
          return 0;
      }
    });

  // Get unique themes
  const themes = [...new Set(stories.map(s => s.theme).filter(Boolean))];

  // Stats
  const totalStories = stories.length;
  const completedStories = stories.filter(s => s.completed_at).length;
  const favoriteStories = stories.filter(s => s.is_favorite).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Library className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Ma Bibliothèque</h2>
            <p className="text-sm text-muted-foreground">
              {totalStories} histoire{totalStories > 1 ? 's' : ''} • {completedStories} terminée{completedStories > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="hidden sm:flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <BookOpen className="w-3 h-3" />
            {completedStories}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Heart className="w-3 h-3" />
            {favoriteStories}
          </Badge>
        </div>
      </div>

      {/* Filters bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une histoire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter */}
          <Select value={filterBy} onValueChange={(v) => setFilterBy(v as FilterOption)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="favorites">Favoris</SelectItem>
            </SelectContent>
          </Select>

          {/* Theme filter */}
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les thèmes</SelectItem>
              {themes.map(theme => (
                <SelectItem key={theme} value={theme!}>
                  {themeLabels[theme!] || theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[140px]">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="oldest">Plus anciennes</SelectItem>
              <SelectItem value="duration">Durée</SelectItem>
              <SelectItem value="theme">Thème</SelectItem>
            </SelectContent>
          </Select>

          {/* View mode */}
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(v) => v && setViewMode(v as ViewMode)}
          >
            <ToggleGroupItem value="grid" aria-label="Vue grille">
              <Grid className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="Vue liste">
              <List className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Card>

      {/* Stories grid/list */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-48 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filteredStories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Library className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {stories.length === 0 
              ? 'Votre bibliothèque est vide'
              : 'Aucune histoire trouvée'}
          </h3>
          <p className="text-muted-foreground">
            {stories.length === 0
              ? 'Créez votre première histoire pour la voir ici'
              : 'Essayez de modifier vos filtres'}
          </p>
        </motion.div>
      ) : (
        <div 
          className={cn(
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          )}
        >
          <AnimatePresence mode="popLayout">
            {filteredStories.map((story, index) => (
              <StoryCard
                key={story.id}
                story={story}
                onRead={onReadStory}
                onDelete={onDeleteStory}
                onExport={onExportStory}
                onToggleFavorite={onToggleFavorite}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
});

export default StoryLibrary;
