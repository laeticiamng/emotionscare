
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReportsFiltersProps {
  onFiltersChange: (filters: Record<string, any>) => void;
}

const ReportsFilters: React.FC<ReportsFiltersProps> = ({ onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    period: 'month',
    dateRange: { start: null as Date | null, end: null as Date | null },
    departments: [] as string[],
    metrics: [] as string[],
    userGroups: [] as string[]
  });

  const departments = [
    'Développement', 'Marketing', 'Ventes', 'RH', 'Support', 'Finance'
  ];

  const metrics = [
    'Bien-être', 'Productivité', 'Engagement', 'Stress', 'Satisfaction'
  ];

  const userGroups = [
    'Managers', 'Employés', 'Nouveaux arrivants', 'Équipes projet'
  ];

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = filters[key as keyof typeof filters] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters = {
      period: 'month',
      dateRange: { start: null, end: null },
      departments: [],
      metrics: [],
      userGroups: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const activeFiltersCount = 
    (filters.departments.length > 0 ? 1 : 0) +
    (filters.metrics.length > 0 ? 1 : 0) +
    (filters.userGroups.length > 0 ? 1 : 0) +
    (filters.dateRange.start ? 1 : 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filtres des Rapports</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Période */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Période</label>
            <Select value={filters.period} onValueChange={(value) => updateFilter('period', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
                <SelectItem value="custom">Personnalisée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Plage de dates personnalisée */}
          {filters.period === 'custom' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Dates personnalisées</label>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {filters.dateRange.start ? 
                        format(filters.dateRange.start, 'PPP', { locale: fr }) : 
                        'Date de début'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.start}
                      onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, start: date })}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {filters.dateRange.end ? 
                        format(filters.dateRange.end, 'PPP', { locale: fr }) : 
                        'Date de fin'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.end}
                      onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, end: date })}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Départements */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Départements</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {departments.map((dept) => (
                <div key={dept} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${dept}`}
                    checked={filters.departments.includes(dept)}
                    onCheckedChange={() => toggleArrayFilter('departments', dept)}
                  />
                  <label htmlFor={`dept-${dept}`} className="text-sm cursor-pointer">
                    {dept}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Métriques */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Métriques</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {metrics.map((metric) => (
                <div key={metric} className="flex items-center space-x-2">
                  <Checkbox
                    id={`metric-${metric}`}
                    checked={filters.metrics.includes(metric)}
                    onCheckedChange={() => toggleArrayFilter('metrics', metric)}
                  />
                  <label htmlFor={`metric-${metric}`} className="text-sm cursor-pointer">
                    {metric}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Groupes d'utilisateurs */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Groupes d'utilisateurs</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {userGroups.map((group) => (
                <div key={group} className="flex items-center space-x-2">
                  <Checkbox
                    id={`group-${group}`}
                    checked={filters.userGroups.includes(group)}
                    onCheckedChange={() => toggleArrayFilter('userGroups', group)}
                  />
                  <label htmlFor={`group-${group}`} className="text-sm cursor-pointer">
                    {group}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Appliquer les filtres
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReportsFilters;
