import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import type { AuditLog } from '@/hooks/useGDPRMonitoring';

interface AuditLogsTableProps {
  logs: AuditLog[];
  isLoading: boolean;
}

const AuditLogsTable: React.FC<AuditLogsTableProps> = ({ logs, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(
    (log) =>
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEventBadgeVariant = (event: string): 'default' | 'destructive' | 'secondary' => {
    if (event.includes('deletion') || event.includes('delete')) return 'destructive';
    if (event.includes('export') || event.includes('download')) return 'secondary';
    return 'default';
  };

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
          Événements RGPD des dernières 24 heures ({filteredLogs.length} événements)
        </CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un événement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredLogs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Aucun événement trouvé</p>
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
