
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardContent from '@/components/dashboard/DashboardContent';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, BookOpen, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const B2BUserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [teamData, setTeamData] = useState({
    teamSize: 0,
    activeMembers: 0,
    teamMoodAverage: 0,
    lastActivity: ''
  });
  
  // Simuler le chargement des données du tableau de bord
  useEffect(() => {
    const loadTeamData = async () => {
      setIsLoading(true);
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const teamSize = Math.floor(Math.random() * 10) + 5;
        const activeMembers = Math.floor(Math.random() * teamSize) + 1;
        
        setTeamData({
          teamSize,
          activeMembers,
          teamMoodAverage: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          lastActivity: `il y a ${Math.floor(Math.random() * 24) + 1} heures`
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'équipe:', error);
        toast.error('Impossible de charger les données d\'équipe');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeamData();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bienvenue, {user?.name || 'Collaborateur'}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              Espace entreprise
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
                Accès collaborateur aux services de bien-être émotionnel de {user?.company || 'votre entreprise'}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Mon équipe
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
                  {teamData.activeMembers} membres actifs sur {teamData.teamSize}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Humeur moyenne d'équipe: {teamData.teamMoodAverage}/5
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Activité récente
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
                  Dernière activité: {teamData.lastActivity}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Sessions de groupe complétées: {Math.floor(Math.random() * 15) + 3}
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
        <h2 className="text-xl font-bold mb-4">Contenu collaboratif</h2>
        <DashboardContent />
      </section>
    </div>
  );
};

export default B2BUserDashboard;
