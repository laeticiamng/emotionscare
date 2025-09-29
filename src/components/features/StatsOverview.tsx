import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Heart, 
  Brain, 
  Target,
  Activity,
  Smile,
  Calendar,
  Award
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  progress: number;
  description: string;
}

const StatsOverview: React.FC = () => {
  const stats: StatCard[] = [
    {
      title: 'Score Émotionnel',
      value: '8.4/10',
      change: 12,
      trend: 'up',
      icon: Heart,
      progress: 84,
      description: '+12% cette semaine'
    },
    {
      title: 'Sessions Complétées',
      value: '23',
      change: 5,
      trend: 'up',
      icon: Target,
      progress: 76,
      description: '5 nouvelles sessions'
    },
    {
      title: 'Résilience Mentale',
      value: '7.8/10',
      change: -2,
      trend: 'down',
      icon: Brain,
      progress: 78,
      description: '-2% depuis hier'
    },
    {
      title: 'Activité Quotidienne',
      value: '92%',
      change: 8,
      trend: 'up',
      icon: Activity,
      progress: 92,
      description: '+8% ce mois'
    }
  ];

  const achievements = [
    { name: 'Constance 7 jours', icon: Calendar, color: 'text-blue-500' },
    { name: 'Progression Rapide', icon: TrendingUp, color: 'text-green-500' },
    { name: 'Équilibre Émotionnel', icon: Smile, color: 'text-purple-500' },
    { name: 'Excellence Continue', icon: Award, color: 'text-yellow-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge 
                    variant={stat.trend === 'up' ? 'success' : stat.trend === 'down' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {stat.trend === 'up' ? '+' : stat.trend === 'down' ? '-' : ''}
                    {Math.abs(stat.change)}%
                  </Badge>
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <Progress value={stat.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Badges d'accomplissements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Accomplissements Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                <div>
                  <div className="font-medium text-sm">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">Débloqué</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;