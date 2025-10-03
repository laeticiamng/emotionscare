
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Brain, Heart, Target, Award } from 'lucide-react';

const CoachInsights: React.FC = () => {
  // Mock data for insights
  const insights = {
    emotionalTrend: 'stable',
    wellnessScore: 78,
    improvementAreas: ['Gestion du stress', 'Qualité du sommeil'],
    strengths: ['Communication', 'Résilience', 'Optimisme'],
    weeklyProgress: 85,
    sessionsCompleted: 12,
    goals: [
      { id: '1', title: 'Méditer 10 min/jour', progress: 70, target: 100 },
      { id: '2', title: 'Réduire le stress', progress: 45, target: 80 },
      { id: '3', title: 'Améliorer le sommeil', progress: 60, target: 90 }
    ]
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'positive': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'needs-attention': return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'stable': return <Heart className="h-4 w-4 text-blue-600" />;
      case 'needs-attention': return <Brain className="h-4 w-4 text-amber-600" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wellness Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Score de bien-être global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-primary">{insights.wellnessScore}/100</div>
            <div className="flex items-center gap-2">
              {getTrendIcon(insights.emotionalTrend)}
              <span className={`text-sm font-medium ${getTrendColor(insights.emotionalTrend)}`}>
                Tendance {insights.emotionalTrend === 'stable' ? 'stable' : insights.emotionalTrend}
              </span>
            </div>
          </div>
          <Progress value={insights.wellnessScore} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            Vous avez progressé de 12 points ce mois-ci ! Continuez vos efforts.
          </p>
        </CardContent>
      </Card>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Objectifs en cours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.goals.map(goal => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{goal.title}</span>
                <span className="text-xs text-muted-foreground">
                  {goal.progress}% / {goal.target}%
                </span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths & Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-green-600">Points forts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.strengths.map((strength, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {strength}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-amber-600">Axes d'amélioration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.improvementAreas.map((area, index) => (
                <Badge key={index} variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Résumé de la semaine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{insights.sessionsCompleted}</div>
              <p className="text-sm text-muted-foreground">Sessions complétées</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{insights.weeklyProgress}%</div>
              <p className="text-sm text-muted-foreground">Progression hebdomadaire</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommandations personnalisées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                💡 Essayez une session de respiration de 5 minutes avant de vous coucher pour améliorer votre sommeil.
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                🎯 Vous excellez en communication ! Partagez vos techniques avec d'autres membres.
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                ⚡ Intégrez des pauses mindfulness de 2 minutes dans votre journée de travail.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachInsights;
