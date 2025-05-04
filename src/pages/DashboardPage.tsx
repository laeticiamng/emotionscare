
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import KpiCards from '@/components/dashboard/KpiCards';
import TrendCharts from '@/components/dashboard/TrendCharts';
import VrPromptBanner from '@/components/dashboard/VrPromptBanner';
import QuickNavGrid from '@/components/dashboard/QuickNavGrid';
import MusicMiniPlayer from '@/components/music/MusicMiniPlayer';
import CoachAssistant from '@/components/dashboard/CoachAssistant';
import { Separator } from '@/components/ui/separator';
import { fetchUsersAvgScore, fetchVRCount, fetchBadgesCount, fetchReports } from '@/lib/dashboardService';

const DashboardPage = () => {
  const { user } = useAuth();
  
  // State pour les données du tableau de bord
  const [avgScore, setAvgScore] = useState<number>(0);
  const [vrSessionsThisMonth, setVrSessionsThisMonth] = useState<number>(0);
  const [vrSessionsLastMonth, setVrSessionsLastMonth] = useState<number>(0);
  const [userBadgesCount, setUserBadgesCount] = useState<number>(0);
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Récupérer les données au chargement du composant
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Charger les données en parallèle
        const [avgScoreData, vrCountData, badgesCount, reportsData] = await Promise.all([
          fetchUsersAvgScore(),
          fetchVRCount(),
          fetchBadgesCount(user?.id || ''),
          fetchReports(['absenteeism', 'productivity'], 7)
        ]);
        
        setAvgScore(avgScoreData);
        setVrSessionsThisMonth(vrCountData);
        setVrSessionsLastMonth(vrCountData - 2); // Pour exemple, dans une vraie app on récupérerait cette valeur
        setUserBadgesCount(badgesCount);
        setAbsenteeismData(reportsData.absenteeism || []);
        setProductivityData(reportsData.productivity || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données du tableau de bord:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [user]);
  
  return (
    <div className="cocoon-page">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">EmotionsCare</h1>
        <h2 className="text-lg text-muted-foreground">par ResiMax™ 4.0</h2>
      </div>
      
      <Separator className="mb-8" />
      
      <KpiCards 
        vrSessionsThisMonth={vrSessionsThisMonth}
        vrSessionsLastMonth={vrSessionsLastMonth}
        userBadgesCount={userBadgesCount}
        avgEmotionalScore={avgScore}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          {/* Music Mini Player */}
          <MusicMiniPlayer />
        </div>
        
        <div>
          {/* Coach IA Component */}
          <CoachAssistant />
        </div>
      </div>

      <TrendCharts 
        absenteeismData={absenteeismData}
        productivityData={productivityData}
        isLoading={isLoading}
      />

      <VrPromptBanner userName={user?.name || 'utilisateur'} />

      <QuickNavGrid />
    </div>
  );
};

export default DashboardPage;
