// @ts-nocheck
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminAccessLog } from '@types/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AccessLogsTable: React.FC = () => {
  // Mock data that aligns with our updated AdminAccessLog type
  const logs: AdminAccessLog[] = [
    {
      id: '1',
      adminId: 'admin1',
      adminName: 'Sophie Martin',
      action: 'Connexion au système',
      timestamp: new Date().toISOString(),
      ip: '192.168.1.1',
      userId: 'user123',
      resource: 'auth/login'
    },
    {
      id: '2',
      adminId: 'admin2',
      adminName: 'Thomas Bernard',
      action: 'Modification de profil',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ip: '192.168.1.2',
      userId: 'user456',
      resource: 'users/profile',
      details: 'Mise à jour des préférences utilisateur'
    },
    {
      id: '3',
      adminId: 'admin1',
      adminName: 'Sophie Martin',
      action: 'Export de données',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      ip: '192.168.1.1',
      resource: 'reports/export',
      details: 'Export du rapport émotionnel mensuel'
    },
    {
      id: '4',
      adminId: 'admin3',
      adminName: 'Jean Dupont',
      action: 'Création équipe',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      ip: '192.168.1.3',
      resource: 'teams/create'
    }
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Administrateur</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Quand</TableHead>
          <TableHead>Ressource</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-medium">{log.adminName || log.adminId}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: fr })}</TableCell>
            <TableCell>{log.resource}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AccessLogsTable;
