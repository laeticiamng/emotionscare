
import React, { useState } from 'react';
import UserActivityTimeline from './UserActivityTimeline';
import { useUserActivityLogs } from '@/hooks/useUserActivityLogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/ui/data-table/Pagination'; // Fix: import default export
import { Download } from 'lucide-react';

interface UserActivityLogTabProps {
  userId: string;
}

const UserActivityLogTab: React.FC<UserActivityLogTabProps> = ({ userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  
  const {
    logs,
    totalLogs,
    totalPages,
    currentPage,
    isLoading,
    error,
    fetchLogs,
    setPage,
    setLimit
  } = useUserActivityLogs({ userId, limit: 10 });

  const handleExport = () => {
    // Function to export logs as CSV
    if (!logs.length) return;
    
    const headers = ['Activity Type', 'Timestamp', 'Details', 'IP'];
    const csvContent = logs.map(log => {
      return [
        log.activity_type,
        new Date(log.timestamp).toLocaleString(),
        JSON.stringify(log.activity_details || {}),
        log.user_ip || 'N/A'
      ].join(',');
    });
    
    const csv = [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `user_activities_${userId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique d'activité</CardTitle>
        <CardDescription>
          Consultez les interactions et activités de l'utilisateur sur la plateforme
        </CardDescription>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par type ou détail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les périodes</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois-ci</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="shrink-0"
            onClick={handleExport}
            disabled={logs.length === 0 || isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {error ? (
          <div className="text-destructive p-4 text-center">
            Erreur: {error}
          </div>
        ) : (
          <>
            <UserActivityTimeline logs={logs} isLoading={isLoading} />
            
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
            
            {!isLoading && logs.length === 0 && !error && (
              <div className="text-center p-8 text-muted-foreground">
                Aucune activité ne correspond aux critères de recherche.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivityLogTab;
