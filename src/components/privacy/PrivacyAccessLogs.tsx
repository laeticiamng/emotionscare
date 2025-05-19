
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, User, Activity, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface AccessLog {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  device: string;
  status: 'success' | 'warning' | 'error';
  details?: string;
}

const PrivacyAccessLogs: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching logs
    const timeout = setTimeout(() => {
      setLogs([
        {
          id: '1',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          action: 'Connexion',
          ip: '192.168.1.1',
          device: 'Chrome / Windows',
          status: 'success'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          action: 'Modification des préférences de confidentialité',
          ip: '192.168.1.1',
          device: 'Chrome / Windows',
          status: 'success'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          action: 'Tentative de connexion',
          ip: '45.123.45.67',
          device: 'Safari / iOS',
          status: 'warning',
          details: 'Localisation inhabituelle'
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Succès</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Attention</Badge>;
      case 'error':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Échec</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Historique d'accès et de sécurité
          </CardTitle>
          <CardDescription>
            Suivez toutes les activités liées à votre compte et à vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Chargement de l'historique...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Appareil</TableHead>
                    <TableHead className="text-right">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {logs.map((log) => (
                      <motion.tr 
                        key={log.id}
                        initial={{ opacity: 0, backgroundColor: "rgba(var(--primary-rgb), 0.1)" }}
                        animate={{ opacity: 1, backgroundColor: "transparent" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <TableCell className="font-mono text-xs">
                          {formatDate(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-2">
                            {log.status === 'warning' || log.status === 'error' ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Activity className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <div>{log.action}</div>
                              {log.details && (
                                <div className="text-xs text-muted-foreground mt-1">{log.details}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="text-xs">{log.device}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {getStatusBadge(log.status)}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-4">
            Les journaux d'accès sont conservés pendant 90 jours conformément à notre politique de confidentialité.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrivacyAccessLogs;
