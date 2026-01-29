/**
 * ModuleFiltersBar - Barre de filtres avancés pour les modules
 * @version 1.0.0
 */

import React, { memo } from 'react';
import { Search, Filter, Star, X, Clock, Zap, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { 
  ModuleCategory, 
  ModuleDifficulty, 
  ModuleDuration 
} from '@/hooks/useModuleFilters';

interface ModuleFiltersBarProps {
  search: string;
  category: ModuleCategory;
  difficulty: ModuleDifficulty;
  duration: ModuleDuration;
  showFavoritesOnly: boolean;
  activeFiltersCount: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: ModuleCategory) => void;
  onDifficultyChange: (value: ModuleDifficulty) => void;
  onDurationChange: (value: ModuleDuration) => void;
  onToggleFavorites: () => void;
  onReset: () => void;
}

const categories: { value: ModuleCategory; label: string }[] = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'wellness', label: 'Bien-être' },
  { value: 'analysis', label: 'Analyse' },
  { value: 'gamification', label: 'Gamification' },
  { value: 'social', label: 'Social' },
  { value: 'immersive', label: 'Immersif' },
  { value: 'clinical', label: 'Clinique' },
];

const difficulties: { value: ModuleDifficulty; label: string }[] = [
  { value: 'all', label: 'Toutes difficultés' },
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Intermédiaire' },
  { value: 'hard', label: 'Avancé' },
];

const durations: { value: ModuleDuration; label: string }[] = [
  { value: 'all', label: 'Toutes durées' },
  { value: '5min', label: '≤ 5 min' },
  { value: '15min', label: '6-15 min' },
  { value: '30min', label: '16-60 min' },
];

const ModuleFiltersBar: React.FC<ModuleFiltersBarProps> = ({
  search,
  category,
  difficulty,
  duration,
  showFavoritesOnly,
  activeFiltersCount,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onDurationChange,
  onToggleFavorites,
  onReset,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un module..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
          aria-label="Rechercher un module"
        />
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filtres:</span>
        </div>

        {/* Catégorie */}
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]" aria-label="Filtrer par catégorie">
            <LayoutGrid className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulté */}
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-[160px]" aria-label="Filtrer par difficulté">
            <Zap className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Difficulté" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((diff) => (
              <SelectItem key={diff.value} value={diff.value}>
                {diff.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Durée */}
        <Select value={duration} onValueChange={onDurationChange}>
          <SelectTrigger className="w-[140px]" aria-label="Filtrer par durée">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Durée" />
          </SelectTrigger>
          <SelectContent>
            {durations.map((dur) => (
              <SelectItem key={dur.value} value={dur.value}>
                {dur.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Favoris */}
        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          size="sm"
          onClick={onToggleFavorites}
          className={cn('gap-2', showFavoritesOnly && 'bg-amber-500 hover:bg-amber-600')}
          aria-pressed={showFavoritesOnly}
          aria-label="Afficher uniquement les favoris"
        >
          <Star className={cn('h-4 w-4', showFavoritesOnly && 'fill-current')} />
          Favoris
        </Button>

        {/* Reset */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-2 text-muted-foreground hover:text-destructive"
            aria-label="Réinitialiser les filtres"
          >
            <X className="h-4 w-4" />
            Réinitialiser
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(ModuleFiltersBar);
