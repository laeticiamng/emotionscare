import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Filter,
  FileText,
  Activity,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { useGDPRAuditTrail, exportAuditTrailToCSV } from '@/hooks/useGDPRAuditTrail';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

/**
 * Composant d'audit trail RGPD
 * Affiche toutes les actions RGPD avec filtres et détails
 */
export const GDPRAuditTrail: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [actionType, setActionType] = useState('');
  const [entityType, setEntityType] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const { entries, statistics, isLoading } = useGDPRAuditTrail({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    actionType: actionType || undefined,
    entityType: entityType || undefined,
  });

  const handleExport = () => {
    if (entries.length === 0) {
      toast.error('Aucune entrée à exporter');
      return;
    }
    exportAuditTrailToCSV(entries);
    toast.success(`${entries.length} entrées exportées en CSV`);
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setActionType('');
    setEntityType('');
  };

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      consent_created: 'Consentement créé',
      consent_updated: 'Consentement modifié',
      consent_deleted: 'Consentement supprimé',
      export_requested: 'Export demandé',
      export_completed: 'Export complété',
      export_failed: 'Export échoué',
      deletion_requested: 'Suppression demandée',
      deletion_completed: 'Suppression complétée',
      deletion_failed: 'Suppression échouée',
      alert_created: 'Alerte créée',
      alert_resolved: 'Alerte résolue',
    };
    return labels[type] || type;
  };

  const getActionTypeBadge = (type: string) => {
    if (type.includes('created') || type.includes('requested')) {
      return 'default';
    }
    if (type.includes('completed') || type.includes('resolved')) {
      return 'outline';
    }
    if (type.includes('failed') || type.includes('deleted')) {
      return 'destructive';
    }
    return 'secondary';
  };

  const getEntityTypeIcon = (type: string) => {
    const colors: Record<string, string> = {
      consent: 'text-blue-600',
      export: 'text-green-600',
      deletion: 'text-red-600',
      alert: 'text-orange-600',
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      {statistics && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total d'actions</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {statistics.totalActions}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Activité 24h</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {statistics.recentActivityRate.toFixed(0)}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-950 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Par type d'action</p>
                <div className="space-y-1">
                  {Object.entries(statistics.byActionType)
                    .slice(0, 3)
                    .map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between text-xs">
                        <span className="truncate">{getActionTypeLabel(type)}</span>
                        <Badge variant="outline" className="ml-2">
                          {count}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Par entité</p>
                <div className="space-y-1">
                  {Object.entries(statistics.byEntityType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-xs">
                      <span className="capitalize">{type}</span>
                      <Badge variant="secondary" className="ml-2">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </CardTitle>
              <CardDescription>Filtrer l'audit trail</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Réinitialiser
              </Button>
              <Button size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionType">Type d'action</Label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger id="actionType">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  <SelectItem value="consent_created">Consentement créé</SelectItem>
                  <SelectItem value="consent_updated">Consentement modifié</SelectItem>
                  <SelectItem value="export_requested">Export demandé</SelectItem>
                  <SelectItem value="export_completed">Export complété</SelectItem>
                  <SelectItem value="deletion_requested">Suppression demandée</SelectItem>
                  <SelectItem value="deletion_completed">Suppression complétée</SelectItem>
                  <SelectItem value="alert_created">Alerte créée</SelectItem>
                  <SelectItem value="alert_resolved">Alerte résolue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entityType">Type d'entité</Label>
              <Select value={entityType} onValueChange={setEntityType}>
                <SelectTrigger id="entityType">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="consent">Consentement</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="deletion">Suppression</SelectItem>
                  <SelectItem value="alert">Alerte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des entrées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Trail RGPD
          </CardTitle>
          <CardDescription>
            {entries.length} action{entries.length > 1 ? 's' : ''} tracée{entries.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune action trouvée avec ces filtres
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entité</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(entry.created_at).toLocaleString('fr-FR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionTypeBadge(entry.action_type)}>
                          {getActionTypeLabel(entry.action_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getEntityTypeIcon(entry.entity_type)}`} />
                          <span className="capitalize text-sm">{entry.entity_type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {entry.user_id ? entry.user_id.substring(0, 8) : 'Système'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour les détails */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'action</DialogTitle>
            <DialogDescription>
              {selectedEntry && getActionTypeLabel(selectedEntry.action_type)}
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Date/Heure</Label>
                  <p className="text-sm font-medium">
                    {new Date(selectedEntry.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type d'action</Label>
                  <p className="text-sm font-medium">
                    {getActionTypeLabel(selectedEntry.action_type)}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type d'entité</Label>
                  <p className="text-sm font-medium capitalize">{selectedEntry.entity_type}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">ID Entité</Label>
                  <p className="text-sm font-mono">{selectedEntry.entity_id || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Utilisateur</Label>
                  <p className="text-sm font-mono">{selectedEntry.user_id || 'Système'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Utilisateur concerné</Label>
                  <p className="text-sm font-mono">{selectedEntry.affected_user_id || 'N/A'}</p>
                </div>
              </div>
              
              {selectedEntry.changes && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2">Changements</Label>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    {JSON.stringify(selectedEntry.changes, null, 2)}
                  </pre>
                </div>
              )}
              
              {selectedEntry.metadata && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2">Métadonnées</Label>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    {JSON.stringify(selectedEntry.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GDPRAuditTrail;
