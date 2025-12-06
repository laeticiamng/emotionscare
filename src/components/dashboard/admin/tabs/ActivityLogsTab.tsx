// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { logger } from '@/lib/logger';

interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  timestamp: string;
  details?: string;
  resource_type?: string;
}

interface ActivityLogsTabProps {
  companyId?: string;
  showAll?: boolean;
}

const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({ companyId, showAll = false }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockLogs: ActivityLog[] = [
            {
              id: '1',
              user_id: 'user_1',
              user_name: 'Jean Dupont',
              action: 'login',
              timestamp: new Date().toISOString(),
              resource_type: 'auth'
            },
            {
              id: '2',
              user_id: 'user_2',
              user_name: 'Marie Martin',
              action: 'viewed_report',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              details: 'Rapport mensuel',
              resource_type: 'report'
            }
          ];
          
          setLogs(mockLogs);
          setLoading(false);
        }, 1000);
      } catch (error) {
        logger.error('Error fetching activity logs', error as Error, 'UI');
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, [companyId, showAll]);
  
  const filteredLogs = logs.filter(log => {
    // Apply type filter
    if (filter !== 'all' && log.resource_type !== filter) {
      return false;
    }
    
    // Apply search term
    if (searchTerm && !log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !log.action.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
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
  
  const getActionLabel = (action: string) => {
    const actions: Record<string, string> = {
      login: 'Connexion',
      logout: 'Déconnexion',
      viewed_report: 'Consultation de rapport',
      created_user: 'Création d\'utilisateur',
      updated_preferences: 'Mise à jour des préférences',
      completed_session: 'Session complétée'
    };
    
    return actions[action] || action;
  };
  
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="w-full md:w-2/3">
            <Label htmlFor="search">Rechercher</Label>
            <Input 
              id="search"
              placeholder="Rechercher par utilisateur ou action..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <Label htmlFor="filter">Filtrer par type</Label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger id="filter">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="auth">Authentification</SelectItem>
                <SelectItem value="report">Rapports</SelectItem>
                <SelectItem value="user">Utilisateurs</SelectItem>
                <SelectItem value="session">Sessions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Chargement des activités...</TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Aucune activité trouvée</TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user_name}</TableCell>
                    <TableCell>{getActionLabel(log.action)}</TableCell>
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                    <TableCell>{log.details || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default ActivityLogsTab;
