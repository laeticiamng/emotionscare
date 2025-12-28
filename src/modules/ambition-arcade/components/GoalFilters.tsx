/**
 * Filtres pour les objectifs Ambition Arcade
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Filter, X, Search, Tag } from 'lucide-react';

export type GoalStatusFilter = 'all' | 'active' | 'completed' | 'abandoned';
export type GoalSortOption = 'newest' | 'oldest' | 'xp' | 'progress';

interface GoalFiltersProps {
  statusFilter: GoalStatusFilter;
  onStatusChange: (status: GoalStatusFilter) => void;
  sortBy: GoalSortOption;
  onSortChange: (sort: GoalSortOption) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const STATUS_OPTIONS: { value: GoalStatusFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'completed', label: 'Complétés' },
  { value: 'abandoned', label: 'Abandonnés' },
];

const SORT_OPTIONS: { value: GoalSortOption; label: string }[] = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'xp', label: 'XP gagné' },
  { value: 'progress', label: 'Progression' },
];

export const GoalFilters: React.FC<GoalFiltersProps> = ({
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  selectedTags,
  onTagToggle,
  availableTags,
  searchQuery,
  onSearchChange,
}) => {
  const hasActiveFilters = statusFilter !== 'all' || selectedTags.length > 0 || searchQuery.length > 0;

  const clearFilters = () => {
    onStatusChange('all');
    selectedTags.forEach(tag => onTagToggle(tag));
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      {/* Search & Main Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un objectif..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as GoalStatusFilter)}>
          <SelectTrigger className="w-[140px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as GoalSortOption)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="w-4 h-4" />
            Effacer
          </Button>
        )}
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <AnimatePresence mode="popLayout">
            {availableTags.slice(0, 15).map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Badge
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => onTagToggle(tag)}
                  >
                    {tag}
                    {isSelected && <X className="w-3 h-3 ml-1" />}
                  </Badge>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default GoalFilters;
