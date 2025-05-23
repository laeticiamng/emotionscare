
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardContent from '@/components/dashboard/DashboardContent';
import QuickAccessMenu from '@/components/dashboard/QuickAccessMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, LineChart, Bell } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const B2BAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orgData, setOrgData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingInvitations: 0,
    engagementRate: 0,
    alertCount: 0
  });
  const [generatingReport, setGeneratingReport] = useState(false);
  
  // Simuler le chargement des données du tableau de bord
  useEffect(() => {
    const loadOrgData = async () => {
      setIsLoading(true);
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const totalUsers = Math.floor(Math.random() * 50) + 15;
        const activeUsers = Math.floor(totalUsers * (0.6 + Math.random() * 0.3));
        
        setOrgData({
          totalUsers,
          activeUsers,
          pendingInvitations: Math.floor(Math.random() * 8),
          engagementRate: Math.floor(Math.random() * 30) + 60,
          alertCount: Math.floor(Math.random() * 5)
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement des données organisationnelles:', error);
        toast.error('Impossible de charger les données organisationnelles');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrgData();
  }, []);
  
  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Rapport mensuel généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setGeneratingReport(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bienvenue, {user?.name || 'Administrateur'}</h1>
          <p className="text-muted-foreground mt-1">
            Tableau de bord d'administration pour {user?.company || 'votre organisation'}
          </p>
        </div>
        <Button 
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="flex items-center"
        >
          {generatingReport ? (
            <>
              <LineChart className="mr-2 h-4 w-4 animate-spin" /> Génération...
            </>
          ) : (
            <>
              <LineChart className="mr-2 h-4 w-4" /> Générer un rapport
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
              Administration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Accès administrateur aux services de bien-être émotionnel
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {orgData.alertCount > 0 ? (
                    <span className="text-amber-500 flex items-center">
                      <Bell className="h-3 w-3 mr-1" /> {orgData.alertCount} alertes requièrent votre attention
                    </span>
                  ) : (
                    <span className="text-green-500">Aucune alerte système</span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Utilisateurs
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
                  {orgData.activeUsers} utilisateurs actifs sur {orgData.totalUsers} inscrits
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {orgData.pendingInvitations} invitation{orgData.pendingInvitations > 1 ? 's' : ''} en attente
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-primary" />
              Analyses
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
                  Taux d'engagement: {orgData.engagementRate}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Rapport mensuel disponible
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Outils d'administration</h2>
        <QuickAccessMenu />
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Contenu administrateur</h2>
        <DashboardContent />
      </section>
    </div>
  );
};

export default B2BAdminDashboard;
