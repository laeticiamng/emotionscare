import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Dumbbell, 
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { GritStats } from '@/types/boss-level-grit';

interface ProgressStatsProps {
  stats: GritStats;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ stats }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mental': return <Brain className="h-5 w-5" />;
      case 'physical': return <Dumbbell className="h-5 w-5" />;
      case 'emotional': return <Heart className="h-5 w-5" />;
      case 'spiritual': return <Sparkles className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'mental': return 'Mental';
      case 'physical': return 'Physique';
      case 'emotional': return 'Émotionnel';
      case 'spiritual': return 'Spirituel';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mental': return 'hsl(var(--primary))';
      case 'physical': return 'hsl(var(--destructive))';
      case 'emotional': return 'hsl(var(--accent))';
      case 'spiritual': return 'hsl(var(--secondary))';
      default: return 'hsl(var(--muted))';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div className="space-y-6">
      {/* Niveau actuel et progression */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{stats.currentLevel.icon}</span>
                <span>{stats.currentLevel.name}</span>
              </div>
              <Badge variant="secondary">
                Niveau {stats.currentLevel.id}
              </Badge>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {stats.currentLevel.description}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression vers {stats.nextLevel.name}</span>
                <span>{stats.totalXp} / {stats.nextLevel.minXp} XP</span>
              </div>
              <Progress 
                value={(stats.totalXp - stats.currentLevel.minXp) / (stats.nextLevel.minXp - stats.currentLevel.minXp) * 100} 
                className="h-3"
              />
              <div className="text-center text-sm text-muted-foreground">
                {stats.nextLevel.minXp - stats.totalXp} XP restants
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{stats.totalXp}</div>
                <div className="text-xs text-muted-foreground">XP Total</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-accent">{stats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Série Actuelle</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-destructive">{stats.averageScore}%</div>
                <div className="text-xs text-muted-foreground">Score Moyen</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progression par catégorie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progression par Catégorie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.categoriesProgress).map(([category, progress], index) => (
              <motion.div 
                key={category} 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="font-medium">{getCategoryLabel(category)}</span>
                  </div>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2"
                  style={{ 
                    backgroundColor: 'hsl(var(--muted))',
                  }}
                />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques détaillées */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Statistiques Détaillées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold">{stats.completedChallenges}</div>
                <div className="text-sm text-muted-foreground">Défis Complétés</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                <div className="text-lg font-bold">
                  {formatDuration(stats.totalSessionTime)}
                </div>
                <div className="text-sm text-muted-foreground">Temps Total</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-destructive" />
                <div className="text-lg font-bold">{stats.longestStreak}</div>
                <div className="text-sm text-muted-foreground">Plus Longue Série</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Sparkles className="h-6 w-6 mx-auto mb-2 text-secondary" />
                <div className="text-lg font-bold">{stats.achievements.filter(a => a.unlocked).length}</div>
                <div className="text-sm text-muted-foreground">Succès Débloqués</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Avantages du niveau actuel</h4>
              <div className="space-y-2">
                {stats.currentLevel.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-3">Fonctionnalités débloquées</h4>
              <div className="flex flex-wrap gap-2">
                {stats.currentLevel.unlockedFeatures.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProgressStats;