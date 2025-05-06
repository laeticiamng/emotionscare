
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs } from "@/components/ui/tabs";
import { fetchReports } from '@/lib/dashboardService';
import DashboardHeader from '@/components/dashboard/admin/DashboardHeader';
import AdminTabsNavigation from './AdminTabsNavigation';
import AdminTabContents from './AdminTabContents';
import { SegmentProvider } from '@/contexts/SegmentContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("vue-globale");
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [emotionalScoreTrend, setEmotionalScoreTrend] = useState<Array<{ date: string; value: number }>>([
    { date: '1/5', value: 72 },
    { date: '2/5', value: 75 },
    { date: '3/5', value: 78 },
    { date: '4/5', value: 80 }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timePeriod, setTimePeriod] = useState<string>('7');

  // Dashboard stats with required properties
  const dashboardStats = {
    totalUsers: 245,
    activeUsers: 187,
    productivity: {
      current: 92,
      trend: 3
    },
    emotionalScore: {
      current: 78,
      trend: 2
    },
    absenteeismRate: 4.2,
    engagementRate: 76
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Load reports data
        const reportsData = await fetchReports(['absenteeism', 'productivity'], parseInt(timePeriod));
        
        setAbsenteeismData(reportsData.absenteeism || []);
        setProductivityData(reportsData.productivity || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [timePeriod]);
  
  return (
    <SegmentProvider>
      <div className="max-w-7xl mx-auto">
        {/* Dashboard header with period selector */}
        <DashboardHeader 
          title="Tableau de bord Direction"
          subtitle="Métriques globales et anonymisées"
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />
        
        {/* Main tabs navigation and content */}
        <Tabs value={activeTab} className="space-y-4">
          <AdminTabsNavigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            disabled={isLoading}
          />
          
          <AdminTabContents 
            activeTab={activeTab}
            absenteeismData={absenteeismData}
            emotionalScoreTrend={emotionalScoreTrend}
            dashboardStats={dashboardStats}
          />
        </Tabs>
      </div>
    </SegmentProvider>
  );
};

export default AdminDashboard;
