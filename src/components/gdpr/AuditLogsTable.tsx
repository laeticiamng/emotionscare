import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { AuditLog } from '@/hooks/useGDPRMonitoring';

interface AuditLogsTableProps {
  logs: AuditLog[];
  isLoading: boolean;
}

const AuditLogsTable: React.FC<AuditLogsTableProps> = ({ logs, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Extract unique event types for filter
  const eventTypes = useMemo(() => {
    const types = new Set(logs.map((log) => log.event));
    return Array.from(types).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search filter
      const matchesSearch = !searchTerm ||
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target?.toLowerCase().includes(searchTerm.toLowerCase());

      // Event type filter
      const matchesEventType = eventTypeFilter === 'all' || log.event === eventTypeFilter;

      // Date range filter
      const logDate = new Date(log.occurred_at);
      const matchesDateFrom = !dateFrom || logDate >= dateFrom;
      const matchesDateTo = !dateTo || logDate <= dateTo;

      return matchesSearch && matchesEventType && matchesDateFrom && matchesDateTo;
    });
  }, [logs, searchTerm, eventTypeFilter, dateFrom, dateTo]);

  const getEventBadgeVariant = (event: string): 'default' | 'destructive' | 'secondary' => {
    if (event.includes('deletion') || event.includes('delete')) return 'destructive';
    if (event.includes('export') || event.includes('download')) return 'secondary';
    return 'default';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setEventTypeFilter('all');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = searchTerm || eventTypeFilter !== 'all' || dateFrom || dateTo;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal d'audit RGPD</CardTitle>
        <CardDescription>
          Événements RGPD ({filteredLogs.length} événements)
        </CardDescription>

        {/* Filters */}
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Event Type Filter */}
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'événement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date From */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal',
                    !dateFrom && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, 'dd/MM/yyyy', { locale: fr }) : 'Date début'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>

            {/* Date To */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal',
                    !dateTo && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, 'dd/MM/yyyy', { locale: fr }) : 'Date fin'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-2" />
              Effacer les filtres
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredLogs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {hasActiveFilters ? 'Aucun événement ne correspond aux filtres' : 'Aucun événement trouvé'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horodatage</TableHead>
                  <TableHead>Événement</TableHead>
                  <TableHead>Cible</TableHead>
                  <TableHead>Acteur</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {new Date(log.occurred_at).toLocaleString('fr-FR', {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEventBadgeVariant(log.event)}>
                        {log.event}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.target || '-'}</TableCell>
                    <TableCell className="text-sm font-mono truncate max-w-[120px]">
                      {log.actor_id?.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {typeof log.details === 'object'
                        ? JSON.stringify(log.details)
                        : log.details || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogsTable;
