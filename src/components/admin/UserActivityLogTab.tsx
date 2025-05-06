
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Download } from "lucide-react";
import { format } from 'date-fns';
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast";
import { ActivityTabView, AnonymousActivity, ActivityFiltersState, ActivityStats } from '../dashboard/admin/tabs/activity-logs/types';
import DailyActivityTable from '../dashboard/admin/tabs/activity-logs/DailyActivityTable';
import StatsTable from '../dashboard/admin/tabs/activity-logs/StatsTable';
import { applyFilters, formatCsvData, getActivityLabel, getDefaultCsvFileName } from '../dashboard/admin/tabs/activity-logs/activityUtils';
import ActionBar from '../dashboard/admin/tabs/activity-logs/ActionBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/ui/data-table/Pagination';

const UserActivityLogTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActivityTabView>('daily');
  const [activities, setActivities] = useState<AnonymousActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ActivityFiltersState>({
    searchTerm: '',
    activityType: '',
    startDate: undefined,
    endDate: undefined,
  });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { toast } = useToast();
  
  // Mock data (replace with actual API calls)
  const mockDailyActivities: AnonymousActivity[] = [
    { id: '1', activity_type: 'login', category: 'auth', count: 5, timestamp_day: '2024-07-08' },
    { id: '2', activity_type: 'scan_emotion', category: 'engagement', count: 3, timestamp_day: '2024-07-08' },
    { id: '3', activity_type: 'journal_entry', category: 'engagement', count: 2, timestamp_day: '2024-07-07' },
    { id: '4', activity_type: 'logout', category: 'auth', count: 5, timestamp_day: '2024-07-07' },
    { id: '5', activity_type: 'music_play', category: 'usage', count: 8, timestamp_day: '2024-07-06' },
    { id: '6', activity_type: 'vr_session', category: 'usage', count: 1, timestamp_day: '2024-07-06' },
    { id: '7', activity_type: 'profile_update', category: 'user', count: 2, timestamp_day: '2024-07-05' },
    { id: '8', activity_type: 'invitation_sent', category: 'admin', count: 1, timestamp_day: '2024-07-05' },
    { id: '9', activity_type: 'invitation_accepted', category: 'admin', count: 1, timestamp_day: '2024-07-04' },
    { id: '10', activity_type: 'account_created', category: 'auth', count: 3, timestamp_day: '2024-07-04' },
  ];
  
  const mockActivityStats: ActivityStats[] = [
    { activity_type: 'login', total_count: 65, percentage: 22.5 },
    { activity_type: 'scan_emotion', total_count: 50, percentage: 17.3 },
    { activity_type: 'journal_entry', total_count: 42, percentage: 14.5 },
    { activity_type: 'logout', total_count: 38, percentage: 13.1 },
    { activity_type: 'music_play', total_count: 30, percentage: 10.4 },
    { activity_type: 'vr_session', total_count: 25, percentage: 8.6 },
    { activity_type: 'profile_update', total_count: 20, percentage: 6.9 },
    { activity_type: 'invitation_sent', total_count: 12, percentage: 4.1 },
    { activity_type: 'invitation_accepted', total_count: 8, percentage: 2.8 },
  ];
  
  useEffect(() => {
    loadData();
  }, [activeTab, filters, page, pageSize]);
  
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'daily') {
        // Simulate API call with pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const filteredData = applyFilters([...mockDailyActivities], filters) as AnonymousActivity[];
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        setActivities(paginatedData);
        setTotalCount(paginatedData.length);
        setTotalItems(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / pageSize));
      } else {
        // For stats, just apply filters (no pagination)
        setStats([...mockActivityStats]);
        setTotalCount(mockActivityStats.length);
        setTotalItems(mockActivityStats.length);
        setTotalPages(1);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value });
    setPage(1); // Reset page when searching
  };
  
  const handleActivityTypeChange = (activityType: string) => {
    setFilters({ ...filters, activityType });
    setPage(1); // Reset page when changing activity type
  };
  
  const handleDateChange = (date: DateRange | undefined) => {
    setFilters({ 
      ...filters, 
      startDate: date?.from, 
      endDate: date?.to 
    });
    setPage(1); // Reset page when changing dates
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setPageSize(newLimit);
    setPage(1);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as ActivityTabView);
  };
  
  const handleExport = () => {
    const dataToExport = activeTab === 'daily' ? activities : stats;
    if (!dataToExport || dataToExport.length === 0) {
      toast({
        title: "Aucune donnée à exporter",
        description: "Il n'y a aucune donnée à exporter pour la sélection actuelle.",
      });
      return;
    }
    
    const formattedData = formatCsvData(activeTab, dataToExport);
    if (!formattedData || formattedData.length === 0) {
      toast({
        title: "Aucune donnée formatée",
        description: "Il n'y a aucune donnée formatée à exporter pour la sélection actuelle.",
      });
      return;
    }
    
    const csvContent = [
      Object.keys(formattedData[0]).join(','), // Header row
      ...formattedData.map(item => Object.values(item).join(',')) // Data rows
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const fileName = getDefaultCsvFileName(activeTab);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export CSV",
      description: `Le fichier ${fileName} a été téléchargé.`,
    });
  };
  
  const hasData = activeTab === 'daily' ? activities.length > 0 : stats.length > 0;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logs d'activité des utilisateurs</CardTitle>
          <CardDescription>
            Suivez l'activité des utilisateurs sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="daily" value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="daily">Activité journalière</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-4">
              <Input
                type="search"
                placeholder="Rechercher..."
                className="max-w-md"
                value={filters.searchTerm}
                onChange={handleSearchChange}
              />
              <Select onValueChange={handleActivityTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  {[...new Set(mockDailyActivities.map(item => item.activity_type))].map(type => (
                    <SelectItem key={type} value={type}>{getActivityLabel(type)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !filters.startDate && !filters.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? (
                      filters.endDate ? (
                        `${format(filters.startDate, "dd/MM/yyyy")} - ${format(filters.endDate, "dd/MM/yyyy")}`
                      ) : (
                        `Du ${format(filters.startDate, "dd/MM/yyyy")}`
                      )
                    ) : (
                      <span>Sélectionner une période</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    defaultMonth={filters.startDate}
                    selected={filters.startDate && filters.endDate ? { from: filters.startDate, to: filters.endDate } : undefined}
                    onSelect={handleDateChange}
                    numberOfMonths={2}
                    pagedNavigation
                  />
                </PopoverContent>
              </Popover>
            </div>
            <ActionBar 
              activeTab={activeTab}
              hasData={hasData}
              isLoading={isLoading}
              onExport={handleExport}
              totalCount={totalCount}
            />
            <TabsContent value="daily" className="space-y-2">
              <DailyActivityTable 
                activities={activities}
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
            <TabsContent value="stats" className="space-y-2">
              <StatsTable 
                stats={stats}
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
          </Tabs>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handleLimitChange}
            totalItems={totalItems}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityLogTab;
