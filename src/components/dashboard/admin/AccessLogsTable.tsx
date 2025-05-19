
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminAccessLog } from '@/types/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock data for demo purposes
const mockLogs: AdminAccessLog[] = [
  {
    id: '1',
    adminName: 'Thomas Durand',
    adminId: 'admin-1',
    action: 'Visualisation données',
    details: 'Tableau de bord analytique',
    resource: 'Tableau de bord analytique',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    ip: '192.168.1.1',
    userName: 'Thomas Durand'
  },
  {
    id: '2',
    adminName: 'Sophie Martin',
    adminId: 'admin-1',
    action: 'Export rapport',
    details: 'Rapports mensuels',
    resource: 'Rapports mensuels',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    ip: '192.168.1.2',
    userName: 'Sophie Martin'
  },
  {
    id: '3',
    adminName: 'Marie Lambert',
    adminId: 'admin-2',
    action: 'Modification paramètres',
    details: 'Configuration système',
    resource: 'Configuration système',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    ip: '192.168.1.3',
    userName: 'Marie Lambert'
  },
  {
    id: '4',
    adminName: 'Pierre Dupont',
    adminId: 'admin-1',
    action: 'Ajout utilisateur',
    details: 'Gestion utilisateurs',
    resource: 'Gestion utilisateurs',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    ip: '192.168.1.4',
    userName: 'Pierre Dupont'
  }
];

const AccessLogsTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Administrateur</TableHead>
            <TableHead className="hidden md:table-cell">Action</TableHead>
            <TableHead>Ressource</TableHead>
            <TableHead className="hidden lg:table-cell">IP</TableHead>
            <TableHead className="text-right">Horodatage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.userName || log.adminName}</TableCell>
              <TableCell className="hidden md:table-cell">{log.action}</TableCell>
              <TableCell>{log.resource || log.details}</TableCell>
              <TableCell className="hidden lg:table-cell">{log.ip}</TableCell>
              <TableCell className="text-right">
                {typeof log.timestamp === 'string' 
                  ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: fr })
                  : formatDistanceToNow(log.timestamp, { addSuffix: true, locale: fr })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccessLogsTable;
