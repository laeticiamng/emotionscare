/**
 * Widget de recommandations personnalisées pour la méditation
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Wind, 
  Heart, 
  Eye,
  Volume2,
  Zap,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useMeditationStats } from '@/hooks/useMeditationStats';

interface Recommendation {
  id: string;
  type: 'technique' | 'duration' | 'time' | 'streak';
  title: string;
  description: string;
  technique?: string;
  duration?: number;
  icon: React.ReactNode;
  priority: number;
}

interface MeditationRecommendationWidgetProps {
  onSelectTechnique?: (technique: string, duration: number) => void;
  currentTechnique?: string | null;
}

const TECHNIQUE_ICONS: Record<string, React.ReactNode> = {
  'mindfulness': <Brain className="h-4 w-4" />,
  'breath-focus': <Wind className="h-4 w-4" />,
  'body-scan': <Heart className="h-4 w-4" />,
  'visualization': <Eye className="h-4 w-4" />,
  'loving-kindness': <Heart className="h-4 w-4" />,
  'mantra': <Volume2 className="h-4 w-4" />,
};

const TECHNIQUE_LABELS: Record<string, string> = {
  'mindfulness': 'Pleine conscience',
  'breath-focus': 'Focus respiration',
  'body-scan': 'Scan corporel',
  'visualization': 'Visualisation',
  'loving-kindness': 'Bienveillance',
  'mantra': 'Mantra',
};

const ALL_TECHNIQUES = ['mindfulness', 'breath-focus', 'body-scan', 'visualization', 'loving-kindness', 'mantra'];

export const MeditationRecommendationWidget: React.FC<MeditationRecommendationWidgetProps> = ({
  onSelectTechnique,
  currentTechnique,
}) => {
  const { data: stats, isLoading } = useMeditationStats();

  const recommendations = useMemo<Recommendation[]>(() => {
    const recs: Recommendation[] = [];
    const hour = new Date().getHours();

    // Nouvel utilisateur
    if (!stats || stats.completed_sessions === 0) {
      recs.push({
        id: 'first-session',
        type: 'technique',
        title: 'Première session recommandée',
        description: 'Commencez par une courte session de pleine conscience',
        technique: 'mindfulness',
        duration: 5,
        icon: <Sparkles className="h-4 w-4 text-primary" />,
        priority: 100,
      });
      return recs;
    }

    // Recommandation basée sur l'heure
    if (hour >= 6 && hour < 10) {
      recs.push({
        id: 'morning',
        type: 'time',
        title: 'Méditation matinale',
        description: 'Parfait pour commencer la journée',
        technique: 'breath-focus',
        duration: 10,
        icon: <Clock className="h-4 w-4 text-amber-500" />,
        priority: 80,
      });
    } else if (hour >= 12 && hour < 14) {
      recs.push({
        id: 'midday',
        type: 'time',
        title: 'Pause méditative',
        description: 'Rechargez vos batteries à mi-journée',
        technique: 'body-scan',
        duration: 10,
        icon: <Zap className="h-4 w-4 text-yellow-500" />,
        priority: 70,
      });
    } else if (hour >= 20 || hour < 6) {
      recs.push({
        id: 'evening',
        type: 'time',
        title: 'Relaxation du soir',
        description: 'Préparez-vous à un sommeil réparateur',
        technique: 'visualization',
        duration: 15,
        icon: <Brain className="h-4 w-4 text-purple-500" />,
        priority: 75,
      });
    }

    // Maintenir le streak
    if (stats.current_streak > 0 && stats.current_streak < stats.longest_streak) {
      recs.push({
        id: 'keep-streak',
        type: 'streak',
        title: 'Maintenez votre série !',
        description: `${stats.current_streak} jour(s) consécutifs - continuez !`,
        technique: stats.favorite_technique || 'mindfulness',
        duration: 5,
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
        priority: 90,
      });
    }

    // Explorer nouvelles techniques
    const triedTechniques = new Set([stats.favorite_technique].filter(Boolean));
    const newTechnique = ALL_TECHNIQUES.find(t => !triedTechniques.has(t) && t !== currentTechnique);
    if (newTechnique) {
      recs.push({
        id: 'explore',
        type: 'technique',
        title: 'Explorez une nouvelle technique',
        description: `Essayez ${TECHNIQUE_LABELS[newTechnique]}`,
        technique: newTechnique,
        duration: 10,
        icon: TECHNIQUE_ICONS[newTechnique] || <Sparkles className="h-4 w-4" />,
        priority: 60,
      });
    }

    // Progresser en durée
    const avgDuration = stats.average_duration_minutes || 10;
    if (avgDuration < 20) {
      recs.push({
        id: 'longer',
        type: 'duration',
        title: 'Allongez vos sessions',
        description: `Essayez ${Math.min(avgDuration + 5, 30)} minutes`,
        technique: stats.favorite_technique || 'mindfulness',
        duration: Math.min(avgDuration + 5, 30),
        icon: <Clock className="h-4 w-4 text-blue-500" />,
        priority: 50,
      });
    }

    return recs.sort((a, b) => b.priority - a.priority).slice(0, 3);
  }, [stats, currentTechnique]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4 h-20" />
      </Card>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">Recommandations</h3>
        </div>

        <div className="space-y-2">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
              onClick={() => rec.technique && rec.duration && onSelectTechnique?.(rec.technique, rec.duration)}
            >
              <div className="flex-shrink-0 p-2 rounded-full bg-muted">
                {rec.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{rec.title}</p>
                <p className="text-xs text-muted-foreground truncate">{rec.description}</p>
              </div>
              {rec.duration && (
                <Badge variant="secondary" className="flex-shrink-0">
                  {rec.duration} min
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationRecommendationWidget;
