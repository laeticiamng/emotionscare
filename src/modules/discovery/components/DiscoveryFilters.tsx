/**
 * Filtres de découverte
 * @module discovery
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Clock,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { DiscoveryFilters as FiltersType, DiscoveryCategory, DifficultyLevel, DiscoveryStatus } from '../types';

interface DiscoveryFiltersProps {
  filters: FiltersType;
  onUpdateFilters: (filters: Partial<FiltersType>) => void;
  onReset: () => void;
}

const categories: { value: DiscoveryCategory; label: string; icon: string }[] = [
  { value: 'emotion', label: 'Émotions', icon: '🎭' },
  { value: 'activity', label: 'Activités', icon: '🏃' },
  { value: 'technique', label: 'Techniques', icon: '🛠️' },
  { value: 'insight', label: 'Insights', icon: '💡' },
  { value: 'challenge', label: 'Défis', icon: '🏆' },
  { value: 'ressource', label: 'Ressources', icon: '📚' },
];

const difficulties: { value: DifficultyLevel; label: string; color: string }[] = [
  { value: 'beginner', label: 'Débutant', color: 'bg-green-500/10 text-green-600' },
  { value: 'intermediate', label: 'Intermédiaire', color: 'bg-yellow-500/10 text-yellow-600' },
  { value: 'advanced', label: 'Avancé', color: 'bg-orange-500/10 text-orange-600' },
  { value: 'expert', label: 'Expert', color: 'bg-red-500/10 text-red-600' },
];

const statuses: { value: DiscoveryStatus; label: string }[] = [
  { value: 'available', label: 'Disponible' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Complété' },
  { value: 'mastered', label: 'Maîtrisé' },
  { value: 'locked', label: 'Verrouillé' },
];

export const DiscoveryFiltersPanel = memo(function DiscoveryFiltersPanel({
  filters,
  onUpdateFilters,
  onReset,
}: DiscoveryFiltersProps) {
  const hasActiveFilters = !!(
    filters.category?.length ||
    filters.difficulty?.length ||
    filters.status?.length ||
    filters.minDuration ||
    filters.maxDuration ||
    filters.searchQuery
  );

  const toggleCategory = (cat: DiscoveryCategory) => {
    const current = filters.category || [];
    const updated = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    onUpdateFilters({ category: updated.length ? updated : undefined });
  };

  const toggleDifficulty = (diff: DifficultyLevel) => {
    const current = filters.difficulty || [];
    const updated = current.includes(diff)
      ? current.filter(d => d !== diff)
      : [...current, diff];
    onUpdateFilters({ difficulty: updated.length ? updated : undefined });
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une découverte..."
          value={filters.searchQuery || ''}
          onChange={(e) => onUpdateFilters({ searchQuery: e.target.value || undefined })}
          className="pl-10 pr-10"
        />
        {filters.searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => onUpdateFilters({ searchQuery: undefined })}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filtres rapides - Catégories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <Button
            key={cat.value}
            variant="outline"
            size="sm"
            onClick={() => toggleCategory(cat.value)}
            className={cn(
              'gap-1.5',
              filters.category?.includes(cat.value) && 'bg-primary/10 border-primary text-primary'
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </Button>
        ))}
      </div>

      {/* Filtres avancés */}
      <div className="flex items-center gap-2">
        {/* Difficulté */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Difficulté
              {filters.difficulty?.length ? (
                <Badge variant="secondary" className="ml-1">
                  {filters.difficulty.length}
                </Badge>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Niveau de difficulté</h4>
              {difficulties.map(diff => (
                <Button
                  key={diff.value}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'w-full justify-start',
                    filters.difficulty?.includes(diff.value) && diff.color
                  )}
                  onClick={() => toggleDifficulty(diff.value)}
                >
                  {diff.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Statut */}
        <Select
          value={filters.status?.[0] || 'all'}
          onValueChange={(value) => 
            onUpdateFilters({ 
              status: value === 'all' ? undefined : [value as DiscoveryStatus] 
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Durée */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Clock className="w-4 h-4" />
              Durée
              {(filters.minDuration || filters.maxDuration) ? (
                <Badge variant="secondary" className="ml-1">
                  {filters.minDuration || 0}-{filters.maxDuration || 60}
                </Badge>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Durée (minutes)</h4>
              <Slider
                value={[filters.minDuration || 0, filters.maxDuration || 60]}
                min={0}
                max={60}
                step={5}
                onValueChange={([min, max]) => 
                  onUpdateFilters({ 
                    minDuration: min > 0 ? min : undefined,
                    maxDuration: max < 60 ? max : undefined 
                  })
                }
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{filters.minDuration || 0} min</span>
                <span>{filters.maxDuration || 60} min</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Reset */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReset}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filtres actifs */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {filters.category?.map(cat => {
              const catInfo = categories.find(c => c.value === cat);
              return (
                <Badge key={cat} variant="secondary" className="gap-1">
                  {catInfo?.icon} {catInfo?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => toggleCategory(cat)}
                  />
                </Badge>
              );
            })}
            {filters.difficulty?.map(diff => {
              const diffInfo = difficulties.find(d => d.value === diff);
              return (
                <Badge key={diff} variant="secondary" className="gap-1">
                  {diffInfo?.label}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => toggleDifficulty(diff)}
                  />
                </Badge>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default DiscoveryFiltersPanel;
