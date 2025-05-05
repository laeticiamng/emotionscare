
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import KpiCards from '@/components/dashboard/KpiCards';
import TrendCharts from '@/components/dashboard/TrendCharts';
import VrPromptBanner from '@/components/dashboard/VrPromptBanner';
import QuickNavGrid from '@/components/dashboard/QuickNavGrid';
import MusicMiniPlayer from '@/components/music/MusicMiniPlayer';
import CoachAssistant from '@/components/dashboard/CoachAssistant';
import CoachRecommendations from '@/components/dashboard/CoachRecommendations';
import { Separator } from '@/components/ui/separator';
import { fetchUsersAvgScore, fetchVRCount, fetchBadgesCount, fetchReports } from '@/lib/dashboardService';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">EmotionsCare</h1>
          <h2 className="text-lg text-muted-foreground">par ResiMax™ 4.0</h2>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button 
            onClick={() => navigate('/scan')}
            variant="outline"
            className="flex items-center gap-2 shadow-sm"
          >
            Scan rapide <ArrowRight size={16} />
          </Button>
          <Button 
            onClick={() => navigate('/journal/new')}
            className="flex items-center gap-2 bg-gradient-to-r from-cocoon-600 to-cocoon-700 shadow-sm"
          >
            Journal quotidien <ArrowRight size={16} />
          </Button>
        </div>
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
          <div className="mb-6">
            <MusicMiniPlayer />
          </div>
          
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-4 px-1">Journal de bord</h3>
            <RecentJournalEntries />
          </div>
        </div>
        
        <div className="flex flex-col">
          <CoachAssistant className="mb-6" />
          <CoachRecommendations className="h-full" />
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

// Nouveau composant pour afficher les entrées récentes du journal
const RecentJournalEntries = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true);
        // Simulons quelques entrées pour la démo
        setEntries([
          { id: '1', date: new Date('2023-05-04'), content: "Aujourd'hui était une journée productive. J'ai pu terminer plusieurs tâches importantes et j'ai eu une bonne réunion d'équipe." },
          { id: '2', date: new Date('2023-05-03'), content: "Un peu stressé aujourd'hui avec les échéances qui approchent, mais j'ai pris le temps de faire une session de respiration." }
        ]);
      } catch (error) {
        console.error("Erreur lors du chargement des entrées de journal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, []);
  
  if (isLoading) {
    return <div className="p-4 border rounded-xl animate-pulse bg-slate-50 h-full"></div>;
  }
  
  return (
    <div className="bg-slate-50 rounded-xl p-4 border shadow-sm flex-grow">
      {entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry: any) => (
            <div 
              key={entry.id} 
              className="p-3 bg-white rounded-lg border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/journal/${entry.id}`)}
            >
              <div className="text-sm font-medium mb-1">
                {entry.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-3">Aucune entrée de journal récente</p>
          <Button onClick={() => navigate('/journal/new')}>Créer une entrée</Button>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/journal')} 
          className="text-sm"
        >
          Voir toutes les entrées <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
