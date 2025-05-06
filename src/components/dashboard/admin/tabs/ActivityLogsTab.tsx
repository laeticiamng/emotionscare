
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart2, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityFiltersState, ActivityTabView } from './activity-logs/types';
import { useActivityData } from './activity-logs/useActivityData';
import ActivityFilters from './activity-logs/ActivityFilters';
import DailyActivitiesTable from './activity-logs/DailyActivitiesTable';
import StatsTable from './activity-logs/StatsTable';
import ActionBar from './activity-logs/ActionBar';
import { formatCsvData, getDefaultCsvFileName } from './activity-logs/activityUtils';

const ActivityLogsTab: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState<ActivityTabView>('daily');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // Filters state
  const [filters, setFilters] = useState<ActivityFiltersState>({
    searchTerm: '',
    activityType: 'all',
    startDate: undefined,
    endDate: undefined
  });
  
  // Fetch data using custom hook
  const {
    anonymousActivities,
    activityStats,
    isLoading,
    error,
    totalActivities,
    totalPages,
    fetchData
  } = useActivityData({
    activeTab,
    filters,
    currentPage,
    pageSize
  });
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm, filters.activityType, filters.startDate, filters.endDate]);
  
  // Handle filter changes
  const handleFilterChange = (key: keyof ActivityFiltersState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      activityType: 'all',
      startDate: undefined,
      endDate: undefined
    });
    setCurrentPage(1);
  };
  
  // Handle export
  const handleExport = () => {
    if (activeTab === 'daily' && anonymousActivities.length === 0) return;
    if (activeTab === 'stats' && activityStats.length === 0) return;
    
    // Format the data
    const formattedData = formatCsvData(
      activeTab,
      activeTab === 'daily' ? anonymousActivities : activityStats
    );
    
    // Create CSV content
    const headers = Object.keys(formattedData[0]);
    const csvContent = [
      headers.join(','),
      ...formattedData.map(row => 
        headers.map(header => 
          typeof row[header] === 'string' && row[header].includes(',') 
            ? `"${row[header]}"` 
            : row[header]
        ).join(',')
      )
    ].join('\n');
    
    // Download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const fileName = getDefaultCsvFileName(activeTab);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Données d'activité anonymisées</CardTitle>
        <CardDescription>
          Consultez les données d'activité globales et anonymisées des utilisateurs sur la plateforme
        </CardDescription>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActivityTabView)} className="w-full mt-4">
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
            <ActivityFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={clearFilters}
            />
          )}
          
          <ActionBar 
            activeTab={activeTab}
            hasData={activeTab === 'daily' 
              ? anonymousActivities.length > 0 
              : activityStats.length > 0
            }
            isLoading={isLoading}
            onExport={handleExport}
            totalCount={activeTab === 'daily' 
              ? totalActivities 
              : activityStats.length
            }
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="daily" className="mt-0">
          <DailyActivitiesTable 
            activities={anonymousActivities}
            isLoading={isLoading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          <StatsTable 
            stats={activityStats}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default ActivityLogsTab;
