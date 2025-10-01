// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, TrendingDown, Target, Award, 
  Clock, Users, Activity, Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PerformanceMetricsProps {
  filters: Record<string, any>;
  userRole?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ filters, userRole }) => {
  const isAdmin = userRole === 'b2b_admin';

  const performanceData = {
    overall: {
      score: 85,
      change: +7,
      trend: 'up' as const,
      benchmark: 82
    },
    categories: [
      {
        name: 'Bien-être émotionnel',
        current: 88,
        target: 90,
        previous: 82,
        color: 'bg-green-500'
      },
      {
        name: 'Productivité',
        current: 82,
        target: 85,
        previous: 79,
        color: 'bg-blue-500'
      },
      {
        name: 'Engagement',
        current: 78,
        target: 80,
        previous: 75,
        color: 'bg-purple-500'
      },
      {
        name: 'Équilibre vie-travail',
        current: 85,
        target: 85,
        previous: 80,
        color: 'bg-orange-500'
      }
    ],
    kpis: [
      {
        name: 'Utilisation plateforme',
        value: '87%',
        change: +5,
        icon: Activity,
        description: 'Taux d\'utilisation quotidien'
      },
      {
        name: 'Temps moyen session',
        value: '18min',
        change: +3,
        icon: Clock,
        description: 'Durée moyenne par session'
      },
      {
        name: 'Score satisfaction',
        value: '4.6/5',
        change: +0.2,
        icon: Award,
        description: 'Note moyenne utilisateurs'
      },
      {
        name: 'Objectifs atteints',
        value: '78%',
        change: +12,
        icon: Target,
        description: 'Pourcentage d\'objectifs réalisés'
      }
    ]
  };

  const teamMetrics = isAdmin ? [
    {
      department: 'Développement',
      members: 24,
      engagement: 92,
      wellbeing: 85,
      productivity: 88,
      trend: 'up' as const
    },
    {
      department: 'Marketing',
      members: 18,
      engagement: 78,
      wellbeing: 82,
      productivity: 85,
      trend: 'stable' as const
    },
    {
      department: 'Ventes',
      members: 15,
      engagement: 72,
      wellbeing: 75,
      productivity: 90,
      trend: 'down' as const
    },
    {
      department: 'Support',
      members: 12,
      engagement: 88,
      wellbeing: 90,
      productivity: 82,
      trend: 'up' as const
    }
  ] : null;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Score global de performance */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Score Global de Performance
            </span>
            <Badge variant={performanceData.overall.trend === 'up' ? 'default' : 'destructive'}>
              {performanceData.overall.change > 0 ? '+' : ''}{performanceData.overall.change}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {performanceData.overall.score}
              </div>
              <p className="text-sm text-muted-foreground">Score Actuel</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-muted-foreground mb-2">
                {performanceData.overall.benchmark}
              </div>
              <p className="text-sm text-muted-foreground">Benchmark Industrie</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-semibold mb-2 ${getTrendColor(performanceData.overall.trend)}`}>
                {performanceData.overall.change > 0 ? '+' : ''}{performanceData.overall.change}%
              </div>
              <p className="text-sm text-muted-foreground">Évolution Mensuelle</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={performanceData.overall.score} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Métriques par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Performance par Catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {performanceData.categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{category.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {category.current}%
                    </Badge>
                    {category.current >= category.previous ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Actuel: {category.current}%</span>
                    <span>Objectif: {category.target}%</span>
                  </div>
                  <Progress value={category.current} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Précédent: {category.previous}%</span>
                    <span>
                      {category.current >= category.target ? '✓ Objectif atteint' : 
                       `${category.target - category.current}% restant`}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPIs détaillés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceData.kpis.map((kpi, index) => (
          <motion.div
            key={kpi.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon className="h-6 w-6 text-primary" />
                  <Badge variant={kpi.change >= 0 ? 'default' : 'destructive'} className="text-xs">
                    {kpi.change > 0 ? '+' : ''}{kpi.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="font-medium text-sm">{kpi.name}</div>
                  <div className="text-xs text-muted-foreground">{kpi.description}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Métriques d'équipe (Admin uniquement) */}
      {isAdmin && teamMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Performance par Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMetrics.map((team, index) => (
                <motion.div
                  key={team.department}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{team.department}</h3>
                      <p className="text-sm text-muted-foreground">
                        {team.members} membres
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(team.trend)}
                      <Badge variant="outline">
                        Score: {Math.round((team.engagement + team.wellbeing + team.productivity) / 3)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <div className="font-semibold">{team.engagement}%</div>
                      <Progress value={team.engagement} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Bien-être</p>
                      <div className="font-semibold">{team.wellbeing}%</div>
                      <Progress value={team.wellbeing} className="h-1" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Productivité</p>
                      <div className="font-semibold">{team.productivity}%</div>
                      <Progress value={team.productivity} className="h-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommandations d'amélioration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Recommandations d'Amélioration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-green-700">Points forts à maintenir</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Excellent score de bien-être émotionnel (88%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Équilibre vie-travail optimal atteint</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Forte satisfaction utilisateur (4.6/5)</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-orange-700">Axes d'amélioration</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Augmenter l'engagement (objectif: 80%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Améliorer la productivité (objectif: 85%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Atteindre 22% d'objectifs supplémentaires</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
