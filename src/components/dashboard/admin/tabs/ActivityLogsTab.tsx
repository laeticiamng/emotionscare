
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import DailyActivityTable from "./activity-logs/DailyActivityTable";
import StatsTable from "./activity-logs/StatsTable";
import ActionBar from "./activity-logs/ActionBar";
import ActivityFiltersComponent from "./activity-logs/ActivityFiltersComponent";
import { useActivityLogsState } from "./activity-logs/useActivityLogsState";
import { exportActivityData } from "./activity-logs/ActivityExportUtils";
import { ActivityTabView } from "./activity-logs/types";

const ActivityLogsTab: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    filteredActivities,
    filteredStats,
    isLoading,
    error,
    filters,
    setFilters,
    handleDateRangeChange
  } = useActivityLogsState();

  // Export data to CSV
  const handleExport = () => {
    const dataToExport = activeTab === 'daily' ? filteredActivities : filteredStats;
    exportActivityData(activeTab, dataToExport);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Données d'activité anonymisées</CardTitle>
        <CardDescription>
          Consultez les données d'activité globales et anonymisées des utilisateurs sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" value={activeTab} onValueChange={(value) => setActiveTab(value as ActivityTabView)}>
          <TabsList>
            <TabsTrigger value="daily">Activités journalières</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>
          
          <ActivityFiltersComponent 
            filters={filters} 
            setFilters={setFilters} 
            handleDateRangeChange={handleDateRangeChange} 
          />
          
          <ActionBar 
            activeTab={activeTab}
            hasData={activeTab === 'daily' ? filteredActivities.length > 0 : filteredStats.length > 0}
            isLoading={isLoading}
            onExport={handleExport}
            totalCount={activeTab === 'daily' ? filteredActivities.length : filteredStats.length}
          />
          
          <TabsContent value="daily" className="mt-2">
            <DailyActivityTable activities={filteredActivities} isLoading={isLoading} error={error} />
          </TabsContent>
          <TabsContent value="stats" className="mt-2">
            <StatsTable stats={filteredStats} isLoading={isLoading} error={error} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityLogsTab;
