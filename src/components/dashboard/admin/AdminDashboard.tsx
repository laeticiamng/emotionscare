
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from './DashboardHeader';
import AdminTabsNavigation from './AdminTabsNavigation';
import AdminTabContents from './AdminTabContents';
import AdminFooter from './AdminFooter';
import { useDashboardData, useEmotionalScoreTrend, useDashboardStats } from './hooks/useDashboardData';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("vue-globale");
  const [timePeriod, setTimePeriod] = useState<string>("30");
  
  // Use custom hooks to fetch data
  const { absenteeismData, productivityData, isLoading } = useDashboardData(timePeriod);
  const emotionalScoreTrend = useEmotionalScoreTrend();
  const dashboardStats = useDashboardStats();
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section with Period Selector */}
      <DashboardHeader 
        timePeriod={timePeriod} 
        setTimePeriod={setTimePeriod} 
        isLoading={isLoading}
      />
      
      {/* Tabs Navigation */}
      <Tabs defaultValue="vue-globale" className="mb-8" onValueChange={setActiveTab} value={activeTab}>
        <AdminTabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} disabled={isLoading} />
        
        {/* Tab Contents */}
        <AdminTabContents 
          activeTab={activeTab}
          absenteeismData={absenteeismData}
          emotionalScoreTrend={emotionalScoreTrend}
          dashboardStats={dashboardStats}
          isLoading={isLoading}
        />
      </Tabs>
      
      <AdminFooter />
    </div>
  );
};

export default AdminDashboard;
