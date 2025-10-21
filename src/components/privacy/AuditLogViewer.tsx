// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Eye, Download, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';

interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  details: any;
  ip_address?: string;
}

const AuditLogViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Erreur chargement logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'gdpr_data_export':
        return <Download className="h-4 w-4" />;
      case 'gdpr_data_deletion_request':
      case 'gdpr_data_deletion_completed':
        return <Trash2 className="h-4 w-4" />;
      case 'data_access':
        return <Eye className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getActionVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (action) {
      case 'gdpr_data_deletion_request':
      case 'gdpr_data_deletion_completed':
        return 'destructive';
      case 'gdpr_data_export':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      'gdpr_data_export': 'Export de données',
      'gdpr_data_deletion_request': 'Demande de suppression',
      'gdpr_data_deletion_completed': 'Suppression effectuée',
      'data_access': 'Accès aux données',
      'login': 'Connexion',
      'logout': 'Déconnexion',
      'profile_update': 'Mise à jour profil',
      'preferences_update': 'Mise à jour préférences'
    };
    return labels[action] || action;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement de l'historique...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Historique des accès et actions
        </CardTitle>
        <CardDescription>
          Journal d'audit de toutes les actions effectuées sur vos données personnelles
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun journal d'activité disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Date et heure</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Adresse IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <Badge variant={getActionVariant(log.action)}>
                            {getActionLabel(log.action)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(log.timestamp), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {log.details && typeof log.details === 'object' ? (
                            <details className="cursor-pointer">
                              <summary className="text-muted-foreground hover:text-foreground">
                                Voir les détails
                              </summary>
                              <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          ) : (
                            <span className="text-muted-foreground">Aucun détail</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono">
                          {log.ip_address || 'Non disponible'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>
                Les journaux d'audit sont conservés pendant 12 mois pour des raisons de sécurité et de conformité.
                Vous pouvez demander leur suppression en contactant notre DPO.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
