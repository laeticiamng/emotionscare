import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyActivityTable from "./DailyActivityTable";
import StatsTable from "./StatsTable";
import ActivityFilters from "@/components/admin/activity-logs/ActivityFilters";
import { ActivityTabView } from "./types";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

interface ActivityLogsListProps {
  activeTab: ActivityTabView;
  anonymousActivities: any[];
  activityStats: any[];
  isLoading: boolean;
  error: string | null;
  filters: {
    searchTerm: string;
    activityType: string;
    startDate: string;
    endDate: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    searchTerm: string;
    activityType: string;
    startDate: string;
    endDate: string;
  }>>;
  handleDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  handleRefresh?: () => Promise<void>;
  exportActivities?: () => void;
}

const ActivityLogsList: React.FC<ActivityLogsListProps> = ({
  activeTab,
  anonymousActivities,
  activityStats,
  isLoading,
  error,
  filters,
  setFilters,
  handleDateRangeChange,
  handleRefresh,
  exportActivities
}) => {
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Journal d'activités</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualiser</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportActivities}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Journal quotidien</TabsTrigger>
            <TabsTrigger value="stats">Statistiques globales</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <ActivityFilters 
                filters={filters} 
                setFilters={setFilters} 
                handleDateRangeChange={handleDateRangeChange}
              />
            </div>
            <div className="md:col-span-3">
              <TabsContent value="daily" className="space-y-4">
                <DailyActivityTable 
                  activities={anonymousActivities} 
                  isLoading={isLoading} 
                  error={error} 
                />
              </TabsContent>
              <TabsContent value="stats" className="space-y-4">
                <StatsTable 
                  stats={activityStats} 
                  isLoading={isLoading} 
                  error={error} 
                />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityLogsList;
