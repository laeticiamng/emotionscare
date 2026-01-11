/**
 * Widget de recommandations IA pour le dashboard
 * Connecté au backend ai-coach pour générer des recommandations personnalisées
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  RefreshCw, 
  Heart, 
  Brain, 
  Music, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'activity' | 'breathing' | 'music' | 'story' | 'meditation' | 'journal';
  priority: 'high' | 'medium' | 'low';
  route: string;
  icon: React.ReactNode;
  estimatedTime?: number;
  reason?: string;
}

interface RecommendationsWidgetProps {
  className?: string;
  maxItems?: number;
}

const typeIcons = {
  activity: <Heart className="w-4 h-4" />,
  breathing: <Brain className="w-4 h-4" />,
  music: <Music className="w-4 h-4" />,
  story: <BookOpen className="w-4 h-4" />,
  meditation: <Brain className="w-4 h-4" />,
  journal: <BookOpen className="w-4 h-4" />,
};

const priorityColors = {
  high: 'bg-primary/10 text-primary border-primary/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-muted text-muted-foreground border-border',
};

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  className,
  maxItems = 3
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateRecommendations = useCallback(async () => {
    if (!user) {
      // Generate mock recommendations for non-authenticated users
      return [
        {
          id: '1',
          title: 'Respiration 4-7-8',
          description: 'Technique de relaxation pour réduire le stress',
          type: 'breathing' as const,
          priority: 'high' as const,
          route: '/breath',
          icon: typeIcons.breathing,
          estimatedTime: 5,
          reason: 'Recommandé pour bien démarrer'
        },
        {
          id: '2',
          title: 'Musique thérapeutique',
          description: 'Écoutez une composition apaisante',
          type: 'music' as const,
          priority: 'medium' as const,
          route: '/music',
          icon: typeIcons.music,
          estimatedTime: 10,
          reason: 'Pour améliorer votre humeur'
        },
        {
          id: '3',
          title: 'Histoire du soir',
          description: 'Une histoire relaxante pour se détendre',
          type: 'story' as const,
          priority: 'medium' as const,
          route: '/story-synth',
          icon: typeIcons.story,
          estimatedTime: 8,
          reason: 'Parfait pour le soir'
        }
      ];
    }

    try {
      // Try to fetch AI recommendations from edge function
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          action: 'recommendations',
          userId: user.id,
          limit: maxItems
        }
      });

      if (error) throw error;

      if (data?.recommendations) {
        return data.recommendations.map((rec: any, index: number) => ({
          id: rec.id || `rec-${index}`,
          title: rec.title,
          description: rec.description,
          type: rec.type || 'activity',
          priority: rec.priority || 'medium',
          route: rec.route || '/activities',
          icon: typeIcons[rec.type as keyof typeof typeIcons] || typeIcons.activity,
          estimatedTime: rec.estimatedTime,
          reason: rec.reason
        }));
      }
    } catch (error) {
      logger.warn('Failed to fetch AI recommendations, using defaults', error as Error, 'RECOMMENDATIONS');
    }

    // Fallback recommendations
    return [
      {
        id: '1',
        title: 'Flash Glow',
        description: 'Session rapide d\'apaisement en 2 minutes',
        type: 'activity' as const,
        priority: 'high' as const,
        route: '/flash-glow',
        icon: typeIcons.activity,
        estimatedTime: 2,
        reason: 'Basé sur votre niveau de stress'
      },
      {
        id: '2',
        title: 'Mood Mixer',
        description: 'Créez votre ambiance sonore personnalisée',
        type: 'music' as const,
        priority: 'medium' as const,
        route: '/mood-mixer',
        icon: typeIcons.music,
        estimatedTime: 5,
        reason: 'Pour équilibrer vos émotions'
      },
      {
        id: '3',
        title: 'Journal émotionnel',
        description: 'Exprimez vos pensées et sentiments',
        type: 'journal' as const,
        priority: 'medium' as const,
        route: '/journal',
        icon: typeIcons.journal,
        estimatedTime: 10,
        reason: 'Pour mieux vous comprendre'
      }
    ];
  }, [user, maxItems]);

  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const recs = await generateRecommendations();
      setRecommendations(recs);
    } catch (error) {
      logger.error('Failed to load recommendations', error as Error, 'RECOMMENDATIONS');
    } finally {
      setIsLoading(false);
    }
  }, [generateRecommendations]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const recs = await generateRecommendations();
      setRecommendations(recs);
      toast({
        title: '✨ Recommandations actualisées',
        description: 'Nouvelles suggestions basées sur votre état actuel'
      });
    } catch (error) {
      logger.error('Failed to refresh recommendations', error as Error, 'RECOMMENDATIONS');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  if (isLoading) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Recommandations IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: maxItems }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommandations IA
          </CardTitle>
          <CardDescription>Suggestions personnalisées pour vous</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="shrink-0"
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {recommendations.slice(0, maxItems).map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => handleNavigate(rec.route)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border transition-all",
                  "hover:bg-accent/50 hover:border-primary/30",
                  priorityColors[rec.priority]
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0">
                  {rec.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{rec.title}</span>
                    {rec.estimatedTime && (
                      <Badge variant="outline" className="text-xs">
                        {rec.estimatedTime} min
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {rec.description}
                  </p>
                  {rec.reason && (
                    <p className="text-xs text-primary/70 mt-1">
                      💡 {rec.reason}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {recommendations.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucune recommandation pour le moment</p>
            <Button variant="link" onClick={handleRefresh} className="mt-2">
              Générer des suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;
