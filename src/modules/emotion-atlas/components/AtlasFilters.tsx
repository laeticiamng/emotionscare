import React from 'react';
import { Calendar, SlidersHorizontal, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { AtlasFilter } from '../types';
import { cn } from '@/lib/utils';

interface AtlasFiltersProps {
  filters: AtlasFilter;
  onFiltersChange: (filters: AtlasFilter) => void;
  className?: string;
}

const TIME_RANGES = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'year', label: 'Année' },
  { value: 'all', label: 'Tout' },
] as const;

const SOURCES = [
  { value: 'scan', label: 'Scan' },
  { value: 'journal', label: 'Journal' },
  { value: 'voice', label: 'Vocal' },
  { value: 'text', label: 'Texte' },
] as const;

const CATEGORIES = [
  { value: 'positive', label: 'Positif', color: 'bg-green-500' },
  { value: 'neutral', label: 'Neutre', color: 'bg-gray-500' },
  { value: 'negative', label: 'Négatif', color: 'bg-red-500' },
] as const;

export const AtlasFilters: React.FC<AtlasFiltersProps> = ({
  filters,
  onFiltersChange,
  className
}) => {
  const activeFiltersCount = [
    filters.timeRange !== 'all' ? 1 : 0,
    filters.minIntensity > 0 ? 1 : 0,
    filters.sources.length < 4 ? 1 : 0,
    filters.categories.length < 3 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Période */}
      <ToggleGroup
        type="single"
        value={filters.timeRange}
        onValueChange={(val) =>
          val && onFiltersChange({ ...filters, timeRange: val as AtlasFilter['timeRange'] })
        }
        className="bg-muted/50 rounded-lg p-1"
      >
        {TIME_RANGES.map((range) => (
          <ToggleGroupItem
            key={range.value}
            value={range.value}
            className="text-xs px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm"
            aria-label={range.label}
          >
            {range.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Filtres avancés */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5 w-5 p-0 justify-center">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="font-medium">Filtres avancés</div>

            {/* Intensité minimum */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Intensité minimum</span>
                <span className="text-muted-foreground">{filters.minIntensity}%</span>
              </div>
              <Slider
                value={[filters.minIntensity]}
                onValueChange={([val]) => onFiltersChange({ ...filters, minIntensity: val })}
                max={100}
                step={5}
              />
            </div>

            {/* Sources */}
            <div className="space-y-2">
              <span className="text-sm">Sources</span>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((source) => (
                  <Badge
                    key={source.value}
                    variant={filters.sources.includes(source.value) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newSources = filters.sources.includes(source.value)
                        ? filters.sources.filter((s) => s !== source.value)
                        : [...filters.sources, source.value];
                      onFiltersChange({
                        ...filters,
                        sources: newSources.length > 0 ? newSources : ['scan']
                      });
                    }}
                  >
                    {source.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Catégories */}
            <div className="space-y-2">
              <span className="text-sm">Catégories</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Badge
                    key={cat.value}
                    variant={filters.categories.includes(cat.value) ? 'default' : 'outline'}
                    className="cursor-pointer gap-1.5"
                    onClick={() => {
                      const newCategories = filters.categories.includes(cat.value)
                        ? filters.categories.filter((c) => c !== cat.value)
                        : [...filters.categories, cat.value];
                      onFiltersChange({
                        ...filters,
                        categories: newCategories.length > 0 ? newCategories : ['positive']
                      });
                    }}
                  >
                    <span className={cn('w-2 h-2 rounded-full', cat.color)} />
                    {cat.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Reset */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() =>
                onFiltersChange({
                  timeRange: 'all',
                  minIntensity: 0,
                  sources: ['scan', 'journal', 'voice', 'text'],
                  categories: ['positive', 'neutral', 'negative']
                })
              }
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
