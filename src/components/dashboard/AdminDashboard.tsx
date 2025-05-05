
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { fetchReports } from '@/lib/dashboardService';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import PeriodSelector from '@/components/dashboard/admin/PeriodSelector';
import AdminChartSection from '@/components/dashboard/admin/AdminChartSection';
import EmotionalClimateCard from '@/components/dashboard/admin/EmotionalClimateCard';
import SocialCocoonCard from '@/components/dashboard/admin/SocialCocoonCard';
import GamificationSummaryCard from '@/components/dashboard/admin/GamificationSummaryCard';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timePeriod, setTimePeriod] = useState<string>('7');

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
    <div className="max-w-7xl mx-auto">
      {/* Hero Section with Period Selector */}
      <div className="mb-10 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <h1 className="text-4xl font-light">Tableau de bord <span className="font-semibold">Direction</span></h1>
            <h2 className="text-xl text-muted-foreground mt-2">
              Métriques globales et anonymisées
            </h2>
          </div>
          <PeriodSelector timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Charts Section */}
        <AdminChartSection 
          absenteeismData={absenteeismData} 
          productivityData={productivityData}
        />
        
        {/* Emotional Climate Overview */}
        <EmotionalClimateCard />
        
        {/* Social Cocoon Analytics */}
        <SocialCocoonCard />
        
        {/* Gamification Summary */}
        <GamificationSummaryCard />
      </div>
      
      <DashboardFooter isAdmin={true} />
    </div>
  );
};

export default AdminDashboard;
