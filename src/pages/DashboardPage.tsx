
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
import { ArrowRight, TrendingUp, Activity, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State pour les données du tableau de bord
  const [avgScore, setAvgScore] = useState<number>(0);
  const [vrSessionsThisMonth, setVrSessionsThisMonth] = useState<number>(0);
  const [vrSessionsLastMonth, setVrSessionsLastMonth] = useState<number>(0);
  const [userBadgesCount, setUserBadgesCount] = useState<number>(0);
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userMood, setUserMood] = useState<string>("Calme");
  const [streakCount, setStreakCount] = useState<number>(5);
  
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
        setVrSessionsLastMonth(vrCountData - 2);
        setUserBadgesCount(badgesCount);
        setAbsenteeismData(reportsData.absenteeism || []);
        setProductivityData(reportsData.productivity || []);

        // Afficher une alerte prédictive après le chargement des données (simulation)
        setTimeout(() => {
          if (avgScoreData < 80) {
            toast({
              title: "Alerte prédictive",
              description: "Votre score émotionnel est en baisse. Une micro-pause VR pourrait aider à améliorer votre bien-être.",
              variant: "destructive"
            });
          }
        }, 3000);
        
      } catch (error) {
        console.error("Erreur lors du chargement des données du tableau de bord:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [user, toast]);
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-10 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-light">Bienvenue, <span className="font-semibold">{user?.name || 'utilisateur'}</span></h1>
              <div className="hidden md:flex items-center gap-1 text-sm font-medium bg-pastel-green px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4 text-wellness-green" />
                <span>{streakCount} jours consécutifs</span>
              </div>
            </div>
            <h2 className="text-xl text-muted-foreground mt-2">
              Vous vous sentez aujourd'hui : <span className="text-cocoon-600 font-medium">{userMood}</span>
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3 self-start">
            <Button 
              onClick={() => navigate('/scan')}
              variant="outline"
              className="flex items-center gap-2 shadow-sm hover:bg-pastel-blue transition-colors"
            >
              Scan rapide <ArrowRight size={16} />
            </Button>
            <Button 
              onClick={() => navigate('/vr-session')}
              className="btn-primary flex items-center gap-2"
            >
              Planifier ma micro-pause VR <ArrowRight size={16} />
            </Button>
          </div>
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
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <MusicMiniPlayer />
          </div>
          
          <div className="flex flex-col h-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-semibold mb-4 px-1">Journal de bord</h3>
            <RecentJournalEntries />
          </div>
        </div>
        
        <div className="flex flex-col">
          <CoachAssistant className="mb-6 animate-slide-up glass-card" style={{ animationDelay: '0.3s' }} />
          <CoachRecommendations className="h-full animate-slide-up glass-card" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-2xl font-semibold mb-4">Tendances Émotion</h3>
        <TrendCharts 
          absenteeismData={absenteeismData}
          productivityData={productivityData}
          isLoading={isLoading}
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <VrPromptBanner userName={user?.name || 'utilisateur'} />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
        <h3 className="text-2xl font-semibold mb-4">Navigation rapide</h3>
        <QuickNavGrid />
      </div>
      
      <div className="mt-12 py-6 border-t text-center text-sm text-muted-foreground">
        <p>Données chiffrées AES-256, authentification Supabase Auth, permissions RBAC strictes, conformité GDPR</p>
      </div>
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
    return <div className="p-4 border rounded-2xl animate-pulse bg-slate-50/80 h-full"></div>;
  }
  
  return (
    <div className="bg-pastel-purple/30 rounded-2xl p-4 border border-cocoon-100 shadow-soft flex-grow hover:shadow-medium transition-all duration-300">
      {entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry: any) => (
            <div 
              key={entry.id} 
              className="p-3 bg-white/80 rounded-lg border border-slate-100 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
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
          <Button 
            onClick={() => navigate('/journal/new')}
            className="btn-action bg-cocoon-500 text-white hover:bg-cocoon-600"
          >
            Créer une entrée
          </Button>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/journal')} 
          className="text-sm hover:bg-cocoon-100/50 hover:text-cocoon-800"
        >
          Voir toutes les entrées <ArrowRight size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
