
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/data-table/Pagination";
import { supabase } from '@/lib/supabase-client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ActivityLog } from '@/components/admin/UserActivityTimeline';

const ActivityLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activityType, setActivityType] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('user_activity_logs')
        .select('*, users:user_id(name, email)', { count: 'exact' });
      
      // Apply filters
      if (searchTerm) {
        query = query.or(`activity_details.ilike.%${searchTerm}%,users.name.ilike.%${searchTerm}%,users.email.ilike.%${searchTerm}%`);
      }
      
      if (activityType !== 'all') {
        query = query.eq('activity_type', activityType);
      }
      
      if (startDate) {
        query = query.gte('timestamp', startDate.toISOString());
      }
      
      if (endDate) {
        // Set time to end of day for end date
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('timestamp', endOfDay.toISOString());
      }
      
      // Calculate pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Execute query with pagination
      const { data, error: fetchError, count } = await query
        .order('timestamp', { ascending: false })
        .range(from, to);
        
      if (fetchError) throw new Error(fetchError.message);
      
      // Transform data to include user info
      const transformedLogs = data?.map(log => ({
        id: log.id,
        user_id: log.user_id,
        activity_type: log.activity_type,
        activity_details: log.activity_details,
        timestamp: log.timestamp,
        user_ip: log.user_ip,
        userName: log.users?.name || 'Unknown User',
        userEmail: log.users?.email || 'unknown@email.com'
      }));
      
      setLogs(transformedLogs || []);
      setTotalLogs(count || 0);
      setTotalPages(Math.ceil((count || 0) / pageSize));
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity logs');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch logs on initial load and when filters or pagination changes
  useEffect(() => {
    fetchLogs();
  }, [currentPage, pageSize, activityType, startDate, endDate]);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const handleExport = () => {
    if (!logs.length) return;
    
    const headers = ['User', 'Email', 'Activity Type', 'Timestamp', 'Details', 'IP'];
    const csvContent = logs.map(log => {
      return [
        log.userName,
        log.userEmail,
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
    link.setAttribute('download', 'activity_logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setActivityType('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setCurrentPage(1);
  };
  
  const getActivityLabel = (type: ActivityLog['activity_type']) => {
    switch (type) {
      case 'connexion': return 'Connexion';
      case 'consultation': return 'Consultation';
      case 'inscription_event': return 'Inscription';
      case 'modification_profil': return 'Modification profil';
      case 'questionnaire_reponse': return 'Questionnaire';
      default: return type;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs d'activité des utilisateurs</CardTitle>
        <CardDescription>
          Consultez et analysez l'ensemble des activités des utilisateurs sur la plateforme
        </CardDescription>
        
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Rechercher un utilisateur ou une activité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type d'activité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="connexion">Connexion</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="inscription_event">Inscription</SelectItem>
                <SelectItem value="modification_profil">Modification profil</SelectItem>
                <SelectItem value="questionnaire_reponse">Questionnaire</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <DatePicker
                date={startDate}
                onSelect={setStartDate}
                placeholder="Date début"
              />
              <DatePicker
                date={endDate}
                onSelect={setEndDate}
                placeholder="Date fin"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {totalLogs} résultat{totalLogs !== 1 ? 's' : ''}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                disabled={logs.length === 0 || isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-destructive p-4 text-center">
            Erreur: {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            Aucune activité ne correspond aux critères de recherche.
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Type d'activité</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead>Date et heure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getActivityLabel(log.activity_type)}</TableCell>
                      <TableCell>
                        {log.activity_details?.description || log.activity_type}
                        {log.user_ip && (
                          <div className="text-xs text-muted-foreground">
                            IP: {log.user_ip}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(log.timestamp), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLogsTab;
