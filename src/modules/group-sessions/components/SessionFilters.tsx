/**
 * Filtres pour les sessions de groupe
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import type { GroupSessionFilters, GroupSessionCategory } from '../types';
import { cn } from '@/lib/utils';

interface SessionFiltersProps {
  filters: GroupSessionFilters;
  categories: GroupSessionCategory[];
  onFilterChange: (filters: GroupSessionFilters) => void;
  onClearFilters: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  wellbeing: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  meditation: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  breathing: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  discussion: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  creative: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  movement: 'bg-green-500/10 text-green-500 border-green-500/20',
  support: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  workshop: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const SessionFilters: React.FC<SessionFiltersProps> = ({
  filters,
  categories,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = filters.category || filters.search || filters.status;

  const handleCategoryToggle = (categoryName: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === categoryName ? undefined : categoryName,
    });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Search & Status Row */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une session..."
              value={filters.search || ''}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value || undefined })
              }
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status || 'all'}
            onValueChange={(v) =>
              onFilterChange({ ...filters, status: v === 'all' ? undefined : v })
            }
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="scheduled">À venir</SelectItem>
              <SelectItem value="live">En direct</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="icon" onClick={onClearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground mr-2">
            <Filter className="h-4 w-4" />
            Catégories:
          </span>
          {categories.map((cat) => (
            <Badge
              key={cat.name}
              variant="outline"
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                filters.category === cat.name
                  ? CATEGORY_COLORS[cat.name]
                  : 'hover:bg-muted'
              )}
              onClick={() => handleCategoryToggle(cat.name)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionFilters;
