/**
 * UNIFIED DASHBOARD PAGE - Fusion de DashboardPage + CompleteDashboardPage
 * Préserve EXACTEMENT la même fonctionnalité des deux composants
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Music, 
  TrendingUp, 
  Heart, 
  Activity, 
  Users,
  Clock,
  Target,
  Zap,
  BarChart3,
  Settings,
  PlayCircle,
  Layout,
  Navigation,
  MessageSquare,
  Eye
} from 'lucide-react';
import UnifiedDashboard from '@/components/features/UnifiedDashboard';
import NavigationHub from '@/components/features/NavigationHub';
import EmotionAnalysisEngine from '@/components/core/emotion/EmotionAnalysisEngine';
import MusicTherapyEngine from '@/components/core/music/MusicTherapyEngine';
import VirtualCoachEngine from '@/components/core/coaching/VirtualCoachEngine';
import EmotionAnalysisDashboard from '@/components/scan/EmotionAnalysisDashboard';
import { EmotionsCareMusicPlayer } from '@/components/music/emotionscare';
import { useOptimizedEmotionsCare } from '@/hooks/useOptimizedEmotionsCare';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/types';

interface UnifiedDashboardPageProps {
  variant?: 'simple' | 'premium';
}

export default function UnifiedDashboardPage({ variant = 'premium' }: UnifiedDashboardPageProps) {
  const [activeView, setActiveView] = useState<'unified' | 'navigation' | 'emotion' | 'music' | 'coach'>('unified');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  
  const {
    currentEmotion,
    generatedTrack,
    analysisHistory,
    isLoading,
    hasCurrentEmotion,
    hasGeneratedTrack,
    performCompleteWorkflow,
    getHistoryStats,
    resetState
  } = useOptimizedEmotionsCare({
    autoGenerateMusic: true,
    autoPlay: false,
    saveHistory: true,
    maxHistorySize: 100
  });

  const { toast } = useToast();
  const stats = getHistoryStats();

  const views = [
    { key: 'unified', label: 'Vue Unifiée', icon: Layout, component: UnifiedDashboard },
    { key: 'navigation', label: 'Navigation', icon: Navigation, component: NavigationHub },
    { key: 'emotion', label: 'Analyse IA', icon: Brain, component: EmotionAnalysisEngine },
    { key: 'music', label: 'Musicothérapie', icon: Music, component: MusicTherapyEngine },
    { key: 'coach', label: 'Coach IA', icon: MessageSquare, component: VirtualCoachEngine }
  ];

  // Démo rapide pour tester le workflow complet
  const runDemoWorkflow = async () => {
    const demoText = "Je me sens vraiment heureux aujourd'hui, plein d'énergie et optimiste pour l'avenir !";
    
    toast({
      title: "Démo lancée",
      description: "Analyse d'un texte de démonstration...",
      duration: 2000
    });

    await performCompleteWorkflow('text', { text: demoText }, {
      autoPlay: false,
      intensity: 0.7
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      joy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      happiness: 'bg-orange-100 text-orange-800 border-orange-200',
      calm: 'bg-blue-100 text-blue-800 border-blue-200',
      sadness: 'bg-purple-100 text-purple-800 border-purple-200',
      anger: 'bg-red-100 text-red-800 border-red-200',
      anxiety: 'bg-gray-100 text-gray-800 border-gray-200',
      neutral: 'bg-slate-100 text-slate-800 border-slate-200'
    };
    return colors[emotion?.toLowerCase()] || colors.neutral;
  };

  const currentView = views.find(v => v.key === activeView);
  const ViewComponent = currentView?.component || UnifiedDashboard;

  // Version Simple Dashboard (comme DashboardPage original)
  if (variant === 'simple') {
    return (
      <div className="container mx-auto py-8 px-4" data-testid="page-root">
        {/* Header avec sélecteur de vue */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dashboard Principal
            </h1>
            <p className="text-lg text-muted-foreground">
              Centre de contrôle de votre bien-être émotionnel
            </p>
          </div>
          
          {/* Sélecteur de vue étendu */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {views.map((view) => (
              <Button
                key={view.key}
                variant={activeView === view.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView(view.key as any)}
                className="flex items-center gap-2 text-sm"
              >
                <view.icon className="h-4 w-4" />
                {view.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Badge du module actuel */}
        <div className="mb-6">
          <Badge variant="outline" className="flex items-center gap-2 w-fit">
            {currentView && <currentView.icon className="h-4 w-4" />}
            {currentView?.label}
            <Zap className="h-3 w-3" />
          </Badge>
        </div>

        {/* Contenu dynamique */}
        <ViewComponent />
      </div>
    );
  }

  // Version Premium Dashboard (comme CompleteDashboardPage)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5" data-testid="page-root">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            EmotionsCare Dashboard Premium
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Votre plateforme complète de bien-être émotionnel avec IA et musicothérapie
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analyses Totales</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAnalyses || 0}</div>
              <p className="text-xs text-muted-foreground">Sessions d'analyse</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Émotion Dominante</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {stats?.mostCommonEmotion || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.mostCommonCount || 0} occurrences
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confiance Moyenne</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageConfidence || 0}%</div>
              <Progress value={stats?.averageConfidence || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">État Actuel</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentEmotion?.dominantEmotion || 'Inconnue'}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentEmotion ? 'Analysé' : 'En attente'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button onClick={runDemoWorkflow} disabled={isLoading} size="lg">
            <Zap className="w-5 h-5 mr-2" />
            {isLoading ? 'Traitement...' : 'Démo Complète'}
          </Button>
          
          {hasGeneratedTrack && (
            <Button 
              variant="outline" 
              onClick={() => setShowMusicPlayer(!showMusicPlayer)}
              size="lg"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              {showMusicPlayer ? 'Masquer' : 'Afficher'} Lecteur
            </Button>
          )}
          
          <Button variant="outline" onClick={resetState} size="lg">
            <Settings className="w-5 h-5 mr-2" />
            Réinitialiser
          </Button>
        </div>

        {/* Lecteur musical flottant */}
        {showMusicPlayer && hasGeneratedTrack && (
          <div className="fixed bottom-4 right-4 z-50 w-80">
            <Card className="shadow-2xl border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Lecteur EmotionsCare</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMusicPlayer(false)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <EmotionsCareMusicPlayer />
              </CardContent>
            </Card>
          </div>
        )}

        {/* État actuel */}
        {hasCurrentEmotion && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-primary" />
                État Émotionnel Actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Badge className={getEmotionColor(currentEmotion.dominantEmotion)} size="lg">
                    {currentEmotion.dominantEmotion}
                  </Badge>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Confiance: {Math.round(currentEmotion.confidence * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Humeur: {currentEmotion.overallMood}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(currentEmotion.timestamp)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Source: {currentEmotion.source}
                  </p>
                </div>
              </div>
              
              {currentEmotion.recommendations && currentEmotion.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Recommandations:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {currentEmotion.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contenu principal avec onglets */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="analysis">Analyse</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="music">Musique</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Répartition des Émotions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.emotionDistribution ? (
                    <div className="space-y-3">
                      {Object.entries(stats.emotionDistribution).map(([emotion, count]) => (
                        <div key={emotion} className="flex items-center justify-between">
                          <Badge className={getEmotionColor(emotion)} variant="outline">
                            {emotion}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={(count / stats.totalAnalyses) * 100} 
                              className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Aucune donnée disponible
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Musicothérapie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasGeneratedTrack ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">{generatedTrack.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Par {generatedTrack.artist}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge>{generatedTrack.emotion}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(generatedTrack.duration / 60)}:{(generatedTrack.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <Button 
                        onClick={() => setShowMusicPlayer(true)}
                        className="w-full"
                        size="sm"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Écouter
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Music className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">
                        Aucune musique générée
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <EmotionAnalysisDashboard />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Analyses</CardTitle>
                <CardDescription>
                  Vos dernières sessions d'analyse émotionnelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisHistory.length > 0 ? (
                  <div className="space-y-4">
                    {analysisHistory.slice(0, 10).map((result, index) => (
                      <div 
                        key={result.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <Badge className={getEmotionColor(result.dominantEmotion)}>
                              {result.dominantEmotion}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(result.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {Math.round(result.confidence * 100)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {result.source}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun historique</h3>
                    <p className="text-muted-foreground">
                      Commencez votre première analyse pour voir l'historique ici
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="music">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Lecteur Musical EmotionsCare
                </CardTitle>
                <CardDescription>
                  Contrôlez votre expérience musicothérapie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmotionsCareMusicPlayer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}