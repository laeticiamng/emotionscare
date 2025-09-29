import React from 'react';
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
import { Search, X, Filter } from '@/lib/icons';
import { ActivityFilters } from '@/store/activity.store';

interface FiltersBarProps {
  filters: ActivityFilters;
  onChange: (filters: Partial<ActivityFilters>) => void;
}

const MODULE_LABELS = {
  boss_grit: 'Boss Grit',
  flash_glow: 'Flash Glow',
  screen_silk: 'Screen-Silk',
  vr_breath: 'VR Respiration',
  journal: 'Journal',
  music_therapy: 'Musicothérapie',
  scan: 'Scanner',
  gamification: 'Gamification'
};

export const FiltersBar: React.FC<FiltersBarProps> = ({ filters, onChange }) => {
  const handleModuleToggle = (module: string) => {
    const newModules = filters.modules.includes(module as any)
      ? filters.modules.filter(m => m !== module)
      : [...filters.modules, module as any];
    onChange({ modules: newModules });
  };

  const clearFilters = () => {
    onChange({
      period: '30d',
      modules: [],
      search: ''
    });
  };

  const hasActiveFilters = filters.modules.length > 0 || filters.search;

  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtres</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Période */}
        <div className="space-y-2">
          <label htmlFor="period" className="text-sm font-medium">
            Période
          </label>
          <Select
            value={filters.period}
            onValueChange={(period: ActivityFilters['period']) => onChange({ period })}
          >
            <SelectTrigger id="period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">3 derniers mois</SelectItem>
              <SelectItem value="custom">Personnalisée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recherche */}
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Rechercher
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Titre, label, tags..."
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Modules</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MODULE_LABELS).map(([module, label]) => (
            <Badge
              key={module}
              variant={filters.modules.includes(module as any) ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => handleModuleToggle(module)}
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};