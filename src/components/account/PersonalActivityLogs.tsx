
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ActivityLog } from '@/components/admin/UserActivityTimeline';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import Pagination from '@/components/ui/data-table/Pagination';
import { useToast } from '@/hooks/use-toast';
import UserActivityTimeline from '@/components/admin/UserActivityTimeline';

const PersonalActivityLogs: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activityType, setActivityType] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    if (!user?.id) return;
    fetchPersonalLogs();
  }, [user?.id, currentPage, pageSize, activityType, startDate, endDate]);
  
  // Debounced search
  useEffect(() => {
    if (!user?.id) return;
    
    const timer = setTimeout(() => {
      fetchPersonalLogs();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const fetchPersonalLogs = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);
      
      // Apply filters
      if (searchTerm) {
        query = query.textSearch('activity_details', searchTerm, { 
          type: 'websearch',
          config: 'english' 
        });
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
      
      setActivityLogs(data || []);
      setTotalLogs(count || 0);
      setTotalPages(Math.ceil((count || 0) / pageSize));
    } catch (err) {
      console.error('Error fetching personal activity logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity logs');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportPersonalData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      // Get all logs for the user (no pagination)
      const { data, error: exportError } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });
      
      if (exportError) throw new Error(exportError.message);
      
      if (!data || data.length === 0) {
        toast({
          title: "Information",
          description: "Aucune activité à exporter.",
        });
        return;
      }
      
      // Convert data to CSV format
      const headers = ['Type d\'activité', 'Date et heure', 'Détails', 'IP'];
      const csvContent = data.map(log => {
        return [
          log.activity_type,
          new Date(log.timestamp).toLocaleString('fr-FR'),
          JSON.stringify(log.activity_details || {}),
          log.user_ip || 'N/A'
        ].join(',');
      });
      
      const csv = [headers.join(','), ...csvContent].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      const filename = `mes_activites_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement réussi",
        description: "Votre historique personnel a été téléchargé.",
      });
    } catch (err) {
      console.error('Error exporting personal data:', err);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter vos données. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setActivityType('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setCurrentPage(1);
  };
  
  if (!user?.id) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          Veuillez vous connecter pour voir votre historique d'activité.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon historique d'activité</CardTitle>
        <CardDescription>
          Consultez votre historique personnel d'utilisation de la plateforme. Ces données sont strictement confidentielles et accessibles uniquement par vous-même.
        </CardDescription>
        
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Rechercher dans votre historique..."
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
              {totalLogs} activité{totalLogs !== 1 ? 's' : ''}
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
                onClick={handleExportPersonalData}
                disabled={isLoading || totalLogs === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger mon historique
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <UserActivityTimeline logs={activityLogs} isLoading={isLoading} />
        
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
        
        <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
          <p className="font-medium">Confidentialité de vos données</p>
          <p className="mt-1">
            Conformément au RGPD, votre historique d'activité est strictement personnel 
            et confidentiel. Seul vous y avez accès. Les administrateurs et membres des RH 
            ne peuvent consulter que des données anonymisées et agrégées sans possibilité 
            d'identification individuelle.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalActivityLogs;
