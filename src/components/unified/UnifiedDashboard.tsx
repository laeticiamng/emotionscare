/**
 * 🚀 UNIFIED DASHBOARD - EmotionsCare
 * Tableau de bord unifié premium avec toutes les fonctionnalités
 */

import React, { useState, useEffect } from 'react';
import { usePlatformManager } from '@/hooks/usePlatformManager';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizedMusicPlayer } from '@/components/music/OptimizedMusicPlayer';
import { EmotionAnalysisVisualization } from '@/components/emotion/EmotionAnalysisVisualization';
import { 
  Heart, 
  Music, 
  Brain, 
  Activity, 
  TrendingUp,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

interface DashboardStats {
  emotionalScore: number;
  musicTherapyMinutes: number;
  weeklyProgress: number;
  streakDays: number;
}

interface UnifiedDashboardProps {
  className?: string;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ 
  className = "" 
}) => {
  const { emotionManager, musicManager } = usePlatformManager();
  const { announce } = useAccessibility();
  
  const [stats, setStats] = useState<DashboardStats>({
    emotionalScore: 75,
    musicTherapyMinutes: 143,
    weeklyProgress: 68,
    streakDays: 7
  });
  
  const [currentEmotion, setCurrentEmotion] = useState<string>('calm');
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    announce('Tableau de bord EmotionsCare chargé', 'polite');
    
    // Load recommendations based on current emotion
    const emotionRecs = {
      calm: ['Continuer la méditation', 'Écouter de la musique douce', 'Pratiquer la gratitude'],
      happy: ['Partager votre joie', 'Activité créative', 'Musique énergique'],
      stressed: ['Exercices de respiration', 'Musique apaisante', 'Pause détente'],
      focused: ['Optimiser votre concentration', 'Musique de focus', 'Planifier vos objectifs']
    };
    
    setRecommendations(emotionRecs[currentEmotion as keyof typeof emotionRecs] || emotionRecs.calm);
  }, [currentEmotion, announce]);

  const handleEmotionChange = (emotion: string) => {
    setCurrentEmotion(emotion);
    announce(`Émotion changée vers ${emotion}`, 'polite');
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          <Icon className={`w-8 h-8 text-${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bonjour ! Prêt pour votre séance de bien-être ?
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre progression émotionnelle et musicale.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Score Émotionnel"
          value={`${stats.emotionalScore}%`}
          icon={Heart}
          trend="+5% cette semaine"
          color="red-500"
        />
        <StatCard
          title="Thérapie Musicale"
          value={`${stats.musicTherapyMinutes}min`}
          icon={Music}
          trend="Cette semaine"
          color="blue-500"
        />
        <StatCard
          title="Progrès Hebdo"
          value={`${stats.weeklyProgress}%`}
          icon={TrendingUp}
          trend="Objectif: 80%"
          color="green-500"
        />
        <StatCard
          title="Série Continue"
          value={`${stats.streakDays} jours`}
          icon={Zap}
          trend="Record personnel!"
          color="yellow-500"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="emotion">Analyse Émotions</TabsTrigger>
          <TabsTrigger value="music">Thérapie Musicale</TabsTrigger>
          <TabsTrigger value="progress">Progrès</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current State */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  État Émotionnel Actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {currentEmotion}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Détecté il y a 5 minutes
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Émotions alternatives</h4>
                    <div className="flex flex-wrap gap-2">
                      {['calm', 'happy', 'focused', 'relaxed'].map((emotion) => (
                        <Button
                          key={emotion}
                          variant={emotion === currentEmotion ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleEmotionChange(emotion)}
                        >
                          {emotion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Recommandations Personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Brain className="w-6 h-6" />
                  <span className="text-sm">Scanner Émotion</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Music className="w-6 h-6" />
                  <span className="text-sm">Thérapie Musicale</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Activity className="w-6 h-6" />
                  <span className="text-sm">Méditation</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2" variant="outline">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Planifier Séance</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotion">
          <EmotionAnalysisVisualization mode="face" />
        </TabsContent>

        <TabsContent value="music">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OptimizedMusicPlayer showVisualizer={true} />
            
            <Card>
              <CardHeader>
                <CardTitle>Playlists Thérapeutiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Détente Profonde', tracks: 12, duration: '45 min', emotion: 'calm' },
                    { name: 'Énergie Positive', tracks: 15, duration: '52 min', emotion: 'happy' },
                    { name: 'Focus Intense', tracks: 10, duration: '38 min', emotion: 'focused' },
                    { name: 'Sérénité Nocturne', tracks: 8, duration: '32 min', emotion: 'peaceful' },
                  ].map((playlist, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{playlist.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {playlist.tracks} pistes • {playlist.duration}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Écouter
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progression Cette Semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Séances de méditation</span>
                      <span>5/7 jours</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '71%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Temps d'écoute musicale</span>
                      <span>143/180 min</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '79%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyses émotionnelles</span>
                      <span>12/15</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs du Mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { goal: 'Méditer 20 jours', progress: 65, current: 13, target: 20 },
                    { goal: '10h de thérapie musicale', progress: 43, current: 4.3, target: 10 },
                    { goal: 'Score émotionnel 85%', progress: 88, current: 75, target: 85 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.goal}</span>
                        <span>{item.current}/{item.target}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};