// @ts-nocheck
import { useState, useMemo } from 'react';
import { useRoleAuditLogs } from '@/hooks/useRoleAuditLogs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Plus, Trash2, RefreshCw, History, Download, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
import { getRoleLabel } from '@/services/userRolesService';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { exportAuditLogsToCSV, AuditExportFilters } from '@/services/roleAuditExportService';
import { toast } from 'sonner';

export const RoleAuditLogsViewer = () => {
  const [page, setPage] = useState(0);
  const limit = 50;
  const offset = page * limit;

  // Filtres
  const [searchEmail, setSearchEmail] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isExporting, setIsExporting] = useState(false);

  const { data: allLogs = [], isLoading, refetch } = useRoleAuditLogs(1000, 0);

  // Filtrage local des logs
  const filteredLogs = useMemo(() => {
    let filtered = [...allLogs];

    // Filtre par email
    if (searchEmail) {
      const search = searchEmail.toLowerCase();
      filtered = filtered.filter((log) =>
        log.user_email.toLowerCase().includes(search)
      );
    }

    // Filtre par action
    if (filterAction !== 'all') {
      filtered = filtered.filter((log) => log.action === filterAction);
    }

    // Filtre par date de début
    if (startDate) {
      filtered = filtered.filter(
        (log) => new Date(log.changed_at) >= startDate
      );
    }

    // Filtre par date de fin
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (log) => new Date(log.changed_at) <= endOfDay
      );
    }

    return filtered;
  }, [allLogs, searchEmail, filterAction, startDate, endDate]);

  // Pagination des logs filtrés
  const paginatedLogs = useMemo(() => {
    const start = page * limit;
    return filteredLogs.slice(start, start + limit);
  }, [filteredLogs, page, limit]);

  const hasActiveFilters = searchEmail || filterAction !== 'all' || startDate || endDate;

  const clearFilters = () => {
    setSearchEmail('');
    setFilterAction('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(0);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const filters: AuditExportFilters = {
        startDate,
        endDate,
        action: filterAction !== 'all' ? (filterAction as any) : null,
        userEmail: searchEmail || undefined,
      };

      await exportAuditLogsToCSV(filters);
      toast.success(`${filteredLogs.length} logs exportés en CSV`);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'add':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Plus className="h-3 w-3" />
            Ajouté
          </Badge>
        );
      case 'remove':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Trash2 className="h-3 w-3" />
            Retiré
          </Badge>
        );
      case 'update':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Modifié
          </Badge>
        );
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-muted-foreground" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Historique d'audit</h2>
            <p className="text-muted-foreground">
              {filteredLogs.length} log{filteredLogs.length > 1 ? 's' : ''} {hasActiveFilters && 'filtré(s)'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || filteredLogs.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Export...' : 'Exporter CSV'}
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="grid gap-4 md:grid-cols-4 p-4 rounded-lg border bg-card">
        <div className="space-y-2">
          <Label htmlFor="search-email" className="text-xs font-medium flex items-center gap-2">
            <Filter className="h-3 w-3" />
            Email utilisateur
          </Label>
          <Input
            id="search-email"
            placeholder="Rechercher par email..."
            value={searchEmail}
            onChange={(e) => {
              setSearchEmail(e.target.value);
              setPage(0);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-action" className="text-xs font-medium">
            Action
          </Label>
          <Select
            value={filterAction}
            onValueChange={(value) => {
              setFilterAction(value);
              setPage(0);
            }}
          >
            <SelectTrigger id="filter-action">
              <SelectValue placeholder="Toutes les actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les actions</SelectItem>
              <SelectItem value="add">Ajouté</SelectItem>
              <SelectItem value="remove">Retiré</SelectItem>
              <SelectItem value="update">Modifié</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Date de début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setPage(0);
                }}
                locale={fr}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Date de fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setPage(0);
                }}
                locale={fr}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {hasActiveFilters && (
          <div className="md:col-span-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {/* Tableau */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead>Par</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {hasActiveFilters
                    ? 'Aucun log ne correspond aux critères de recherche'
                    : 'Aucun log d\'audit disponible'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {formatDistanceToNow(new Date(log.changed_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{log.user_email}</TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRoleLabel(log.role as any)}</Badge>
                  </TableCell>
                  <TableCell>
                    {log.old_role && log.new_role && (
                      <span className="text-xs text-muted-foreground">
                        {getRoleLabel(log.old_role as any)} → {getRoleLabel(log.new_role as any)}
                      </span>
                    )}
                    {log.action === 'add' && !log.old_role && (
                      <span className="text-xs text-muted-foreground">
                        Nouveau rôle attribué
                      </span>
                    )}
                    {log.action === 'remove' && !log.new_role && (
                      <span className="text-xs text-muted-foreground">
                        Rôle révoqué
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.changed_by_email || 'Système'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} • Affichage {paginatedLogs.length} sur {filteredLogs.length} résultat
            {filteredLogs.length > 1 ? 's' : ''}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * limit >= filteredLogs.length}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
