
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDashboardData, useEmotionalScoreTrend, useDashboardStats } from './hooks/useDashboardData';
import DashboardHeader from './DashboardHeader';
import AdminTabsNavigation from './AdminTabsNavigation';
import AdminTabContents from './AdminTabContents';
import AdminFooter from './AdminFooter';
import { SegmentProvider } from '@/contexts/SegmentContext';
import AdminHero from './AdminHero';
import UsersTableDemo from './UsersTableDemo';
import UsersTableWithInfiniteScroll from './UsersTableWithInfiniteScroll';
import { Button } from '@/components/ui/button';
import { 
  Users, FilePlus, FileSearch, Bell, 
  Activity, TrendingUp, UserCheck, AlertTriangle 
} from 'lucide-react';

const AdminDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("vue-globale");
  const [timePeriod, setTimePeriod] = useState<string>("30");
  
  // Use custom hooks to fetch data
  const { absenteeismData, productivityData, isLoading, refetchAll } = useDashboardData(timePeriod);
  const { data: emotionalScoreTrend, refetch: refetchEmotionalTrend } = useEmotionalScoreTrend();
  const { data: dashboardStats, refetch: refetchDashboardStats } = useDashboardStats();
  
  // State for pagination display mode
  const [paginationMode, setPaginationMode] = useState<'paginated' | 'loadMore' | 'infinite'>('paginated');

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
  
  // Prepare formatted dashboard stats for the components expecting the old format
  const formattedDashboardStats = {
    ...dashboardStats,
    productivity: {
      current: dashboardStats.averageEmotionalScore || 76,
      trend: 3
    },
    emotionalScore: {
      current: dashboardStats.averageEmotionalScore || 76,
      trend: -2
    }
  };
  
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
  
  // Load pagination preferences from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('emotionscare-pagination-mode');
    if (savedMode === 'loadMore' || savedMode === 'paginated' || savedMode === 'infinite') {
      setPaginationMode(savedMode as 'paginated' | 'loadMore' | 'infinite');
    }
  }, []);
  
  // Set pagination mode and save to localStorage
  const setPaginationModeWithSave = (mode: 'paginated' | 'loadMore' | 'infinite') => {
    setPaginationMode(mode);
    localStorage.setItem('emotionscare-pagination-mode', mode);
  };
  
  // Get the correct mode labels
  const getModeLabel = () => {
    switch (paginationMode) {
      case 'paginated': return 'Pagination classique';
      case 'loadMore': return 'Charger plus';
      case 'infinite': return 'Défilement infini';
      default: return 'Mode de pagination';
    }
  };
  
  return (
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
          dashboardStats={formattedDashboardStats}
        />
      </Tabs>
      
      {/* Users List with Pagination Demo */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold">Liste des utilisateurs</h2>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={paginationMode === 'paginated' ? 'default' : 'outline'} 
              onClick={() => setPaginationModeWithSave('paginated')}
            >
              Pages numérotées
            </Button>
            <Button 
              size="sm" 
              variant={paginationMode === 'loadMore' ? 'default' : 'outline'} 
              onClick={() => setPaginationModeWithSave('loadMore')}
            >
              Charger plus
            </Button>
            <Button 
              size="sm" 
              variant={paginationMode === 'infinite' ? 'default' : 'outline'} 
              onClick={() => setPaginationModeWithSave('infinite')}
            >
              Défilement infini
            </Button>
          </div>
        </div>
        
        {/* Render the appropriate table based on the pagination mode */}
        {paginationMode === 'paginated' && (
          <UsersTableDemo showLoadMoreButton={false} defaultPageSize={25} />
        )}
        
        {paginationMode === 'loadMore' && (
          <UsersTableDemo showLoadMoreButton={true} defaultPageSize={25} />
        )}
        
        {paginationMode === 'infinite' && (
          <UsersTableWithInfiniteScroll pageSize={25} />
        )}
      </div>
      
      <AdminFooter />
    </div>
  );
};

// Create wrapper component that provides the SegmentContext
const AdminDashboard: React.FC = () => {
  return (
    <SegmentProvider>
      <AdminDashboardContent />
    </SegmentProvider>
  );
};

export default AdminDashboard;
