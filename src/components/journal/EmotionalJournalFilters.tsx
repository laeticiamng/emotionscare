/**
 * EmotionalJournalFilters - Filtres pour le journal émotionnel
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { EMOTIONAL_OPTIONS, EmotionalType } from './EmotionalJournalSelector';
import { format, subDays, startOfMonth, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface EmotionalJournalFiltersProps {
  emotion: EmotionalType | 'all';
  startDate: Date | undefined;
  endDate: Date | undefined;
  onEmotionChange: (emotion: EmotionalType | 'all') => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onReset: () => void;
}

export const EmotionalJournalFilters: React.FC<EmotionalJournalFiltersProps> = ({
  emotion,
  startDate,
  endDate,
  onEmotionChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}) => {
  const hasFilters = emotion !== 'all' || startDate || endDate;

  const quickPeriods = [
    { label: 'Aujourd\'hui', start: new Date(), end: new Date() },
    { label: '7 jours', start: subDays(new Date(), 7), end: new Date() },
    { label: '30 jours', start: subDays(new Date(), 30), end: new Date() },
    { label: 'Ce mois', start: startOfMonth(new Date()), end: new Date() },
    { label: 'Cette semaine', start: startOfWeek(new Date(), { locale: fr }), end: new Date() },
  ];

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filtres
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs">
              <X className="h-3 w-3 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Filtre par émotion */}
        <div className="space-y-2">
          <Label className="text-xs">Émotion</Label>
          <Select value={emotion} onValueChange={(v) => onEmotionChange(v as EmotionalType | 'all')}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Toutes les émotions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les émotions</SelectItem>
              {EMOTIONAL_OPTIONS.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.emoji} {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Périodes rapides */}
        <div className="space-y-2">
          <Label className="text-xs">Période rapide</Label>
          <div className="flex flex-wrap gap-1">
            {quickPeriods.map((period) => (
              <Button
                key={period.label}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  onStartDateChange(period.start);
                  onEndDateChange(period.end);
                }}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Dates personnalisées */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Du</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-9 justify-start text-left font-normal text-xs',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {startDate ? format(startDate, 'dd/MM/yyyy') : 'Début'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Au</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-9 justify-start text-left font-normal text-xs',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {endDate ? format(endDate, 'dd/MM/yyyy') : 'Fin'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalJournalFilters;
