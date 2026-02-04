/**
 * GroundingProgressDashboard - Dashboard de suivi des progrès d'ancrage
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingDown, 
  Trophy, 
  Flame, 
  Target,
  Star,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useGroundingProgress, DEFAULT_GROUNDING_TECHNIQUES } from '../index';
import { cn } from '@/lib/utils';

interface GroundingProgressDashboardProps {
  className?: string;
}

export const GroundingProgressDashboard = memo<GroundingProgressDashboardProps>(({
  className,
}) => {
  const { progress, loading } = useGroundingProgress();

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="py-12 text-center">
          <div className="h-6 w-32 bg-muted rounded mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const totalTechniques = DEFAULT_GROUNDING_TECHNIQUES.length;
  const masteredPercent = progress 
    ? Math.round((progress.techniques_mastered.length / totalTechniques) * 100)
    : 0;

  const favoriteTechnique = progress?.favorite_technique
    ? DEFAULT_GROUNDING_TECHNIQUES.find(t => t.id === progress.favorite_technique)
    : null;

  const stats = [
    {
      icon: <Target className="h-5 w-5" />,
      label: 'Sessions complétées',
      value: progress?.total_sessions || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: <TrendingDown className="h-5 w-5" />,
      label: 'Réduction anxiété moy.',
      value: progress?.avg_anxiety_reduction || 0,
      suffix: ' pts',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: <Flame className="h-5 w-5" />,
      label: 'Série en cours',
      value: progress?.streak_days || 0,
      suffix: ' jours',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: 'Techniques maîtrisées',
      value: progress?.techniques_mastered.length || 0,
      suffix: `/${totalTechniques}`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="pt-4 pb-3 text-center">
                <div className={cn(
                  "w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2",
                  stat.bgColor, stat.color
                )}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">
                  {stat.value}{stat.suffix}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Technique favorite */}
      {favoriteTechnique && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              Votre technique préférée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{favoriteTechnique.name}</p>
                <p className="text-sm text-muted-foreground">
                  {favoriteTechnique.description}
                </p>
              </div>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                {favoriteTechnique.duration_minutes} min
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progression de maîtrise */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Maîtrise des techniques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>{progress?.techniques_mastered.length || 0} sur {totalTechniques} techniques</span>
            <span className="font-medium">{masteredPercent}%</span>
          </div>
          <Progress value={masteredPercent} className="h-2" />
          
          <div className="flex flex-wrap gap-2 mt-4">
            {DEFAULT_GROUNDING_TECHNIQUES.map(technique => {
              const isMastered = progress?.techniques_mastered.includes(technique.id);
              return (
                <Badge 
                  key={technique.id}
                  variant={isMastered ? "default" : "outline"}
                  className={cn(
                    "text-xs",
                    isMastered && "bg-green-500 hover:bg-green-600"
                  )}
                >
                  {isMastered && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {technique.name}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Message de motivation */}
      {!progress?.total_sessions && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">
              Commencez votre première session d'ancrage pour suivre vos progrès !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

GroundingProgressDashboard.displayName = 'GroundingProgressDashboard';

export default GroundingProgressDashboard;
