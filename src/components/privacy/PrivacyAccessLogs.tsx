import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Shield, AlertTriangle, CheckCircle, EyeOff, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Sample data - this would come from the backend in a real app
const sampleLogs = [
  {
    id: '1',
    timestamp: '2025-05-20T15:32:45Z',
    action: 'login',
    ip: '192.168.1.1',
    device: 'Chrome on Windows',
    status: 'success'
  },
  {
    id: '2',
    timestamp: '2025-05-19T18:22:15Z',
    action: 'data_export',
    ip: '192.168.1.1',
    device: 'Chrome on Windows',
    status: 'success'
  },
  {
    id: '3',
    timestamp: '2025-05-18T10:12:30Z',
    action: 'login_attempt',
    ip: '203.0.113.42',
    device: 'Unknown device',
    status: 'warning'
  }
];

const PrivacyAccessLogs: React.FC = () => {
  const [logs] = useState(sampleLogs);

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'login': return 'Connexion';
      case 'login_attempt': return 'Tentative de connexion';
      case 'data_export': return 'Export de données';
      case 'settings_change': return 'Modification des paramètres';
      case 'permission_change': return 'Modification des permissions';
      default: return action;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Succès</Badge>;
      case 'warning':
        return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Avertissement</Badge>;
      case 'error':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Erreur</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Journaux d'accès aux données
          </CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> 
            <span>Historique des accès et des actions liées à vos données sur les 30 derniers jours</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden md:table-cell">Appareil</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      <EyeOff className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>Aucun journal d'accès pour le moment</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(log.timestamp)}</TableCell>
                      <TableCell>{getActionLabel(log.action)}</TableCell>
                      <TableCell className="hidden md:table-cell">{log.device}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-between">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter les journaux
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="ghost" size="sm">
                Voir plus
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrivacyAccessLogs;
