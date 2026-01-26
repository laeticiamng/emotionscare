/**
 * VR Recommendation Widget - Recommandations personnalisées
 */

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Star, Wind, ChevronRight } from 'lucide-react';
import { useVRStats } from '@/hooks/useVRStats';
import { useVRSettings } from '@/hooks/useVRSettings';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export function VRRecommendationWidget() {
  const { data: stats } = useVRStats();
  useVRSettings();

  const recommendations = useMemo<Recommendation[]>(() => {
    const recs: Recommendation[] = [];
    
    // Si pas de sessions, encourager à commencer
    if (!stats || stats.total_sessions === 0) {
      recs.push({
        id: 'first-session',
        title: 'Commencez votre voyage',
        description: 'Découvrez la méditation immersive avec VR Galaxy',
        route: '/app/vr-galaxy',
        icon: <Star className="h-5 w-5 text-primary" />,
        reason: 'Première expérience recommandée',
        priority: 'high',
      });
      return recs;
    }

    // Si streak cassé, encourager à reprendre
    if (stats.current_streak_days === 0 && stats.total_sessions > 0) {
      recs.push({
        id: 'restart-streak',
        title: 'Reprenez votre streak',
        description: 'Une session rapide pour maintenir votre pratique',
        route: '/app/vr-breath-guide',
        icon: <Wind className="h-5 w-5 text-info" />,
        reason: 'Reprendre une pratique régulière',
        priority: 'high',
      });
    }

    // Recommandation basée sur la scène préférée
    if (stats.favorite_scene === 'galaxy' || !stats.favorite_scene) {
      recs.push({
        id: 'try-breath',
        title: 'Essayez VR Breath',
        description: 'Respiration guidée pour la cohérence cardiaque',
        route: '/app/vr-breath-guide',
        icon: <Wind className="h-5 w-5 text-info" />,
        reason: 'Diversifiez votre pratique',
        priority: 'medium',
      });
    } else {
      recs.push({
        id: 'try-galaxy',
        title: 'Explorez VR Galaxy',
        description: 'Cathédrale cosmique sous les étoiles',
        route: '/app/vr-galaxy',
        icon: <Star className="h-5 w-5 text-primary" />,
        reason: 'Diversifiez votre pratique',
        priority: 'medium',
      });
    }

    // Si cohérence faible, suggérer plus de pratique
    if (stats.average_coherence < 60 && stats.total_sessions >= 3) {
      recs.push({
        id: 'improve-coherence',
        title: 'Améliorez votre cohérence',
        description: 'Session de 10 min pour progresser',
        route: '/app/vr-breath-guide',
        icon: <Sparkles className="h-5 w-5 text-success" />,
        reason: `Cohérence actuelle: ${stats.average_coherence}%`,
        priority: 'medium',
      });
    }

    return recs.slice(0, 2); // Max 2 recommandations
  }, [stats]);

  if (recommendations.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-info/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Recommandations pour vous</span>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <Link key={rec.id} to={rec.route}>
              <div className="group flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <div className="p-2 rounded-lg bg-background">
                  {rec.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {rec.description}
                  </p>
                </div>
                <Badge 
                  variant={rec.priority === 'high' ? 'default' : 'secondary'} 
                  className="text-xs shrink-0"
                >
                  {rec.priority === 'high' ? 'Suggéré' : 'Nouveau'}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default VRRecommendationWidget;
