
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs } from "@/components/ui/tabs";
import { fetchReports } from '@/lib/dashboardService';
import DashboardHeader from '@/components/dashboard/admin/DashboardHeader';
import AdminTabsNavigation from './AdminTabsNavigation';
import AdminTabContents from './AdminTabContents';
import { SegmentProvider } from '@/contexts/SegmentContext';
import { useDashboardData, useEmotionalScoreTrend, useDashboardStats } from './hooks/useDashboardData';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("vue-globale");
  const [timePeriod, setTimePeriod] = useState<string>('7');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Use custom hooks for data fetching
  const { absenteeismData, productivityData, isLoading: dataLoading, refetchAll } = useDashboardData(timePeriod);
  const { data: emotionalScoreTrend, refetch: refetchEmotional } = useEmotionalScoreTrend();
  const { data: dashboardStats, refetch: refetchStats } = useDashboardStats();

  // Function to handle refresh trigger from DashboardHeader
  const handleRefresh = () => {
    setIsLoading(true);
    Promise.all([
      refetchAll(),
      refetchEmotional(),
      refetchStats()
    ]).finally(() => {
      setIsLoading(false);
    });
  };
  
  useEffect(() => {
    setIsLoading(false);
  }, [absenteeismData, emotionalScoreTrend, dashboardStats]);
  
  // Handler for tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  return (
    <SegmentProvider>
      <div className="max-w-7xl mx-auto">
        {/* Dashboard header with period selector */}
        <DashboardHeader 
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
        
        {/* Main tabs navigation and content */}
        <Tabs value={activeTab} className="space-y-4">
          <AdminTabsNavigation 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            disabled={isLoading}
          />
          
          <AdminTabContents 
            activeTab={activeTab}
            absenteeismData={absenteeismData}
            emotionalScoreTrend={emotionalScoreTrend}
            dashboardStats={dashboardStats}
            isLoading={isLoading || dataLoading}
          />
        </Tabs>
      </div>
    </SegmentProvider>
  );
};

export default AdminDashboard;
