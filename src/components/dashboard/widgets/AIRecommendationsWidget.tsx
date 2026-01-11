/**
 * Widget de recommandations IA personnalisées
 * @module dashboard/widgets
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Clock, 
  Flame,
  Heart,
  Brain,
  Zap,
  Music,
  BookOpen
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Recommendation {
  id: string;
  type: 'activity' | 'module' | 'challenge' | 'music';
  title: string;
  description: string;
  duration: number;
  icon: string;
  route: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  heart: Heart,
  brain: Brain,
  zap: Zap,
  music: Music,
  book: BookOpen,
  flame: Flame,
  sparkles: Sparkles,
};

const DEFAULT_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    type: 'module',
    title: 'Flash Glow',
    description: 'Respiration apaisante en 2 minutes',
    duration: 2,
    icon: 'zap',
    route: '/flash-glow',
    priority: 'high',
    reason: 'Parfait pour commencer la journée',
  },
  {
    id: '2',
    type: 'activity',
    title: 'Journal émotionnel',
    description: 'Exprimez vos pensées du moment',
    duration: 5,
    icon: 'book',
    route: '/journal',
    priority: 'medium',
    reason: 'Renforcez votre conscience émotionnelle',
  },
  {
    id: '3',
    type: 'music',
    title: 'Playlist Concentration',
    description: 'Musique adaptative pour le focus',
    duration: 30,
    icon: 'music',
    route: '/music',
    priority: 'low',
    reason: 'Basé sur vos préférences musicales',
  },
];

interface AIRecommendationsWidgetProps {
  className?: string;
  maxItems?: number;
}

const AIRecommendationsWidget: React.FC<AIRecommendationsWidgetProps> = ({
  className,
  maxItems = 3,
}) => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: recommendations = DEFAULT_RECOMMENDATIONS, isLoading, refetch } = useQuery({
    queryKey: ['ai-recommendations', user?.id],
    queryFn: async () => {
      if (!user) return DEFAULT_RECOMMENDATIONS;

      try {
        // Try to get AI recommendations from edge function
        const { data, error } = await supabase.functions.invoke('ai-coach', {
          body: {
            type: 'recommendations',
            userId: user.id,
            context: {
              timeOfDay: new Date().getHours(),
              dayOfWeek: new Date().getDay(),
            }
          }
        });

        if (error) throw error;
        
        if (data?.recommendations && Array.isArray(data.recommendations)) {
          return data.recommendations.slice(0, maxItems);
        }
        
        return DEFAULT_RECOMMENDATIONS;
      } catch (err) {
        console.warn('AI recommendations fallback:', err);
        return DEFAULT_RECOMMENDATIONS;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Recommandations IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Pour vous
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {recommendations.slice(0, maxItems).map((rec: Recommendation, index: number) => {
            const IconComponent = ICON_MAP[rec.icon] || Sparkles;
            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={rec.route}>
                  <div className="group flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                      "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    )}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{rec.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs shrink-0", getPriorityColor(rec.priority))}
                        >
                          {rec.priority === 'high' ? 'Recommandé' : rec.priority === 'medium' ? 'Suggéré' : 'Optionnel'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {rec.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rec.duration} min
                        </span>
                        <span className="italic">"{rec.reason}"</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {!user && (
          <div className="text-center py-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-2">
              Connectez-vous pour des recommandations personnalisées
            </p>
            <Button size="sm" variant="outline" asChild>
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsWidget;
