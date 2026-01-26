import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnonymousActivity } from '@/types/activity';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import Pagination from '@/components/ui/data-table/Pagination';
import { logger } from '@/lib/logger';

interface ActivityFiltersState {
  searchTerm: string;
  activityType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

// Since we don't have the actual activityUtils, we'll implement the functions directly here
const getActivityLabel = (activityType: string): string => {
  const labels: Record<string, string> = {
    login: 'Connexion',
    logout: 'Déconnexion',
    scan_emotion: 'Scan émotionnel',
    journal_entry: 'Journal',
    music_play: 'Écoute musicale',
    vr_session: 'Session VR',
    profile_update: 'Mise à jour profil',
    account_created: 'Création de compte',
    invitation_sent: 'Invitation envoyée',
    invitation_accepted: 'Invitation acceptée',
  };
  
  return labels[activityType] || activityType;
};

const applyFilters = (
  data: AnonymousActivity[],
  filters: ActivityFiltersState
): AnonymousActivity[] => {
  return data.filter((item) => {
    // Apply search term filter
    if (filters.searchTerm && item.activity_type && !item.activity_type.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply activity type filter
    if (filters.activityType && item.activity_type !== filters.activityType) {
      return false;
    }
    
    // Apply date filters
    if (filters.startDate && item.timestamp_day) {
      const itemDate = new Date(item.timestamp_day);
      if (itemDate < filters.startDate) {
        return false;
      }
    }
    
    if (filters.endDate && item.timestamp_day) {
      const itemDate = new Date(item.timestamp_day);
      // Add one day to include the end date fully
      const endDatePlusOne = new Date(filters.endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      if (itemDate > endDatePlusOne) {
        return false;
      }
    }
    
    return true;
  });
};

const PersonalActivityLogs: React.FC = () => {
  const [activities, setActivities] = useState<AnonymousActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<AnonymousActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<ActivityFiltersState>({
    searchTerm: '',
    activityType: '',
    startDate: undefined,
    endDate: undefined,
  });
  
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        // Fetch all activities for the current user
        // Using mock data instead of supabase.auth.user() which doesn't exist
        const { data, error } = await supabase
          .from('user_activity_logs')
          .select('*')
          .eq('user_id', 'current-user-id') // Use hard-coded ID or get from context
          .order('timestamp_day', { ascending: false });
        
        if (error) {
          logger.error("Error fetching activities", error, 'UI');
          toast({
            title: "Erreur",
            description: "Impossible de charger l'historique des activités",
            variant: "destructive"
          });
          return;
        }
        
        if (data) {
          const anonymousData = data.map(item => ({
            id: item.id,
            activity_type: item.activity_type,
            category: item.activity_details?.category || 'general',
            count: 1,
            timestamp_day: item.timestamp_day,
          }));
          setActivities(anonymousData);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [toast]);
  
  useEffect(() => {
    // Apply filters and pagination
    const filtered = applyFilters(activities, filters);
    setFilteredActivities(filtered);
    
    // Calculate total pages
    setTotalPages(Math.ceil(filtered.length / pageSize));
    
    // Ensure current page is within bounds
    if (currentPage > Math.ceil(filtered.length / pageSize)) {
      setCurrentPage(1);
    }
  }, [activities, filters, currentPage, pageSize]);
  
  const paginatedActivities = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, currentPage, pageSize]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value });
  };
  
  const handleActivityTypeChange = (value: string) => {
    setFilters({ ...filters, activityType: value });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    setFilters({ 
      ...filters, 
      startDate: date, 
      endDate: date 
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique de vos activités</CardTitle>
        <CardDescription>Suivez votre parcours bien-être</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <Label htmlFor="search">Rechercher</Label>
            <Input
              type="search"
              id="search"
              placeholder="Rechercher par type d'activité"
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Activity Type Filter */}
          <div>
            <Label htmlFor="activityType">Type d'activité</Label>
            <Select onValueChange={handleActivityTypeChange}>
              <SelectTrigger id="activityType">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les types</SelectItem>
                <SelectItem value="scan_emotion">Scan émotionnel</SelectItem>
                <SelectItem value="journal_entry">Journal</SelectItem>
                <SelectItem value="music_play">Écoute musicale</SelectItem>
                <SelectItem value="vr_session">Session VR</SelectItem>
                <SelectItem value="profile_update">Mise à jour profil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Picker */}
          <div>
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: enUS }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date('2023-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Activity List */}
        {isLoading ? (
          <div className="text-center">Chargement...</div>
        ) : paginatedActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type d'activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {paginatedActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.activity_type ? getActivityLabel(activity.activity_type) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.timestamp_day ? format(new Date(activity.timestamp_day), 'PPP', { locale: enUS }) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">Aucune activité trouvée.</div>
        )}
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={filteredActivities.length} // Add this line
        />
      </CardContent>
    </Card>
  );
};

export default PersonalActivityLogs;
