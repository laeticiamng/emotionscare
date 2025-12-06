/**
 * Filtres pour les activités
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import type { ActivityFilters as Filters } from '../types';

interface ActivityFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const ActivityFilters = ({ filters, onFiltersChange }: ActivityFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filtres</h3>
        {hasActiveFilters && (
          <Button size="sm" variant="ghost" onClick={clearFilters} className="h-8">
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-xs">Recherche</Label>
          <Input
            id="search"
            placeholder="Rechercher..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs">Catégorie</Label>
          <Select
            value={filters.category || ''}
            onValueChange={(value) => onFiltersChange({ ...filters, category: value as any })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes</SelectItem>
              <SelectItem value="relaxation">Relaxation</SelectItem>
              <SelectItem value="physical">Physique</SelectItem>
              <SelectItem value="creative">Créative</SelectItem>
              <SelectItem value="social">Sociale</SelectItem>
              <SelectItem value="mindfulness">Pleine conscience</SelectItem>
              <SelectItem value="nature">Nature</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty" className="text-xs">Difficulté</Label>
          <Select
            value={filters.difficulty || ''}
            onValueChange={(value) => onFiltersChange({ ...filters, difficulty: value as any })}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Toutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes</SelectItem>
              <SelectItem value="easy">Facile</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="hard">Difficile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="text-xs">Durée max (min)</Label>
          <Input
            id="duration"
            type="number"
            placeholder="30"
            value={filters.maxDuration || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              maxDuration: e.target.value ? parseInt(e.target.value) : undefined
            })}
          />
        </div>
      </div>
    </div>
  );
};
