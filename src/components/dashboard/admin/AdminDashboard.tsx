
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs } from "@/components/ui/tabs";
import { useDashboardData, useEmotionalScoreTrend, useDashboardStats } from './hooks/useDashboardData';
import DashboardHeader from './DashboardHeader';
import AdminTabsNavigation from './AdminTabsNavigation';
import AdminTabContents from './AdminTabContents';
import AdminFooter from './AdminFooter';
import { SegmentProvider } from '@/contexts/SegmentContext';
import AdminHero from './AdminHero';
import { 
  Users, FilePlus, FileSearch, Bell, 
  Activity, TrendingUp, UserCheck, AlertTriangle 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("vue-globale");
  const [timePeriod, setTimePeriod] = useState<string>("30");
  
  // Use custom hooks to fetch data
  const { absenteeismData, productivityData, isLoading, refetchAll } = useDashboardData(timePeriod);
  const { data: emotionalScoreTrend, refetch: refetchEmotionalTrend } = useEmotionalScoreTrend();
  const { data: dashboardStats, refetch: refetchDashboardStats } = useDashboardStats();

  const adminKpis = [
    { 
      key: 'active_employees', 
      label: 'Employés actifs', 
      value: '92%', 
      icon: Users,
      change: { value: 3, isPositive: true },
      status: 'success' as const
    },
    { 
      key: 'emotional_score', 
      label: 'Score émotionnel', 
      value: '76/100', 
      icon: Activity,
      change: { value: 2, isPositive: false }
    },
    { 
      key: 'productivity', 
      label: 'Productivité', 
      value: '89%', 
      icon: TrendingUp,
      change: { value: 5, isPositive: true },
      status: 'info' as const
    },
    { 
      key: 'alerts', 
      label: 'Alertes bien-être', 
      value: '3', 
      icon: AlertTriangle,
      status: 'warning' as const
    }
  ];

  const adminActions = [
    { label: 'Nouveau rapport', icon: FilePlus, to: '/reports/new' },
    { label: 'Voir les alertes', icon: Bell, to: '/alerts', variant: 'secondary' as const },
    { label: 'Analyse de l\'équipe', icon: UserCheck, to: '/scan/team' },
    { label: 'Audit', icon: FileSearch, to: '/compliance', variant: 'outline' as const }
  ];
  
  // Refresh all dashboard data
  const refreshAllData = useCallback(async () => {
    console.log('Refreshing all dashboard data...');
    await Promise.all([
      refetchAll(),
      refetchEmotionalTrend(),
      refetchDashboardStats()
    ]);
    console.log('Dashboard data refresh complete');
  }, [refetchAll, refetchEmotionalTrend, refetchDashboardStats]);
  
  return (
    <SegmentProvider>
      <div className="max-w-7xl mx-auto">
        {/* Admin Hero Section */}
        <AdminHero 
          kpis={adminKpis} 
          actions={adminActions}
          isLoading={isLoading} 
        />
        
        {/* Hero Section with Period Selector */}
        <DashboardHeader 
          timePeriod={timePeriod} 
          setTimePeriod={setTimePeriod} 
          isLoading={isLoading}
          onRefresh={refreshAllData}
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
    </SegmentProvider>
  );
};

export default AdminDashboard;
