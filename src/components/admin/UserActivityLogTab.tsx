
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DailyActivityTable from "@/components/dashboard/admin/tabs/activity-logs/DailyActivityTable";
import StatsTable from "@/components/dashboard/admin/tabs/activity-logs/StatsTable";
import ActionBar from "@/components/dashboard/admin/tabs/activity-logs/ActionBar";
import ActivityFilters from "./activity-logs/ActivityFilters";
import { useUserActivityLogState } from "./hooks/useUserActivityLogState";

const UserActivityLogTab: React.FC = () => {
  console.log("Rendering UserActivityLogTab");
  
  const {
    activeTab,
    setActiveTab,
    filteredActivities,
    stats,
    isLoading,
    error,
    filters,
    setFilters,
    handleDateRangeChange,
    handleExport
  } = useUserActivityLogState();

  console.log("Activity log state:", { 
    activeTab, 
    activitiesCount: filteredActivities?.length,
    statsCount: stats?.length,
    isLoading, 
    error 
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Logs d'activité</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="daily"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'daily' | 'stats')}
            className="mt-2"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <TabsList className="mb-2 sm:mb-0">
                <TabsTrigger value="daily">Vue journalière</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
              </TabsList>
              
              <ActionBar 
                activeTab={activeTab}
                hasData={activeTab === 'daily' ? filteredActivities.length > 0 : stats.length > 0}
                isLoading={isLoading}
                onExport={handleExport}
                totalCount={activeTab === 'daily' ? filteredActivities.length : stats.length}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <ActivityFilters 
                  filters={filters} 
                  setFilters={setFilters}
                  handleDateRangeChange={handleDateRangeChange}
                />
              </div>
              
              <div className="md:col-span-3">
                <TabsContent value="daily" className="mt-0">
                  <DailyActivityTable 
                    activities={filteredActivities}
                    isLoading={isLoading}
                    error={error}
                  />
                </TabsContent>
                
                <TabsContent value="stats" className="mt-0">
                  <StatsTable 
                    stats={stats}
                    isLoading={isLoading}
                    error={error}
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityLogTab;
