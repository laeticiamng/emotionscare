
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { AnonymousActivity, ActivityStats, ActivityTabView } from './tabs/activity-logs/types';
import { getActivityData, getActivityStats } from '@/lib/activityLogService';
import DailyActivityTable from "@/components/dashboard/admin/tabs/activity-logs/DailyActivityTable";
import StatsTable from "@/components/dashboard/admin/tabs/activity-logs/StatsTable";
import ActionBar from '@/components/dashboard/admin/tabs/activity-logs/ActionBar';

// Helper function to apply filters
const applyFilters = (data: AnonymousActivity[], filters: any): AnonymousActivity[] => {
  if (!data) return [];
  
  let filteredData = [...data];
  
  // Apply date filters
  if (filters.startDate) {
    filteredData = filteredData.filter(item => 
      new Date(item.timestamp_day) >= new Date(filters.startDate)
    );
  }
  
  if (filters.endDate) {
    filteredData = filteredData.filter(item => 
      new Date(item.timestamp_day) <= new Date(filters.endDate)
    );
  }
  
  // Apply type filter
  if (filters.activityType && filters.activityType !== 'all') {
    filteredData = filteredData.filter(item => 
      item.activity_type === filters.activityType
    );
  }
  
  // Apply search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.activity_type.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredData;
};

const UserActivityLogTab: React.FC = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<AnonymousActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<AnonymousActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActivityTabView>('daily');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    activityType: 'all',
    searchTerm: ''
  });

  // Fetch activity data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    Promise.all([
      getActivityData(),
      getActivityStats()
    ])
      .then(([activitiesData, statsData]) => {
        setActivities(activitiesData);
        setFilteredActivities(activitiesData);
        setStats(statsData);
      })
      .catch(err => {
        console.error("Error fetching activity data:", err);
        setError("Impossible de charger les données d'activité");
        toast({
          title: "Erreur",
          description: "Impossible de charger les données d'activité",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast]);

  // Apply filters when they change
  useEffect(() => {
    setFilteredActivities(applyFilters(activities, filters));
  }, [filters, activities]);

  // Export data functionality 
  const handleExport = () => {
    try {
      const dataToExport = activeTab === 'daily' ? filteredActivities : stats;
      const headers = activeTab === 'daily' 
        ? ['ID', 'Type', 'Catégorie', 'Nombre', 'Date']
        : ['Type', 'Nombre total', 'Pourcentage'];
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(item => {
          if (activeTab === 'daily') {
            const dailyItem = item as AnonymousActivity;
            return [
              dailyItem.id,
              dailyItem.activity_type,
              dailyItem.category,
              dailyItem.count,
              dailyItem.timestamp_day
            ].join(',');
          } else {
            const statItem = item as ActivityStats;
            return [
              statItem.activity_type,
              statItem.total_count,
              statItem.percentage.toFixed(1) + '%'
            ].join(',');
          }
        })
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `activity-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Succès",
        description: "Données exportées avec succès",
      });
    } catch (err) {
      console.error("Error exporting data:", err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'exportation des données",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Logs d'activité</CardTitle>
          <Button 
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="ml-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="daily"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ActivityTabView)}
            className="mt-2"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <TabsList className="mb-2 sm:mb-0">
                <TabsTrigger value="daily">Vue journalière</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
              </TabsList>
              
              <ActionBar filters={filters} setFilters={setFilters} />
            </div>
            
            <TabsContent value="daily" className="mt-4">
              <DailyActivityTable 
                activities={filteredActivities}
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <StatsTable 
                stats={stats}
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityLogTab;
