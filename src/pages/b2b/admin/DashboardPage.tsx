
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Users, Settings, BarChart2, ShieldCheck, Building, UserCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EmptyState from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const B2BAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [organizationStats, setOrganizationStats] = useState<any | null>(null);
  const [userAlerts, setUserAlerts] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Simulation du chargement des données
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simuler les appels API avec un délai
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Données fictives pour la démo
        setOrganizationStats({
          totalUsers: 124,
          activeUsers: 96,
          wellbeingScore: 73,
          riskUsers: 8,
          departmentsCount: 5
        });
        
        setUserAlerts([
          { id: 1, name: 'Michel Durant', department: 'Marketing', riskLevel: 'high', score: 35 },
          { id: 2, name: 'Julie Leroux', department: 'Support Client', riskLevel: 'medium', score: 42 },
          { id: 3, name: 'Thomas Blanc', department: 'Développement', riskLevel: 'medium', score: 45 }
        ]);
        
        setRecentActivities([
          { id: 1, name: 'Atelier gestion du stress', participants: 18, date: '2023-05-15', status: 'completed' },
          { id: 2, name: 'Session de cohésion d\'équipe', participants: 24, date: '2023-05-18', status: 'completed' },
          { id: 3, name: 'Formation bien-être au travail', participants: 12, date: '2023-05-29', status: 'upcoming' }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast.error('Impossible de charger les données du tableau de bord');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAction = (action: string) => {
    switch (action) {
      case 'users':
        navigate('/b2b/admin/users');
        break;
      case 'settings':
        navigate('/b2b/admin/settings');
        break;
      case 'analytics':
        navigate('/b2b/admin/analytics');
        break;
      case 'risk-users':
        navigate('/b2b/admin/risk-users');
        break;
      default:
        toast.info('Fonctionnalité en cours de développement');
    }
  };

  // Variants pour les animations avec Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Rendu des statistiques de l'organisation
  const renderOrganizationStats = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-8 w-full" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      );
    }

    if (!organizationStats) {
      return (
        <EmptyState 
          title="Aucune donnée disponible" 
          description="Les données de l'organisation ne sont pas encore disponibles"
          icon={Building}
          action={{
            label: "Configurer l'organisation",
            onClick: () => handleAction('settings')
          }}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Score de bien-être global</h4>
          <span className="text-2xl font-bold">{organizationStats.wellbeingScore}%</span>
        </div>
        <ProgressBar 
          value={organizationStats.wellbeingScore} 
          indicatorClassName={
            organizationStats.wellbeingScore < 40 ? "bg-red-500" : 
            organizationStats.wellbeingScore < 70 ? "bg-yellow-500" : "bg-green-500"
          }
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3 border rounded-lg flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">Utilisateurs</p>
            <p className="text-xl font-bold">{organizationStats.totalUsers}</p>
          </div>
          <div className="p-3 border rounded-lg flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">Actifs</p>
            <p className="text-xl font-bold">{organizationStats.activeUsers}</p>
          </div>
          <div className="p-3 border rounded-lg flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">Départements</p>
            <p className="text-xl font-bold">{organizationStats.departmentsCount}</p>
          </div>
          <div className="p-3 border rounded-lg flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20">
            <p className="text-xs text-red-600 dark:text-red-400">Utilisateurs à risque</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{organizationStats.riskUsers}</p>
          </div>
        </div>
        
        <div className="flex justify-center mt-2">
          <Button onClick={() => handleAction('analytics')}>
            Voir les analyses complètes
          </Button>
        </div>
      </div>
    );
  };

  // Rendu des alertes utilisateurs
  const renderUserAlerts = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      ));
    }

    if (!userAlerts.length) {
      return (
        <EmptyState 
          title="Aucune alerte active" 
          description="Tous les utilisateurs semblent aller bien"
          icon={UserCheck}
        />
      );
    }

    const getRiskColor = (risk: string) => {
      switch (risk) {
        case 'high': return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
        case 'medium': return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400";
        case 'low': return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
        default: return "text-muted-foreground";
      }
    };

    return (
      <div className="space-y-3">
        {userAlerts.map(alert => (
          <div key={alert.id} className="flex items-center p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="bg-muted rounded-full p-2 mr-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{alert.name}</div>
              <div className="text-xs text-muted-foreground">{alert.department}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(alert.riskLevel)}`}>
              {alert.score}%
            </div>
          </div>
        ))}
        
        <Button onClick={() => handleAction('risk-users')} variant="outline" className="w-full mt-2">
          Gérer tous les utilisateurs à risque
        </Button>
      </div>
    );
  };

  // Rendu des activités récentes
  const renderRecentActivities = () => {
    if (isLoading) {
      return Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-12 w-full" />
        </div>
      ));
    }

    if (!recentActivities.length) {
      return (
        <EmptyState 
          title="Aucune activité récente" 
          description="Planifiez des activités pour votre équipe"
          icon={Users}
          action={{
            label: "Planifier une activité",
            onClick: () => toast.info('Page de planification en développement')
          }}
        />
      );
    }

    return recentActivities.map(activity => (
      <div key={activity.id} className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
        <div className="flex justify-between items-center">
          <span className="font-medium">{activity.name}</span>
          <span className={`text-xs px-2 py-1 rounded ${
            activity.status === 'completed' 
              ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {activity.status === 'completed' ? 'Terminé' : 'À venir'}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground">
            {new Date(activity.date).toLocaleDateString('fr-FR')}
          </span>
          <span className="text-xs text-muted-foreground">
            {activity.participants} participants
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Console d'administration</h1>
          <p className="text-muted-foreground">Gérez votre organisation et les utilisateurs</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => handleAction('settings')} variant="outline" className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            <span>Paramètres</span>
          </Button>
        </motion.div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-4">
          <TabsTrigger value="overview">Vue générale</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants} className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques de l'organisation</CardTitle>
                    <CardDescription>Aperçu global du bien-être dans votre entreprise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderOrganizationStats()}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Alertes utilisateurs</CardTitle>
                    <CardDescription>Utilisateurs nécessitant de l'attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderUserAlerts()}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Activités récentes</CardTitle>
                    <CardDescription>Sessions et ateliers pour votre organisation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {renderRecentActivities()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: 'Gestion utilisateurs', icon: Users, action: 'users' },
                { title: 'Analytiques', icon: BarChart2, action: 'analytics' },
                { title: 'Configuration', icon: Settings, action: 'settings' }
              ].map((item, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Button
                    variant="outline"
                    className="h-24 w-full flex flex-col items-center justify-center gap-2"
                    onClick={() => handleAction(item.action)}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.title}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Consultez, ajoutez et modifiez les utilisateurs de votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => handleAction('users')} className="w-full sm:w-auto">
                  <Users className="mr-2 h-4 w-4" />
                  Accéder à la gestion des utilisateurs
                </Button>
                
                {!isLoading && organizationStats && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4 px-4">
                        <div className="text-2xl font-bold">{organizationStats.totalUsers}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4 px-4">
                        <div className="text-2xl font-bold">{organizationStats.activeUsers}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(organizationStats.activeUsers / organizationStats.totalUsers * 100)}% d'utilisateurs actifs
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-red-500">Utilisateurs à risque</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 pb-4 px-4">
                        <div className="text-2xl font-bold text-red-500">{organizationStats.riskUsers}</div>
                        <div className="text-xs text-red-400">
                          {Math.round(organizationStats.riskUsers / organizationStats.totalUsers * 100)}% des utilisateurs
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytiques détaillées</CardTitle>
                <CardDescription>
                  Analysez le bien-être, l'engagement et les tendances dans votre organisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button onClick={() => handleAction('analytics')} className="w-full sm:w-auto">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Voir le tableau de bord analytique
                </Button>
                
                {!isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Évolution du bien-être</h3>
                      <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Graphique d'évolution</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Répartition par département</h3>
                      <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Graphique de répartition</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de l'organisation</CardTitle>
                <CardDescription>
                  Configurez les paramètres de votre organisation et de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button onClick={() => handleAction('settings')} className="w-full sm:w-auto">
                  <Settings className="mr-2 h-4 w-4" />
                  Accéder aux paramètres complets
                </Button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Configuration rapide</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Configuration de l\'organisation en développement')}>
                        <Building className="mr-2 h-4 w-4" />
                        Structure de l'organisation
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Gestion des départements en développement')}>
                        <Users className="mr-2 h-4 w-4" />
                        Départements
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Paramètres des modules en développement')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Modules actifs
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Sécurité</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Gestion des permissions en développement')}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Permissions
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Configuration des rôles en développement')}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Rôles et accès
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default B2BAdminDashboard;
