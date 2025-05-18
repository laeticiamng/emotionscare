
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AdminAccessLog } from '@/types/dashboard';
import { Eye, FileText, Settings, UserCheck } from 'lucide-react';

const mockAccessLogs: AdminAccessLog[] = [
  { 
    adminId: 'admin1',
    action: 'Consultation des données du segment Marketing',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  { 
    adminId: 'admin2',
    action: 'Téléchargement du rapport anonymisé',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  { 
    adminId: 'admin1',
    action: 'Modification des paramètres de notification',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  { 
    adminId: 'admin3',
    action: 'Vérification d\'identité d\'un utilisateur',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
];

const getActionIcon = (action: string) => {
  if (action.includes('Consultation')) return <Eye className="h-4 w-4 text-blue-500" />;
  if (action.includes('Téléchargement')) return <FileText className="h-4 w-4 text-green-500" />;
  if (action.includes('Modification')) return <Settings className="h-4 w-4 text-amber-500" />;
  if (action.includes('Vérification')) return <UserCheck className="h-4 w-4 text-purple-500" />;
  return null;
};

const AccessLogsTable: React.FC = () => {
  return (
    <div className="relative overflow-x-auto rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Admin</TableHead>
            <TableHead>Action</TableHead>
            <TableHead className="text-right">Quand</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAccessLogs.map((log, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">Admin {log.adminId.charAt(log.adminId.length - 1)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getActionIcon(log.action)}
                  <span className="ml-2">{log.action}</span>
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: fr })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccessLogsTable;
