import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface ExportRequest {
  id: string;
  user_email?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  finished_at?: string;
}

interface ExportRequestsTableProps {
  requests: ExportRequest[];
  isLoading: boolean;
}

const ExportRequestsTable: React.FC<ExportRequestsTableProps> = ({ requests, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Search filter
      const matchesSearch = !searchTerm || 
        request.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

      // Date range filter
      const requestDate = new Date(request.created_at);
      const matchesDateFrom = !dateFrom || requestDate >= dateFrom;
      const matchesDateTo = !dateTo || requestDate <= dateTo;

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });
  }, [requests, searchTerm, statusFilter, dateFrom, dateTo]);

  const getStatusBadgeVariant = (status: string): 'default' | 'destructive' | 'secondary' => {
    if (status === 'completed') return 'default';
    if (status === 'failed') return 'destructive';
    return 'secondary';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || dateFrom || dateTo;

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
        <CardTitle>Demandes d'export</CardTitle>
        <CardDescription>
          Historique des demandes d'exportation ({filteredRequests.length} demandes)
        </CardDescription>

        {/* Filters */}
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
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
        {filteredRequests.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {hasActiveFilters ? 'Aucune demande ne correspond aux filtres' : 'Aucune demande d\'export'}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {request.user_email || 'Utilisateur inconnu'}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-muted-foreground">
                      Créé le {format(new Date(request.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </p>
                    {request.finished_at && (
                      <p className="text-sm text-muted-foreground">
                        Terminé le {format(new Date(request.finished_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(request.status)}>
                  {request.status === 'pending' && 'En attente'}
                  {request.status === 'completed' && 'Complété'}
                  {request.status === 'failed' && 'Échoué'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExportRequestsTable;
