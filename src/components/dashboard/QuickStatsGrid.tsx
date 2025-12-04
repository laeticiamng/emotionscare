// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, Heart,
  Brain, Zap, Target, Award, Clock, Star, Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuickStat {
  id: string;
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface QuickStatsGridProps {
  userRole?: 'consumer' | 'employee' | 'manager';
}

const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({ userRole = 'consumer' }) => {
  const consumerStats: QuickStat[] = [
    {
      id: 'mood',
      title: 'Humeur Moyenne',
      value: '8.2',
      change: 12,
      trend: 'up',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-accent',
      description: 'Sur 10, cette semaine'
    },
    {
      id: 'sessions',
      title: 'Sessions Cette Semaine',
      value: 14,
      change: 5,
      trend: 'up',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-primary',
      description: 'Toutes activités confondues'
    },
    {
      id: 'streak',
      title: 'Série Actuelle',
      value: '7 jours',
      change: 0,
      trend: 'stable',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-success',
      description: 'Record personnel : 23 jours'
    },
    {
      id: 'xp',
      title: 'XP Total',
      value: '2,847',
      change: 23,
      trend: 'up',
      icon: <Star className="w-5 h-5" />,
      color: 'bg-warning',
      description: 'Niveau 15 - Explorateur'
    }
  ];

  const employeeStats: QuickStat[] = [
    {
      id: 'team-wellness',
      title: 'Bien-être Équipe',
      value: '7.8',
      change: 8,
      trend: 'up',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-accent',
      description: 'Score moyen équipe'
    },
    {
      id: 'participation',
      title: 'Participation',
      value: '89%',
      change: 15,
      trend: 'up',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-primary',
      description: 'Activités d\'équipe'
    },
    {
      id: 'productivity',
      title: 'Indice Productivité',
      value: '94',
      change: 7,
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-success',
      description: 'Basé sur le bien-être'
    },
    {
      id: 'support',
      title: 'Soutien Reçu',
      value: 23,
      change: 12,
      trend: 'up',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-warning',
      description: 'Messages d\'encouragement'
    }
  ];

  const managerStats: QuickStat[] = [
    {
      id: 'global-wellness',
      title: 'Bien-être Global',
      value: '8.1',
      change: 5,
      trend: 'up',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-success',
      description: 'Toutes équipes confondues'
    },
    {
      id: 'engagement',
      title: 'Engagement Moyen',
      value: '86%',
      change: 9,
      trend: 'up',
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-primary',
      description: 'Participation aux programmes'
    },
    {
      id: 'retention',
      title: 'Rétention',
      value: '94%',
      change: 2,
      trend: 'up',
      icon: <Award className="w-5 h-5" />,
      color: 'bg-accent',
      description: 'Taux de fidélisation'
    },
    {
      id: 'roi',
      title: 'ROI Bien-être',
      value: '312%',
      change: 18,
      trend: 'up',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-success',
      description: 'Retour sur investissement'
    }
  ];

  const getStats = () => {
    switch (userRole) {
      case 'employee':
        return employeeStats;
      case 'manager':
        return managerStats;
      default:
        return consumerStats;
    }
  };

  const stats = getStats();

  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
        >
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              {/* Header avec icône et titre */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-20`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {renderTrendIcon(stat.trend)}
                  {stat.change > 0 && (
                    <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                      +{stat.change}%
                    </Badge>
                  )}
                </div>
              </div>

              {/* Valeur principale */}
              <div className="mb-2">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground">{stat.description}</p>

              {/* Effet de brillance au survol */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickStatsGrid;