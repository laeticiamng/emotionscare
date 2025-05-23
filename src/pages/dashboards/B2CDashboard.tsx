
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardContent from '@/components/dashboard/DashboardContent';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, User, LineChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const B2CDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    entriesLastWeek: 0,
    sessionsCompleted: 0,
    moodAverage: 0
  });
  
  // Simuler le chargement des données du tableau de bord
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStats({
          entriesLastWeek: Math.floor(Math.random() * 10) + 2,
          sessionsCompleted: Math.floor(Math.random() * 30) + 5,
          moodAverage: parseFloat((Math.random() * 2 + 3).toFixed(1))
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Impossible de charger les données du tableau de bord');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bienvenue, {user?.name || 'Utilisateur'}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Profil particulier
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Espace dédié au bien-être émotionnel personnel.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Journal émotionnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Entrées cette semaine: {stats.entriesLastWeek}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Dernier enregistrement: il y a {Math.floor(Math.random() * 24) + 1} heures
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Séances complétées: {stats.sessionsCompleted}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Humeur moyenne: {stats.moodAverage}/5
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Accès rapide</h2>
        <QuickAccessMenu />
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Contenu personnalisé</h2>
        <DashboardContent />
      </section>
    </div>
  );
};

export default B2CDashboard;
