import React from 'react';
import EmotionAnalysisDashboard from '@/components/scan/EmotionAnalysisDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Camera,
  TrendingUp,
  Calendar,
  Activity,
  Smile,
  Meh,
  Frown,
  Eye,
  Zap
} from 'lucide-react';

const EmotionsPage: React.FC = () => {
  const [currentEmotion] = React.useState({
    primary: 'Joie',
    intensity: 75,
    confidence: 92,
    secondary: ['Satisfaction', 'Optimisme']
  });

  const emotionHistory = [
    { time: '09:00', emotion: 'Énergie', intensity: 85, color: 'bg-green-500' },
    { time: '12:30', emotion: 'Calme', intensity: 70, color: 'bg-blue-500' },
    { time: '15:45', emotion: 'Focus', intensity: 80, color: 'bg-purple-500' },
    { time: '18:00', emotion: 'Détente', intensity: 65, color: 'bg-teal-500' }
  ];

  const emotionInsights = [
    {
      title: 'Pic de Productivité',
      description: 'Vos meilleures performances sont entre 14h-16h',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Pattern de Stress',
      description: 'Tensions récurrentes les lundis matins',
      icon: Brain,
      color: 'text-yellow-500'
    },
    {
      title: 'Évolution Positive',
      description: '+15% de bien-être cette semaine',
      icon: Heart,
      color: 'text-pink-500'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4" data-testid="page-root">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Analyse Émotionnelle</h1>
          <Badge variant="outline" className="bg-pink-50 text-pink-700">
            <Eye className="h-3 w-3 mr-1" />
            IA Temps Réel
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Comprenez et suivez votre état émotionnel avec l'intelligence artificielle
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analyse en temps réel */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Analyse Faciale en Temps Réel
              </CardTitle>
              <CardDescription>
                Détection automatique de vos émotions via reconnaissance faciale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <Smile className="h-16 w-16 text-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Émotion Principale</span>
                      <Badge variant="secondary">{currentEmotion.confidence}% confiance</Badge>
                    </div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {currentEmotion.primary}
                    </div>
                    <Progress value={currentEmotion.intensity} className="h-3" />
                    <div className="text-sm text-muted-foreground mt-1">
                      Intensité: {currentEmotion.intensity}%
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Émotions secondaires:</span>
                    <div className="flex gap-2 mt-1">
                      {currentEmotion.secondary.map((emotion) => (
                        <Badge key={emotion} variant="outline" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="flex flex-col gap-2 h-20">
                  <Camera className="h-5 w-5" />
                  <span className="text-xs">Nouvelle Analyse</span>
                </Button>
                <Button variant="outline" className="flex flex-col gap-2 h-20">
                  <Activity className="h-5 w-5" />
                  <span className="text-xs">Historique</span>
                </Button>
                <Button variant="outline" className="flex flex-col gap-2 h-20">
                  <Brain className="h-5 w-5" />
                  <span className="text-xs">Recommandations</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Évolution émotionnelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Évolution de la Journée
              </CardTitle>
              <CardDescription>
                Votre parcours émotionnel d'aujourd'hui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emotionHistory.map((entry, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="text-sm font-mono text-muted-foreground w-12">
                      {entry.time}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${entry.color}`} />
                    <div className="flex-1">
                      <div className="font-medium">{entry.emotion}</div>
                      <Progress value={entry.intensity} className="h-2 mt-1" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.intensity}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights et recommandations */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Insights IA
              </CardTitle>
              <CardDescription>
                Analyse comportementale personnalisée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {emotionInsights.map((insight, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex items-start gap-3">
                    <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                    <div>
                      <h4 className="font-medium mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Actions Recommandées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Session de relaxation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Planifier pause bien-être
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Exercices de respiration
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmotionsPage;