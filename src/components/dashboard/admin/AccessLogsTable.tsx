
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminAccessLog } from '@/types/dashboard';
import { formatDistanceToNow } from 'date-fns';

// Mock data for admin access logs
const mockLogs: AdminAccessLog[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    action: 'User account created',
    userId: 'user-123',
    userName: 'Jean Dupont',
    adminName: 'Admin 1',
    resource: 'users',
    details: 'Created a new user account for engineering team',
    ip: '192.168.1.1'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    action: 'Permission updated',
    userId: 'user-456',
    userName: 'Marie Lambert',
    adminName: 'Admin 2',
    resource: 'permissions',
    details: 'Updated admin access for marketing department',
    ip: '192.168.1.2'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    action: 'Team created',
    userName: 'System',
    adminName: 'Admin 1',
    resource: 'teams',
    details: 'Created a new team: Finance Department',
    ip: '192.168.1.3'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 48 hours ago
    action: 'Config changed',
    adminName: 'Admin 3',
    resource: 'settings',
    details: 'Updated security settings',
    ip: '192.168.1.4'
  }
];

const AccessLogsTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>IP</TableHead>
            <TableHead className="text-right">When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.action}</TableCell>
              <TableCell>{log.resource || 'N/A'}</TableCell>
              <TableCell>{log.adminName || 'System'}</TableCell>
              <TableCell className="text-muted-foreground">{log.ip || 'N/A'}</TableCell>
              <TableCell className="text-right">
                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AccessLogsTable;
