/**
 * EnhancedUserDashboard - Version améliorée du tableau de bord utilisateur
 * Ajoute des fonctionnalités modernes tout en conservant la structure existante
 */

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import GlobalOverviewTab from '../dashboard/tabs/GlobalOverviewTab';
import AnalyticsTab from '../dashboard/tabs/AnalyticsTab';
import JournalTab from '../dashboard/tabs/JournalTab';
import PersonalDataTab from '../dashboard/tabs/PersonalDataTab';
import { User } from '@/types/user';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  Bell,
  Settings,
  Download,
  Share2,
  RefreshCw,
  Clock
} from 'lucide-react';

interface EnhancedUserDashboardProps {
  user: User;
}

const EnhancedUserDashboard: React.FC<EnhancedUserDashboardProps> = ({ user }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Les collaborateurs B2B n'ont accès qu'à leurs données personnelles
  const isB2BUser = user.role === 'b2b_user';

  // Données simulées pour l'aperçu amélioré
  const dashboardStats = {
    weeklyProgress: 78,
    monthlyGoals: 12,
    completedGoals: 9,
    currentStreak: 5,
    totalSessions: 47,
    averageRating: 4.6,
    timeSpent: 142, // en minutes cette semaine
    nextMilestone: 50 // prochaine session milestone
  };

  const recentActivities = [
    { type: 'session', title: 'Session de méditation', time: '2h ago', status: 'completed' },
    { type: 'journal', title: 'Entrée de journal', time: '5h ago', status: 'draft' },
    { type: 'goal', title: 'Objectif atteint: Exercice quotidien', time: '1d ago', status: 'achieved' },
    { type: 'assessment', title: 'Auto-évaluation hebdomadaire', time: '2d ago', status: 'pending' }
  ];

  const upcomingReminders = [
    { title: 'Session planifiée', time: 'Dans 2h', type: 'session' },
    { title: 'Rappel journal', time: 'Ce soir 20h', type: 'journal' },
    { title: 'Bilan hebdomadaire', time: 'Vendredi', type: 'assessment' }
  ];

  const quickActions = [
    { 
      title: 'Nouvelle session', 
      desc: 'Commencer maintenant',
      icon: <TrendingUp className="h-4 w-4" />,
      action: () => console.log('Nouvelle session'),
      variant: 'default' as const
    },
    { 
      title: 'Ajouter entrée', 
      desc: 'Journal personnel',
      icon: <Calendar className="h-4 w-4" />,
      action: () => console.log('Nouveau journal'),
      variant: 'outline' as const
    },
    { 
      title: 'Voir objectifs', 
      desc: 'Gérer vos buts',
      icon: <Target className="h-4 w-4" />,
      action: () => console.log('Objectifs'),
      variant: 'outline' as const
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulation du rechargement des données
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const exportData = () => {
    // Simulation de l'export
    console.log('Export des données...');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      
      {/* En-tête amélioré */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord personnel</h1>
          <p className="text-muted-foreground">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Progression</p>
                <p className="text-2xl font-bold text-primary">{dashboardStats.weeklyProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/60" />
            </div>
            <Progress value={dashboardStats.weeklyProgress} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">Cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Objectifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardStats.completedGoals}/{dashboardStats.monthlyGoals}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600/60" />
            </div>
            <Progress 
              value={(dashboardStats.completedGoals / dashboardStats.monthlyGoals) * 100} 
              className="mt-2 h-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Série actuelle</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardStats.currentStreak}</p>
              </div>
              <Award className="h-8 w-8 text-orange-600/60" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Jours consécutifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Temps total</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardStats.timeSpent}min</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600/60" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cette semaine</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.action}
                className="justify-start h-auto p-4"
              >
                <div className="flex items-center gap-3">
                  {action.icon}
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.desc}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section principale avec onglets */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar avec infos rapides */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Activités récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activités récentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.slice(0, 4).map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    activity.status === 'achieved' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Rappels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Rappels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingReminders.map((reminder, index) => (
                <div key={index} className="p-2 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">{reminder.title}</p>
                  <p className="text-xs text-muted-foreground">{reminder.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal des onglets */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="overview">Vue globale</TabsTrigger>
              <TabsTrigger value="analytics">Mes analyses</TabsTrigger>
              <TabsTrigger value="journal">Mon journal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <GlobalOverviewTab className="w-full" userRole={user.role} />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsTab className="w-full" personalOnly={isB2BUser} />
            </TabsContent>
            
            <TabsContent value="journal">
              <JournalTab className="w-full" />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Prochaines étapes / Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommandations personnalisées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-900">Prochain objectif suggéré</h4>
              <p className="text-sm text-blue-700 mt-1">
                Vous approchez de votre {dashboardStats.nextMilestone}e session ! 
                Continuez sur cette lancée pour débloquer de nouveaux badges.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-green-900">Habitude en formation</h4>
              <p className="text-sm text-green-700 mt-1">
                Votre série de {dashboardStats.currentStreak} jours est excellente ! 
                Maintenez le rythme pour atteindre la série de 7 jours.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedUserDashboard;