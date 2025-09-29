
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Filter } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityFiltersProps {
  filters: {
    startDate: string;
    endDate: string;
    activityType: string;
    searchTerm: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    startDate: string;
    endDate: string;
    activityType: string;
    searchTerm: string;
  }>>;
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({ filters, setFilters }) => {
  const [searchValue, setSearchValue] = useState(filters.searchTerm);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, searchTerm: searchValue }));
  };

  const handleReset = () => {
    setSearchValue('');
    setFilters({
      startDate: '',
      endDate: '',
      activityType: 'all',
      searchTerm: '',
    });
  };

  return (
    <div className="space-y-4 w-full">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button type="submit" variant="outline" size="sm">
          Filtrer
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleReset}
        >
          Réinitialiser
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <Calendar className="mr-2 h-3.5 w-3.5" />
              {filters.startDate 
                ? format(new Date(filters.startDate), 'dd MMM yyyy', { locale: fr })
                : "Date début"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={filters.startDate ? new Date(filters.startDate) : undefined}
              onSelect={(date) => {
                setFilters(prev => ({ 
                  ...prev, 
                  startDate: date ? date.toISOString() : '' 
                }));
                setStartDateOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <Calendar className="mr-2 h-3.5 w-3.5" />
              {filters.endDate 
                ? format(new Date(filters.endDate), 'dd MMM yyyy', { locale: fr })
                : "Date fin"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={filters.endDate ? new Date(filters.endDate) : undefined}
              onSelect={(date) => {
                setFilters(prev => ({ 
                  ...prev, 
                  endDate: date ? date.toISOString() : '' 
                }));
                setEndDateOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center">
          <Select
            value={filters.activityType}
            onValueChange={(value) => 
              setFilters(prev => ({ ...prev, activityType: value }))
            }
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <Filter className="mr-2 h-3.5 w-3.5" />
              <SelectValue placeholder="Type d'activité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="login">Connexion</SelectItem>
              <SelectItem value="scan">Scan émotionnel</SelectItem>
              <SelectItem value="journal">Journal</SelectItem>
              <SelectItem value="vr_session">Session VR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ActivityFilters;
