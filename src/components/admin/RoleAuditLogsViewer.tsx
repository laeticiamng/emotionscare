// @ts-nocheck
import { useState } from 'react';
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
import { ChevronLeft, ChevronRight, Plus, Trash2, RefreshCw, History } from 'lucide-react';
import { getRoleLabel } from '@/services/userRolesService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const RoleAuditLogsViewer = () => {
  const [page, setPage] = useState(0);
  const limit = 50;
  const offset = page * limit;

  const { data: logs = [], isLoading, refetch } = useRoleAuditLogs(limit, offset);

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
              Journal de tous les changements de rôles
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
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
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Aucun log d'audit disponible
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
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
      {logs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} • {logs.length} résultats
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
              disabled={logs.length < limit}
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
