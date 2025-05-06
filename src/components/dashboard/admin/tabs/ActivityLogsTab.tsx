
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { 
  ActivityTabView, 
  ActivityFiltersState,
  AnonymousActivity,
  ActivityStats
} from "./activity-logs/types";

import { useToast } from "@/hooks/use-toast";
import DailyActivityTable from "./activity-logs/DailyActivityTable";
import StatsTable from "./activity-logs/StatsTable";
import ActionBar from "./activity-logs/ActionBar";
import { formatCsvData, getDefaultCsvFileName } from "./activity-logs/activityUtils";

// Mock data for demo
const mockActivities: AnonymousActivity[] = [
  {
    id: '1',
    activity_type: 'login',
    category: 'authentication',
    count: 25,
    timestamp_day: '2023-07-01'
  },
  {
    id: '2',
    activity_type: 'scan_emotion',
    category: 'wellness',
    count: 18,
    timestamp_day: '2023-07-01'
  }
];

const mockStats: ActivityStats[] = [
  {
    activity_type: 'login',
    total_count: 125,
    percentage: 40.5
  },
  {
    activity_type: 'scan_emotion',
    total_count: 82,
    percentage: 26.5
  }
];

const ActivityLogsTab: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActivityTabView>("daily");
  const [activities, setActivities] = useState<AnonymousActivity[]>(mockActivities);
  const [stats, setStats] = useState<ActivityStats[]>(mockStats);
  const [filteredActivities, setFilteredActivities] = useState<AnonymousActivity[]>(mockActivities);
  const [filteredStats, setFilteredStats] = useState<ActivityStats[]>(mockStats);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fix by using separate filters state for dateRange
  const [filters, setFilters] = useState({
    searchTerm: '',
    activityType: '',
    startDate: '',
    endDate: ''
  });

  // Handle date range selection
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setFilters({
      ...filters,
      startDate: range.from ? range.from.toISOString() : '',
      endDate: range.to ? range.to.toISOString() : '',
    });
  };

  // Export data to CSV
  const handleExport = () => {
    const dataToExport = activeTab === 'daily' ? filteredActivities : filteredStats;
    const formattedData = formatCsvData(activeTab, dataToExport);
    const fileName = getDefaultCsvFileName(activeTab);
    
    try {
      // Convert to CSV and download
      const headers = Object.keys(formattedData[0]);
      const csvRows = [
        headers.join(','),
        ...formattedData.map(row => Object.values(row).join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export réussi",
        description: `Les données ont été exportées dans ${fileName}`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Erreur lors de l'export",
        description: "Impossible d'exporter les données",
        variant: "destructive"
      });
    }
  };

  // Create a properly typed function for filter handling
  const handleApplyFilters = (activityFilters: {
    searchTerm: string;
    activityType: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    setFilters({
      searchTerm: activityFilters.searchTerm,
      activityType: activityFilters.activityType,
      startDate: activityFilters.startDate ? activityFilters.startDate.toISOString() : '',
      endDate: activityFilters.endDate ? activityFilters.endDate.toISOString() : '',
    });
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
          <div className="mt-4">
            <Label>Rechercher</Label>
            <Input
              type="search"
              placeholder="Rechercher par type d'activité"
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <Label>Type d'activité</Label>
            <Select onValueChange={(value) => setFilters({ ...filters, activityType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les types</SelectItem>
                <SelectItem value="login">Connexion</SelectItem>
                <SelectItem value="scan_emotion">Scan émotionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Label>Période</Label>
            <DatePickerWithRange onDateChange={handleDateRangeChange} />
          </div>
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
