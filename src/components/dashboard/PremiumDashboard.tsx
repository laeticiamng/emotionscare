/**
 * PREMIUM DASHBOARD - Interface de tableau de bord avec accessibilité WCAG AAA
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAccessibilityManager } from '@/core/AccessibilityManager';
import { useSecurityManager } from '@/core/SecurityManager';
import { useUnifiedStore } from '@/core/UnifiedStateManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';
import { 
  Shield, 
  Activity, 
  Users, 
  TrendingUp, 
  Bell, 
  Settings,
  Eye,
  Lock,
  Zap,
  Heart,
  Music,
  Brain,
  Target,
  Award,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  userRole?: 'consumer' | 'employee' | 'manager';
  variant?: 'default' | 'premium' | 'enterprise';
}

export const PremiumDashboard: React.FC<DashboardProps> = ({ 
  userRole = 'consumer', 
  variant = 'premium' 
}) => {
  const [accessibilityPanelOpen, setAccessibilityPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { state: accessibilityState, announce } = useAccessibilityManager();
  const { state: securityState, getSecurityReport } = useSecurityManager();
  const { user, emotions, music } = useUnifiedStore();

  // Données simulées pour le dashboard
  const dashboardData = useMemo(() => ({
    stats: {
      totalSessions: 127,
      weeklyGrowth: 23,
      emotionalScore: 87,
      securityScore: getSecurityReport().summary.securityScore,
      accessibilityScore: 95,
    },
    recentActivities: [
      { id: 1, type: 'emotion_scan', timestamp: Date.now() - 300000, value: 'Joy: 85%' },
      { id: 2, type: 'music_generated', timestamp: Date.now() - 600000, value: 'Relaxing track' },
      { id: 3, type: 'accessibility_enabled', timestamp: Date.now() - 900000, value: 'High contrast' },
    ],
    upcomingEvents: [
      { id: 1, title: 'Méditation guidée', time: '14:00', type: 'wellness' },
      { id: 2, title: 'Analyse émotionnelle', time: '16:30', type: 'scan' },
    ]
  }), [getSecurityReport]);

  useEffect(() => {
    announce('Tableau de bord premium chargé', 'polite');
  }, [announce]);

  // Gestion du focus pour l'accessibilité
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    announce(`Onglet ${value} activé`, 'polite');
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    return minutes < 1 ? 'À l\'instant' : `Il y a ${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header premium */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tableau de bord premium
            </h1>
            <p className="text-muted-foreground mt-1">
              Bienvenue, {user?.profile?.name || 'Utilisateur'} • {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAccessibilityPanelOpen(true)}
              className="gap-2"
              aria-label="Ouvrir les paramètres d'accessibilité"
            >
              <Eye className="h-4 w-4" />
              Accessibilité
            </Button>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Bell className="h-4 w-4" />
              <Badge variant="secondary" className="ml-1">3</Badge>
            </Button>
          </div>
        </header>

        {/* Métriques principales */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score émotionnel</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">
                {dashboardData.stats.emotionalScore}%
              </div>
              <Progress value={dashboardData.stats.emotionalScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                +5% par rapport à la semaine dernière
              </p>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sécurité</CardTitle>
              <Shield className={`h-4 w-4 ${
                securityState.threatLevel === 'low' ? 'text-green-600' : 
                securityState.threatLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.stats.securityScore}%
              </div>
              <Progress value={dashboardData.stats.securityScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {securityState.activeThreats.filter(t => !t.blocked).length} menaces actives
              </p>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accessibilité</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {dashboardData.stats.accessibilityScore}%
              </div>
              <Progress value={dashboardData.stats.accessibilityScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Object.values(accessibilityState.preferences).filter(Boolean).length} options actives
              </p>
            </CardContent>
          </Card>

          <Card className="glass-premium hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {dashboardData.stats.totalSessions}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +{dashboardData.stats.weeklyGrowth}% cette semaine
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="emotions" className="gap-2">
              <Heart className="h-4 w-4" />
              Émotions
            </TabsTrigger>
            <TabsTrigger value="music" className="gap-2">
              <Music className="h-4 w-4" />
              Musique
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Brain className="h-4 w-4" />
              Analytiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activités récentes */}
              <Card className="lg:col-span-2 glass-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Activités récentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex-shrink-0">
                        {activity.type === 'emotion_scan' && <Heart className="h-4 w-4 text-pink-600" />}
                        {activity.type === 'music_generated' && <Music className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'accessibility_enabled' && <Eye className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Événements à venir */}
              <Card className="glass-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    À venir
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg border">
                      <div className="flex-shrink-0 w-12 text-center">
                        <div className="text-lg font-bold text-primary">{event.time}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{event.title}</p>
                        <Badge variant="outline" className="mt-1">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Alertes et recommandations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="h-5 w-5" />
                    Alertes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityState.activeThreats.filter(t => !t.blocked).slice(0, 3).map((threat) => (
                      <div key={threat.id} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{threat.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {threat.type} • {formatRelativeTime(threat.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {securityState.activeThreats.filter(t => !t.blocked).length === 0 && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Aucune alerte active</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Sparkles className="h-5 w-5" />
                    Recommandations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Prendre une pause bien-être</p>
                        <p className="text-xs text-muted-foreground">
                          Basé sur votre activité récente
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <Award className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Activer le mode haut contraste</p>
                        <p className="text-xs text-muted-foreground">
                          Pour améliorer l'accessibilité
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emotions" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Analyse émotionnelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-600 mb-2">87%</div>
                    <p className="text-sm text-muted-foreground">Score de bien-être</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">12</div>
                    <p className="text-sm text-muted-foreground">Scans cette semaine</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">+15%</div>
                    <p className="text-sm text-muted-foreground">Amélioration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="music" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Thérapie musicale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Piste actuelle</h3>
                    <p className="text-sm text-muted-foreground">
                      {music.currentTrack?.title || 'Aucune musique en cours'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Playlist recommandée</h3>
                    <p className="text-sm text-muted-foreground">
                      Musique relaxante • 12 pistes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-premium">
              <CardHeader>
                <CardTitle>Analytiques avancées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Tendances émotionnelles</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Joie</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <Progress value={85} />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sérénité</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <Progress value={72} />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Énergie</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <Progress value={68} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Utilisation des fonctionnalités</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Scan émotionnel</span>
                        <Badge>47 utilisations</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Musique thérapeutique</span>
                        <Badge>23 sessions</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Exercices de respiration</span>
                        <Badge>15 sessions</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Panneau d'accessibilité */}
      <AccessibilityPanel 
        isOpen={accessibilityPanelOpen}
        onToggle={() => setAccessibilityPanelOpen(!accessibilityPanelOpen)}
      />
    </div>
  );
};

export default PremiumDashboard;