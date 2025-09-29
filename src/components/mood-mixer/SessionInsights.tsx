import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain,
  TrendingUp,
  Clock,
  Heart,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Lightbulb,
  Users
} from 'lucide-react';
import { MoodMixerSession, MoodMixerPreferences } from '@/types/mood-mixer';

interface SessionInsightsProps {
  sessions: MoodMixerSession[];
  stats: any;
  preferences: MoodMixerPreferences | null;
}

const SessionInsights: React.FC<SessionInsightsProps> = ({ 
  sessions, 
  stats, 
  preferences 
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock data pour les insights - en production viendrait d'une analyse IA
  const insights = {
    moodPatterns: [
      {
        pattern: 'Pic d\'énergie matinal',
        description: 'Vous préférez les mix énergiques entre 8h et 10h',
        confidence: 87,
        recommendation: 'Planifiez vos tâches importantes durant cette période'
      },
      {
        pattern: 'Besoin de calme en soirée',
        description: 'Tendance vers des mix apaisants après 19h',
        confidence: 92,
        recommendation: 'Intégrez plus de méditation et de nature dans vos mix du soir'
      },
      {
        pattern: 'Créativité le mercredi',
        description: 'Vos sessions créatives sont 40% plus longues le mercredi',
        confidence: 73,
        recommendation: 'Bloquez du temps créatif le mercredi après-midi'
      }
    ],
    emotionalProgress: {
      improvement: 23,
      consistencyScore: 78,
      stressReduction: 34,
      focusImprovement: 19
    },
    recommendations: [
      {
        type: 'mix',
        title: 'Essayez les mix binauraux',
        description: 'Basé sur vos sessions de concentration, les battements binauraux pourraient améliorer votre focus de 15%',
        priority: 'high'
      },
      {
        type: 'schedule',
        title: 'Routine matinale optimisée',
        description: 'Une session de 12 minutes d\'énergie + focus pourrait parfaitement s\'intégrer à votre routine',
        priority: 'medium'
      },
      {
        type: 'social',
        title: 'Partagez vos succès',
        description: 'Vos amis ayant des objectifs similaires pourraient bénéficier de vos mix populaires',
        priority: 'low'
      }
    ]
  };

  const weeklyMoodData = [
    { day: 'Lun', energy: 6, focus: 8, calm: 4, creative: 5 },
    { day: 'Mar', energy: 7, focus: 7, calm: 5, creative: 6 },
    { day: 'Mer', energy: 8, focus: 6, calm: 4, creative: 9 },
    { day: 'Jeu', energy: 7, focus: 9, calm: 3, creative: 7 },
    { day: 'Ven', energy: 9, focus: 5, calm: 6, creative: 8 },
    { day: 'Sam', energy: 5, focus: 4, calm: 8, creative: 6 },
    { day: 'Dim', energy: 4, focus: 3, calm: 9, creative: 5 }
  ];

  const getImprovementColor = (value: number) => {
    if (value > 20) return 'text-green-500';
    if (value > 10) return 'text-yellow-500';
    if (value > 0) return 'text-blue-500';
    return 'text-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Insights Personnalisés
          </h2>
          <p className="text-muted-foreground">
            Analyse intelligente de vos habitudes et recommandations IA
          </p>
        </div>
        
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range as any)}
            >
              {range === 'week' && 'Semaine'}
              {range === 'month' && 'Mois'}
              {range === 'year' && 'Année'}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="progress">Progrès</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* Métriques principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
                <div className="text-sm text-muted-foreground">Sessions totales</div>
                <div className="text-xs text-green-500 mt-1">+12% ce mois</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round(stats.totalListenTime / 60)}h
                </div>
                <div className="text-sm text-muted-foreground">Temps d'écoute</div>
                <div className="text-xs text-blue-500 mt-1">+8% ce mois</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-secondary">{stats.moodImprovementRate}%</div>
                <div className="text-sm text-muted-foreground">Amélioration</div>
                <div className="text-xs text-green-500 mt-1">+5% ce mois</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-destructive">{stats.averageSessionDuration}</div>
                <div className="text-sm text-muted-foreground">Durée moy. (min)</div>
                <div className="text-xs text-yellow-500 mt-1">-2min ce mois</div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique hebdomadaire simplifié */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Activité hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyMoodData.map((day, index) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-12">{day.day}</span>
                      <div className="flex gap-2 flex-1 max-w-md">
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(day.energy / 10) * 100}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full bg-red-400"
                          />
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(day.focus / 10) * 100}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full bg-blue-400"
                          />
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(day.calm / 10) * 100}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full bg-green-400"
                          />
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(day.creative / 10) * 100}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full bg-purple-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span>Énergie</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span>Focus</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>Calme</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span>Créativité</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patterns */}
        <TabsContent value="patterns" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {insights.moodPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.pattern}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{pattern.pattern}</span>
                      <Badge variant="secondary">
                        {pattern.confidence}% sûr
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">
                      {pattern.description}
                    </p>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm">
                          <strong>Recommandation:</strong> {pattern.recommendation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Progrès */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Amélioration émotionnelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(insights.emotionalProgress).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    improvement: 'Amélioration générale',
                    consistencyScore: 'Score de consistance',
                    stressReduction: 'Réduction du stress',
                    focusImprovement: 'Amélioration du focus'
                  };
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{labels[key]}</span>
                        <span className={`font-medium ${getImprovementColor(value as number)}`}>
                          +{value}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (value as number) * 2)}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-2 bg-gradient-to-r from-primary to-accent rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Objectifs du mois
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">20 sessions complétées</span>
                    <span className="text-sm font-medium">15/20</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="w-3/4 h-2 bg-primary rounded-full" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">300 min d'écoute</span>
                    <span className="text-sm font-medium">280/300</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="w-11/12 h-2 bg-accent rounded-full" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">3 nouveaux mix créés</span>
                    <span className="text-sm font-medium">2/3</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="w-2/3 h-2 bg-secondary rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommandations */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            {insights.recommendations.map((rec, index) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {rec.type === 'mix' && <Heart className="h-5 w-5 text-primary" />}
                        {rec.type === 'schedule' && <Clock className="h-5 w-5 text-accent" />}
                        {rec.type === 'social' && <Users className="h-5 w-5 text-secondary" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{rec.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={getPriorityColor(rec.priority)}
                          >
                            {rec.priority === 'high' && 'Priorité haute'}
                            {rec.priority === 'medium' && 'Priorité moyenne'}
                            {rec.priority === 'low' && 'Priorité basse'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {rec.description}
                        </p>
                        <Button size="sm" variant="outline">
                          Appliquer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionInsights;