/**
 * ProgressTracker - Suivi des progrès en temps réel
 * Composant pour suivre et visualiser les progrès utilisateur
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  Zap,
  Clock,
  BarChart3,
  Star,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface ProgressData {
  category: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  achieved: boolean;
  achievedAt?: Date;
  reward?: string;
}

const ProgressTracker: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({});

  const progressData: ProgressData[] = [
    {
      category: 'Sessions complétées',
      current: 12,
      target: 20,
      trend: 'up',
      trendValue: 15,
      unit: 'sessions',
      icon: <Zap className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      category: 'Objectifs atteints',
      current: 8,
      target: 10,
      trend: 'up',
      trendValue: 25,
      unit: 'objectifs',
      icon: <Target className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      category: 'Temps d\'activité',
      current: 145,
      target: 200,
      trend: 'up',
      trendValue: 8,
      unit: 'minutes',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      category: 'Série actuelle',
      current: 7,
      target: 14,
      trend: 'stable',
      trendValue: 0,
      unit: 'jours',
      icon: <Award className="h-5 w-5" />,
      color: 'text-orange-600'
    }
  ];

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Premier pas',
      description: 'Complétez votre première session',
      target: 1,
      current: 1,
      achieved: true,
      achievedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      reward: 'Badge Débutant'
    },
    {
      id: '2',
      title: 'Habitué',
      description: 'Complétez 10 sessions',
      target: 10,
      current: 12,
      achieved: true,
      achievedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      reward: 'Badge Régulier'
    },
    {
      id: '3',
      title: 'Série hebdomadaire',
      description: 'Maintenez une série de 7 jours',
      target: 7,
      current: 7,
      achieved: true,
      achievedAt: new Date(),
      reward: 'Badge Persévérant'
    },
    {
      id: '4',
      title: 'Expert',
      description: 'Complétez 50 sessions',
      target: 50,
      current: 12,
      achieved: false
    },
    {
      id: '5',
      title: 'Maître',
      description: 'Atteignez 100 heures d\'activité',
      target: 6000, // en minutes
      current: 145,
      achieved: false
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'down': return <ArrowDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Animation des barres de progression
  useEffect(() => {
    const timer = setTimeout(() => {
      const animated: Record<string, number> = {};
      progressData.forEach(item => {
        animated[item.category] = (item.current / item.target) * 100;
      });
      setAnimatedProgress(animated);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const overallProgress = progressData.reduce((acc, item) => acc + (item.current / item.target), 0) / progressData.length * 100;
  const achievedMilestones = milestones.filter(m => m.achieved).length;
  const totalPoints = achievedMilestones * 100 + progressData.reduce((acc, item) => acc + item.current, 0) * 10;

  return (
    <div className="space-y-6">
      
      {/* En-tête avec résumé */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Suivi des progrès
          </h2>
          <p className="text-muted-foreground">
            Visualisez votre évolution et vos accomplissements
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {['week', 'month', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period as any)}
            >
              {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Année'}
            </Button>
          ))}
        </div>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-blue-700">Progression globale</div>
            <Progress value={overallProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{achievedMilestones}</div>
            <div className="text-sm text-green-700">Étapes franchies</div>
            <div className="text-xs text-green-600 mt-1">sur {milestones.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalPoints.toLocaleString()}</div>
            <div className="text-sm text-purple-700">Points totaux</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="h-3 w-3 text-purple-500" />
              <span className="text-xs text-purple-600">Niveau Expert</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {progressData.find(p => p.category === 'Série actuelle')?.current || 0}
            </div>
            <div className="text-sm text-orange-700">Jours consécutifs</div>
            <div className="text-xs text-orange-600 mt-1">Record personnel</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Progression par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={item.color}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono">
                      {item.current}/{item.target} {item.unit}
                    </span>
                    {item.trend !== 'stable' && (
                      <div className="flex items-center gap-1">
                        {getTrendIcon(item.trend)}
                        <span className={`text-xs ${
                          item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.trendValue}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Progress 
                  value={animatedProgress[item.category] || 0} 
                  className="h-3"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {Math.round((item.current / item.target) * 100)}% complété
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Étapes et récompenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Étapes et récompenses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-3 rounded-lg border-l-4 ${
                  milestone.achieved 
                    ? 'border-l-green-500 bg-green-50/50' 
                    : 'border-l-gray-300 bg-gray-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{milestone.title}</h4>
                      {milestone.achieved && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-muted-foreground">
                        {milestone.current} / {milestone.target}
                      </div>
                      {milestone.achieved && milestone.achievedAt && (
                        <div className="text-xs text-green-600">
                          {formatDate(milestone.achievedAt)}
                        </div>
                      )}
                    </div>
                    <Progress 
                      value={Math.min((milestone.current / milestone.target) * 100, 100)} 
                      className="mt-2 h-2"
                    />
                  </div>
                </div>
                {milestone.reward && (
                  <div className="mt-2">
                    <Badge 
                      variant={milestone.achieved ? "default" : "secondary"}
                      className="text-xs"
                    >
                      🏆 {milestone.reward}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse détaillée</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(totalPoints / achievedMilestones) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Points par étape</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(overallProgress / progressData.length) || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Moyenne de progression</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {milestones.length - achievedMilestones}
              </div>
              <div className="text-sm text-muted-foreground">Étapes restantes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;