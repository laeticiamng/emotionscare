import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Heart, 
  TrendingUp, 
  Calendar,
  Music,
  MessageSquare,
  Target,
  Award,
  Activity,
  Clock,
  Zap,
  Brain,
  Users,
  Eye,
  Headphones
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import StatsOverview from './StatsOverview';
import EmotionAnalyzer from './EmotionAnalyzer';
import NotificationSystem from './NotificationSystem';

/**
 * Dashboard unifié adaptatif selon le rôle utilisateur
 * Centralise toutes les métriques et fonctionnalités principales
 */
const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();

  const [activeTab, setActiveTab] = React.useState('overview');
  
  // Détermine le mode d'affichage selon le rôle
  const displayMode = user?.role || userMode || 'consumer';
  
  // Données simulées adaptatives
  const dashboardData = {
    consumer: {
      title: "Votre Espace Bien-être Personnel",
      subtitle: "Continuez votre parcours vers l'équilibre émotionnel",
      metrics: [
        { label: "Humeur Actuelle", value: "8.2/10", trend: "+12%", icon: Heart, color: "text-rose-500" },
        { label: "Séries Actives", value: "14 jours", trend: "+7 jours", icon: Target, color: "text-blue-500" },
        { label: "Sessions Complétées", value: "47", trend: "+5 cette semaine", icon: Award, color: "text-green-500" },
        { label: "Progression", value: "78%", trend: "+15% ce mois", icon: TrendingUp, color: "text-purple-500" }
      ],
      quickActions: [
        { label: "Scanner Émotions", icon: Eye, path: "/app/scan" },
        { label: "Musique Adaptée", icon: Headphones, path: "/app/music" },
        { label: "Coach IA", icon: MessageSquare, path: "/app/coach" },
        { label: "Journal", icon: Clock, path: "/app/journal" }
      ]
    },
    employee: {
      title: "Espace Collaborateur",
      subtitle: "Optimisez votre bien-être professionnel",
      metrics: [
        { label: "Énergie au Travail", value: "7.5/10", trend: "+8%", icon: Zap, color: "text-orange-500" },
        { label: "Productivité", value: "85%", trend: "+12%", icon: BarChart3, color: "text-blue-500" },
        { label: "Collaboration", value: "92%", trend: "+5%", icon: Users, color: "text-green-500" },
        { label: "Équilibre", value: "Good", trend: "Stable", icon: Activity, color: "text-purple-500" }
      ],
      quickActions: [
        { label: "Check Stress", icon: Heart, path: "/app/scan" },
        { label: "Pause Active", icon: Zap, path: "/app/screen-silk" },
        { label: "Équipe", icon: Users, path: "/app/teams" },
        { label: "Objectifs", icon: Target, path: "/app/goals" }
      ]
    },
    manager: {
      title: "Dashboard Management",
      subtitle: "Pilotez le bien-être de vos équipes",
      metrics: [
        { label: "Bien-être Équipe", value: "8.1/10", trend: "+6%", icon: Users, color: "text-blue-500" },
        { label: "Engagement", value: "89%", trend: "+11%", icon: Heart, color: "text-green-500" },
        { label: "Productivité", value: "94%", trend: "+8%", icon: TrendingUp, color: "text-purple-500" },
        { label: "Rétention", value: "96%", trend: "+3%", icon: Award, color: "text-orange-500" }
      ],
      quickActions: [
        { label: "Analytics Équipe", icon: BarChart3, path: "/app/analytics" },
        { label: "Reports", icon: Activity, path: "/app/reports" },
        { label: "Interventions", icon: Target, path: "/app/optimization" },
        { label: "Paramètres", icon: Brain, path: "/settings/general" }
      ]
    }
  };

  const currentData = dashboardData[displayMode as keyof typeof dashboardData];

  const recentActivities = [
    { 
      type: displayMode === 'consumer' ? 'journal' : 'meeting',
      title: displayMode === 'consumer' ? 'Séance de réflexion matinale' : 'Réunion équipe bien-être',
      time: '8:30',
      mood: 'positive'
    },
    { 
      type: displayMode === 'consumer' ? 'music' : 'training',
      title: displayMode === 'consumer' ? 'Session de relaxation' : 'Formation gestion stress',
      time: '14:15',
      mood: 'calm'
    },
    { 
      type: 'chat',
      title: displayMode === 'consumer' ? 'Discussion avec Nyvée' : 'Support RH',
      time: '16:45',
      mood: 'neutral'
    }
  ];

  return (
    <div className="space-y-8">
      {/* En-tête personnalisé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {currentData.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {currentData.subtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              {displayMode === 'consumer' ? '👤 Personnel' : 
               displayMode === 'employee' ? '💼 Collaborateur' : '👥 Manager'}
            </Badge>
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
              <Calendar className="h-4 w-4 inline mr-2" />
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric',
                month: 'long'
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Système de notifications unifié */}
      <NotificationSystem />

      {/* Métriques principales adaptées au rôle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {currentData.metrics.map((metric, index) => (
          <Card key={metric.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-foreground">
                  {metric.value}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {metric.trend}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="tools">Outils</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vue d'ensemble des stats */}
            <StatsOverview />
            
            {/* Analyseur d'émotions */}
            <EmotionAnalyzer />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendances {displayMode === 'consumer' ? 'Personnelles' : 'Équipe'}</CardTitle>
                <CardDescription>
                  Évolution des métriques sur les 30 derniers jours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mr-4" />
                  <span>Graphiques interactifs en cours de développement...</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Insights IA</CardTitle>
                <CardDescription>Recommandations personnalisées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900">Recommandation</p>
                        <p className="text-blue-700 mt-1">
                          {displayMode === 'consumer' 
                            ? "Votre niveau de stress semble élevé. Essayez une session de respiration."
                            : "L'engagement équipe est optimal. Maintenez les pratiques actuelles."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activités Récentes
              </CardTitle>
              <CardDescription>
                {displayMode === 'consumer' ? 'Vos dernières interactions' : 'Dernières actions équipe'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      {activity.type === 'journal' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'music' && <Music className="h-4 w-4 text-purple-500" />}
                      {activity.type === 'chat' && <MessageSquare className="h-4 w-4 text-green-500" />}
                      {activity.type === 'meeting' && <Users className="h-4 w-4 text-orange-500" />}
                      {activity.type === 'training' && <Brain className="h-4 w-4 text-indigo-500" />}
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {activity.mood}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Outils Rapides
              </CardTitle>
              <CardDescription>
                Accès direct aux fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentData.quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                    onClick={() => window.location.href = action.path}
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs text-center">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedDashboard;