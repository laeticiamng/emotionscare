/**
 * Widget de recommandations IA proactives
 * Affiche les suggestions contextuelles basées sur l'état émotionnel
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  Wind, 
  Music, 
  MessageSquare, 
  BookOpen, 
  Gamepad2, 
  Scan,
  Video,
  Heart,
  ArrowRight,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useMoodUnified, useAIRouter } from '@/hooks/unified';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Recommendation {
  module: string;
  priority: number;
  reason: string;
  confidence: number;
  urgency: 'immediate' | 'suggested' | 'optional';
}

interface AIResponse {
  recommendations: Recommendation[];
  insight: string;
  microAction: string;
  fallback?: boolean;
}

interface ModuleConfigEntry {
  icon: typeof Scan;
  path: string;
  label: string;
  colorClass: string;
}

const MODULE_CONFIG: Record<string, ModuleConfigEntry> = {
  scan: { icon: Scan, path: '/app/scan', label: 'Scanner', colorClass: 'text-purple-500' },
  breath: { icon: Wind, path: '/app/breath', label: 'Respiration', colorClass: 'text-cyan-500' },
  music: { icon: Music, path: '/app/music', label: 'Musique', colorClass: 'text-pink-500' },
  coach: { icon: MessageSquare, path: '/app/coach', label: 'Coach IA', colorClass: 'text-amber-500' },
  journal: { icon: BookOpen, path: '/app/journal', label: 'Journal', colorClass: 'text-emerald-500' },
  gamification: { icon: Gamepad2, path: '/app/gamification', label: 'Défis', colorClass: 'text-orange-500' },
  vr: { icon: Video, path: '/app/vr', label: 'VR', colorClass: 'text-indigo-500' },
  'social-cocon': { icon: Heart, path: '/app/social-cocon', label: 'Social', colorClass: 'text-rose-500' },
};

const AIRecommendationsWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const moodData = useMoodUnified();
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Normaliser valence de -100/+100 vers 0-1
  const normalizedValence = (moodData.valence + 100) / 200;
  const normalizedArousal = moodData.arousal / 100;

  const fetchRecommendations = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('router-ai', {
        body: {
          action: 'context-recommend',
          payload: {
            valence: normalizedValence,
            arousal: normalizedArousal,
          },
        },
      });

      if (fnError) throw fnError;

      if (data?.success) {
        setResponse(data);
      } else {
        throw new Error(data?.error || 'Erreur inconnue');
      }
    } catch (err) {
      console.error('AI Recommendations error:', err);
      // Fallback local si l'API échoue
      setResponse(getLocalFallback(normalizedValence, normalizedArousal));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [isAuthenticated, normalizedValence, normalizedArousal]);

  const handleModuleClick = (module: string) => {
    const config = MODULE_CONFIG[module];
    if (config) {
      navigate(config.path);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Suggestions IA
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={fetchRecommendations}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
          </div>
        ) : response ? (
          <AnimatePresence mode="wait">
            {/* Insight */}
            {response.insight && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-primary/10 border border-primary/20"
              >
                <p className="text-sm text-foreground/80">{response.insight}</p>
              </motion.div>
            )}

            {/* Micro Action */}
            {response.microAction && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 p-2 rounded-md bg-accent/50"
              >
                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-sm font-medium">Action rapide: {response.microAction}</span>
              </motion.div>
            )}

            {/* Recommendations */}
            <div className="space-y-2">
            {response.recommendations?.map((rec, index) => {
                const config = MODULE_CONFIG[rec.module];
                if (!config) return null;
                
                const IconComponent = config.icon;
                
                return (
                  <motion.button
                    key={rec.module}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.1 }}
                    onClick={() => handleModuleClick(rec.module)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg",
                      "bg-card hover:bg-accent/50 border border-border/50",
                      "transition-all duration-200 hover:shadow-md hover:border-primary/30",
                      "text-left group"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg bg-background", config.colorClass)}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{config.label}</span>
                        {rec.urgency === 'immediate' && (
                          <Badge variant="destructive" className="text-xs py-0">
                            Urgent
                          </Badge>
                        )}
                        {rec.urgency === 'suggested' && rec.priority === 1 && (
                          <Badge variant="default" className="text-xs py-0">
                            Recommandé
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {rec.reason}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.button>
                );
              })}
            </div>

            {response.fallback && (
              <p className="text-xs text-muted-foreground text-center">
                Mode hors-ligne • Basé sur votre état actuel
              </p>
            )}
          </AnimatePresence>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="link" onClick={fetchRecommendations} className="mt-2">
              Réessayer
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

function getLocalFallback(valence: number, arousal: number): AIResponse {
  const recommendations: Recommendation[] = [];

  if (valence < 0.3 && arousal > 0.6) {
    recommendations.push(
      { module: 'breath', priority: 1, reason: 'Respiration pour calmer le stress', confidence: 0.85, urgency: 'immediate' },
      { module: 'music', priority: 2, reason: 'Musique apaisante', confidence: 0.75, urgency: 'suggested' },
    );
  } else if (valence < 0.3) {
    recommendations.push(
      { module: 'coach', priority: 1, reason: 'Support émotionnel avec Nyvée', confidence: 0.8, urgency: 'immediate' },
      { module: 'music', priority: 2, reason: 'Musique énergisante', confidence: 0.7, urgency: 'suggested' },
    );
  } else if (valence > 0.6) {
    recommendations.push(
      { module: 'journal', priority: 1, reason: 'Capturer ce moment positif', confidence: 0.8, urgency: 'suggested' },
      { module: 'gamification', priority: 2, reason: 'Continuer sur la lancée', confidence: 0.7, urgency: 'optional' },
    );
  } else {
    recommendations.push(
      { module: 'scan', priority: 1, reason: 'Explorer votre état actuel', confidence: 0.7, urgency: 'suggested' },
      { module: 'breath', priority: 2, reason: 'Micro-session de recentrage', confidence: 0.65, urgency: 'optional' },
    );
  }

  return {
    recommendations: recommendations.slice(0, 3),
    insight: 'Basé sur votre état émotionnel actuel',
    microAction: valence < 0.4 ? '3 respirations profondes' : 'Sourire pendant 10 secondes',
    fallback: true,
  };
}

export default AIRecommendationsWidget;
