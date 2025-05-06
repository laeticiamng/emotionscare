import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Filter, BarChart2, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/ui/data-table/Pagination";
import { supabase } from '@/lib/supabase-client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Anonymous activity type that doesn't contain user-identifying information
interface AnonymousActivity {
  id: string;
  activity_type: string;
  category: string;
  count: number;
  timestamp_day: string;
}

// Aggregated stats interface
interface ActivityStats {
  activity_type: string;
  total_count: number;
  percentage: number;
}

const ActivityLogsTab: React.FC = () => {
  const [anonymousActivities, setAnonymousActivities] = useState<AnonymousActivity[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [activeTab, setActiveTab] = useState<string>("daily");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activityType, setActivityType] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Fetch anonymous activities function
  const fetchAnonymousActivities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This query gets anonymous activity data grouped by day and activity type
      // NO USER IDENTIFYING INFORMATION is included
      const { data, error: fetchError, count } = await supabase
        .rpc('get_anonymous_activity_logs', {
          p_start_date: startDate ? startDate.toISOString() : null,
          p_end_date: endDate ? endDate.toISOString() : null,
          p_activity_type: activityType !== 'all' ? activityType : null,
          p_search_term: searchTerm || null,
          p_page: currentPage,
          p_page_size: pageSize
        });
        
      if (fetchError) throw new Error(fetchError.message);
      
      // Process the data to ensure no identifying information
      const processedData = data?.map(item => ({
        id: item.id,
        activity_type: item.activity_type,
        category: item.category || 'Non catégorisé',
        count: item.count,
        timestamp_day: item.timestamp_day
      })) || [];
      
      setAnonymousActivities(processedData);
      setTotalActivities(count || 0);
      setTotalPages(Math.ceil((count || 0) / pageSize));
    } catch (err) {
      console.error('Error fetching anonymous activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchActivityStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch aggregated statistics
      const { data, error: statsError } = await supabase
        .rpc('get_activity_stats', {
          p_start_date: startDate ? startDate.toISOString() : null,
          p_end_date: endDate ? endDate.toISOString() : null
        });
        
      if (statsError) throw new Error(statsError.message);
      
      setActivityStats(data || []);
    } catch (err) {
      console.error('Error fetching activity stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity statistics');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'daily') {
      fetchAnonymousActivities();
    } else {
      fetchActivityStats();
    }
  }, [activeTab, currentPage, pageSize, activityType, startDate, endDate]);
  
  // Debounced search for daily activities tab
  useEffect(() => {
    if (activeTab === 'daily') {
      const timer = setTimeout(() => {
        fetchAnonymousActivities();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);
  
  const handleExport = () => {
    if (activeTab === 'daily' && anonymousActivities.length === 0) return;
    if (activeTab === 'stats' && activityStats.length === 0) return;
    
    let csvContent = '';
    let fileName = '';
    
    if (activeTab === 'daily') {
      const csvHeaders = ['Type d\'activité', 'Catégorie', 'Nombre', 'Date'];
      csvContent = anonymousActivities.map(activity => {
        return [
          activity.activity_type,
          activity.category,
          activity.count,
          activity.timestamp_day
        ].join(',');
      }).join('\n');
      fileName = 'activites_anonymes.csv';
      
      const csv = [csvHeaders.join(','), csvContent].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const csvHeaders = ['Type d\'activité', 'Total', 'Pourcentage'];
      csvContent = activityStats.map(stat => {
        return [
          stat.activity_type,
          stat.total_count,
          `${stat.percentage}%`
        ].join(',');
      }).join('\n');
      fileName = 'statistiques_activites.csv';
      
      const csv = [csvHeaders.join(','), csvContent].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setActivityType('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setCurrentPage(1);
  };
  
  const getActivityLabel = (type: string) => {
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
        <CardTitle>Données d'activité anonymisées</CardTitle>
        <CardDescription>
          Consultez les données d'activité globales et anonymisées des utilisateurs sur la plateforme
        </CardDescription>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily" className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2" />
              Activités journalières
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Statistiques globales
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-4 mt-4">
          {activeTab === 'daily' && (
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                placeholder="Rechercher par type d'activité..."
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
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {activeTab === 'daily' ? (
                <>
                  {totalActivities} activité{totalActivities !== 1 ? 's' : ''} anonymisée{totalActivities !== 1 ? 's' : ''}
                </>
              ) : (
                <>
                  {activityStats.length} type{activityStats.length !== 1 ? 's' : ''} d'activité
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              {activeTab === 'daily' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearFilters}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                disabled={(activeTab === 'daily' && anonymousActivities.length === 0) || 
                         (activeTab === 'stats' && activityStats.length === 0) || 
                         isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="daily" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-destructive p-4 text-center">
              Erreur: {error}
            </div>
          ) : anonymousActivities.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              Aucune activité ne correspond aux critères de recherche.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type d'activité</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anonymousActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{getActivityLabel(activity.activity_type)}</TableCell>
                        <TableCell>{activity.category}</TableCell>
                        <TableCell>{activity.count}</TableCell>
                        <TableCell>
                          {format(new Date(activity.timestamp_day), 'dd/MM/yyyy', { locale: fr })}
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
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-destructive p-4 text-center">
              Erreur: {error}
            </div>
          ) : activityStats.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              Aucune statistique disponible pour la période sélectionnée.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type d'activité</TableHead>
                    <TableHead>Nombre total</TableHead>
                    <TableHead>Pourcentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell>{getActivityLabel(stat.activity_type)}</TableCell>
                      <TableCell>{stat.total_count}</TableCell>
                      <TableCell>{stat.percentage.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default ActivityLogsTab;
