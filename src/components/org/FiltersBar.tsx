// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Building, Filter } from 'lucide-react';
import { useOrgStore, GroupBy } from '@/store/org.store';
import { useTranslation } from 'react-i18next';

export const FiltersBar: React.FC = () => {
  const { t } = useTranslation();
  const { filters, setFilters } = useOrgStore();

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select 
          value={filters.range} 
          onValueChange={(value: '7d' | '14d' | '30d') => setFilters({ range: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 jours</SelectItem>
            <SelectItem value="14d">14 jours</SelectItem>
            <SelectItem value="30d">30 jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <Select 
          value={filters.groupBy} 
          onValueChange={(value: GroupBy) => setFilters({ groupBy: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="team">Équipes</SelectItem>
            <SelectItem value="tribe">Tribus</SelectItem>
            <SelectItem value="site">Sites</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Building className="h-4 w-4 text-muted-foreground" />
        <Select 
          value={filters.site || ''} 
          onValueChange={(value) => setFilters({ site: value || undefined })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tous les sites" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les sites</SelectItem>
            <SelectItem value="paris">Paris</SelectItem>
            <SelectItem value="lyon">Lyon</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Min. échantillon: {filters.minN}</span>
      </div>
    </div>
  );
};