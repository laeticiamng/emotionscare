// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Activity, Heart,
  Brain, Zap, Target, Award, Clock, Star, Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [stats, setStats] = useState<QuickStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setStats(getDefaultStats(userRole));
          setIsLoading(false);
          return;
        }

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        // Fetch emotion scans
        const { data: scans } = await supabase
          .from('emotion_scans')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', twoWeeksAgo.toISOString())
          .order('created_at', { ascending: false });

        // Fetch activity sessions
        const { data: sessions } = await supabase
          .from('activity_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', twoWeeksAgo.toISOString())
          .order('created_at', { ascending: false });

        // Fetch gamification metrics
        const { data: metrics } = await supabase
          .from('gamification_metrics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Calculate stats
        const thisWeekScans = (scans || []).filter(s => new Date(s.created_at) >= weekAgo);
        const lastWeekScans = (scans || []).filter(s => new Date(s.created_at) >= twoWeeksAgo && new Date(s.created_at) < weekAgo);

        const thisWeekSessions = (sessions || []).filter(s => new Date(s.created_at) >= weekAgo);
        const lastWeekSessions = (sessions || []).filter(s => new Date(s.created_at) >= twoWeeksAgo && new Date(s.created_at) < weekAgo);

        const avgMood = thisWeekScans.length > 0
          ? thisWeekScans.reduce((sum, s) => sum + (s.mood_score || 5), 0) / thisWeekScans.length
          : 5;
        const lastAvgMood = lastWeekScans.length > 0
          ? lastWeekScans.reduce((sum, s) => sum + (s.mood_score || 5), 0) / lastWeekScans.length
          : avgMood;
        const moodChange = lastAvgMood > 0 ? Math.round(((avgMood - lastAvgMood) / lastAvgMood) * 100) : 0;

        const sessionsChange = lastWeekSessions.length > 0
          ? Math.round(((thisWeekSessions.length - lastWeekSessions.length) / lastWeekSessions.length) * 100)
          : thisWeekSessions.length > 0 ? 100 : 0;

        // Calculate streak
        const uniqueDays = new Set((sessions || []).map(s => s.created_at.split('T')[0]));
        let streak = 0;
        let checkDate = new Date();
        while (uniqueDays.has(checkDate.toISOString().split('T')[0])) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }

        const totalXP = metrics?.total_points || 0;
        const level = Math.floor(totalXP / 100) + 1;
        const levelNames = ['Débutant', 'Explorer', 'Aventurier', 'Expert', 'Maître', 'Légende'];
        const levelName = levelNames[Math.min(level - 1, levelNames.length - 1)];

        setStats([
          {
            id: 'mood',
            title: 'Humeur Moyenne',
            value: avgMood.toFixed(1),
            change: Math.abs(moodChange),
            trend: moodChange >= 0 ? 'up' : 'down',
            icon: <Heart className="w-5 h-5" />,
            color: 'bg-accent',
            description: 'Sur 10, cette semaine'
          },
          {
            id: 'sessions',
            title: 'Sessions Cette Semaine',
            value: thisWeekSessions.length,
            change: Math.abs(sessionsChange),
            trend: sessionsChange >= 0 ? 'up' : 'down',
            icon: <Activity className="w-5 h-5" />,
            color: 'bg-primary',
            description: 'Toutes activités confondues'
          },
          {
            id: 'streak',
            title: 'Série Actuelle',
            value: `${streak} jours`,
            change: 0,
            trend: 'stable',
            icon: <Target className="w-5 h-5" />,
            color: 'bg-success',
            description: streak > 7 ? `Record en cours !` : 'Continuez ainsi !'
          },
          {
            id: 'xp',
            title: 'XP Total',
            value: totalXP.toLocaleString(),
            change: 0,
            trend: 'up',
            icon: <Star className="w-5 h-5" />,
            color: 'bg-warning',
            description: `Niveau ${level} - ${levelName}`
          }
        ]);
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats(getDefaultStats(userRole));
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [userRole]);

  const getDefaultStats = (role: string): QuickStat[] => [
    {
      id: 'mood',
      title: 'Humeur Moyenne',
      value: '5.0',
      change: 0,
      trend: 'stable',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-accent',
      description: 'Sur 10, cette semaine'
    },
    {
      id: 'sessions',
      title: 'Sessions Cette Semaine',
      value: 0,
      change: 0,
      trend: 'stable',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-primary',
      description: 'Toutes activités confondues'
    },
    {
      id: 'streak',
      title: 'Série Actuelle',
      value: '0 jours',
      change: 0,
      trend: 'stable',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-success',
      description: 'Commencez votre série !'
    },
    {
      id: 'xp',
      title: 'XP Total',
      value: '0',
      change: 0,
      trend: 'stable',
      icon: <Star className="w-5 h-5" />,
      color: 'bg-warning',
      description: 'Niveau 1 - Débutant'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const consumerStats: QuickStat[] = stats.length > 0 ? stats : [
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

  const getDisplayStats = () => {
    if (stats.length > 0 && userRole === 'consumer') {
      return stats;
    }
    switch (userRole) {
      case 'employee':
        return employeeStats;
      case 'manager':
        return managerStats;
      default:
        return stats.length > 0 ? stats : consumerStats;
    }
  };

  const displayStats = getDisplayStats();

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
      {displayStats.map((stat, index) => (
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
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-20 text-white`}>
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