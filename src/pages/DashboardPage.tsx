import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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
  Zap
} from 'lucide-react';
import EmotionMeter from '@/components/features/EmotionMeter';
import MoodChart from '@/components/features/MoodChart';

const DashboardPage: React.FC = () => {
  const [emotionalData] = React.useState({
    currentMood: 7.5,
    weeklyAverage: 6.8,
    improvement: '+12%',
    streak: 14
  });

  const recentActivities = [
    { type: 'journal', title: 'Séance de réflexion matinale', time: '8:30', mood: 'positive' },
    { type: 'music', title: 'Session de relaxation', time: '14:15', mood: 'calm' },
    { type: 'chat', title: 'Discussion avec Nyvée', time: '16:45', mood: 'neutral' },
    { type: 'meditation', title: 'Méditation guidée', time: '19:00', mood: 'peaceful' }
  ];

  const weeklyGoals = [
    { name: 'Sessions de méditation', current: 5, target: 7, progress: 71 },
    { name: 'Entrées journal', current: 12, target: 14, progress: 86 },
    { name: 'Temps d\'écoute musicale', current: 3.2, target: 4, progress: 80, unit: 'h' }
  ];

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Activity className="h-3 w-3 mr-1" />
            En temps réel
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre progression émotionnelle et bien-être
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Humeur Actuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {emotionalData.currentMood}/10
              </div>
              <Progress value={emotionalData.currentMood * 10} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Excellent niveau aujourd'hui
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">
                {emotionalData.improvement}
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">
                vs semaine dernière
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Série Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                {emotionalData.streak}
              </div>
              <Progress value={90} className="h-2" />
              <p className="text-xs text-muted-foreground">
                jours consécutifs
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Score Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-yellow-600">
                {emotionalData.weeklyAverage}
              </div>
              <Progress value={emotionalData.weeklyAverage * 10} className="h-2" />
              <p className="text-xs text-muted-foreground">
                moyenne hebdomadaire
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Émotion meter interactif */}
        <div className="lg:col-span-1">
          <EmotionMeter 
            initialValue={8}
            onValueChange={(value) => console.log('Nouvelle valeur:', value)}
            showTrend={true}
          />
        </div>

        {/* Graphique des tendances */}
        <div className="lg:col-span-2">
          <MoodChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activités récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activités Récentes
            </CardTitle>
            <CardDescription>
              Vos dernières interactions avec EmotionsCare
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
                    {activity.type === 'meditation' && <Heart className="h-4 w-4 text-pink-500" />}
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

        {/* Objectifs hebdomadaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs Hebdomadaires
            </CardTitle>
            <CardDescription>
              Votre progression vers vos objectifs de bien-être
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {weeklyGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current}{goal.unit || ''} / {goal.target}{goal.unit || ''}
                    </span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {goal.progress}% completé
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Personnaliser les objectifs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="text-sm">Nouveau Journal</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Music className="h-6 w-6" />
            <span className="text-sm">Musique Adaptée</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Heart className="h-6 w-6" />
            <span className="text-sm">Check Émotionnel</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Calendar className="h-6 w-6" />
            <span className="text-sm">Planifier Session</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;