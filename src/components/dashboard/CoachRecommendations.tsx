/**
 * Composant CoachRecommendations enrichi avec connexion backend
 * Génère des recommandations personnalisées via l'API ai-coach
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Loader2, 
  Sparkles, 
  Brain, 
  Heart, 
  Music, 
  BookOpen,
  Wind,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'breathing' | 'journal' | 'meditation' | 'music' | 'activity' | 'story';
  priority: 'high' | 'medium' | 'low';
  link: string;
  estimatedTime?: number;
  reason?: string;
}

const typeConfig = {
  breathing: { icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  journal: { icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  meditation: { icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  music: { icon: Music, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  activity: { icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
  story: { icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

const priorityBadges = {
  high: { variant: 'default' as const, label: 'Recommandé' },
  medium: { variant: 'secondary' as const, label: 'Suggéré' },
  low: { variant: 'outline' as const, label: 'Optionnel' },
};

const CoachRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      if (user) {
        // Try to fetch from AI coach
        const { data, error } = await supabase.functions.invoke('ai-coach', {
          body: {
            action: 'recommendations',
            userId: user.id,
            limit: 4
          }
        });

        if (!error && data?.recommendations) {
          const mappedRecs = data.recommendations.map((rec: any, index: number) => ({
            id: rec.id || `rec-${index}`,
            title: rec.title,
            description: rec.description,
            type: rec.type || 'activity',
            priority: rec.priority || 'medium',
            link: rec.route || rec.link || '/activities',
            estimatedTime: rec.estimatedTime,
            reason: rec.reason
          }));
          setRecommendations(mappedRecs);
          setLoading(false);
          return;
        }
      }

      // Fallback to smart default recommendations
      const defaultRecs: Recommendation[] = [
        {
          id: "rec1",
          title: "Respiration 4-7-8",
          description: "Une technique puissante pour calmer le système nerveux en quelques minutes",
          type: "breathing",
          priority: "high",
          link: "/breath",
          estimatedTime: 4,
          reason: "Idéal pour commencer la journée"
        },
        {
          id: "rec2",
          title: "Journal de gratitude",
          description: "Notez trois choses positives pour améliorer votre bien-être",
          type: "journal",
          priority: "medium",
          link: "/journal",
          estimatedTime: 5,
          reason: "Renforce les émotions positives"
        },
        {
          id: "rec3",
          title: "Méditation guidée",
          description: "10 minutes pour développer votre présence attentive",
          type: "meditation",
          priority: "medium",
          link: "/meditation",
          estimatedTime: 10,
          reason: "Améliore la concentration"
        },
        {
          id: "rec4",
          title: "Musique thérapeutique",
          description: "Écoutez une composition générée pour votre état émotionnel",
          type: "music",
          priority: "low",
          link: "/music",
          estimatedTime: 15,
          reason: "Harmonise vos émotions"
        }
      ];
      
      setRecommendations(defaultRecs);
    } catch (error) {
      logger.error("Failed to fetch recommendations", error as Error, 'COACH');
      toast({
        title: "Erreur",
        description: "Impossible de charger les recommandations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const generateRecommendation = async () => {
    setGenerating(true);
    try {
      if (user) {
        const { data, error } = await supabase.functions.invoke('ai-coach', {
          body: {
            action: 'generate-recommendation',
            userId: user.id,
            context: {
              timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
              existingRecommendations: recommendations.map(r => r.type)
            }
          }
        });

        if (!error && data?.recommendation) {
          const newRec: Recommendation = {
            id: `rec-${Date.now()}`,
            title: data.recommendation.title,
            description: data.recommendation.description,
            type: data.recommendation.type || 'activity',
            priority: 'high',
            link: data.recommendation.route || '/activities',
            estimatedTime: data.recommendation.estimatedTime,
            reason: 'Généré par l\'IA pour vous'
          };
          
          setRecommendations(prev => [newRec, ...prev.slice(0, 3)]);
          toast({
            title: "✨ Nouvelle recommandation",
            description: "Une suggestion personnalisée a été créée pour vous",
          });
          return;
        }
      }

      // Fallback: generate a contextual recommendation
      const hour = new Date().getHours();
      let newRec: Recommendation;

      if (hour < 10) {
        newRec = {
          id: `rec-${Date.now()}`,
          title: "Éveil énergétique",
          description: "Commencez la journée avec une routine de respiration dynamique",
          type: "breathing",
          priority: "high",
          link: "/breath",
          estimatedTime: 5,
          reason: "Parfait pour le matin"
        };
      } else if (hour < 14) {
        newRec = {
          id: `rec-${Date.now()}`,
          title: "Pause concentration",
          description: "Une mini-méditation pour recentrer votre attention",
          type: "meditation",
          priority: "high",
          link: "/meditation",
          estimatedTime: 5,
          reason: "Boost de mi-journée"
        };
      } else if (hour < 18) {
        newRec = {
          id: `rec-${Date.now()}`,
          title: "Relaxation active",
          description: "Libérez les tensions accumulées avec une session guidée",
          type: "activity",
          priority: "high",
          link: "/flash-glow",
          estimatedTime: 3,
          reason: "Détente de l'après-midi"
        };
      } else {
        newRec = {
          id: `rec-${Date.now()}`,
          title: "Histoire du soir",
          description: "Une narration apaisante pour préparer le sommeil",
          type: "story",
          priority: "high",
          link: "/story-synth",
          estimatedTime: 10,
          reason: "Idéal avant le coucher"
        };
      }

      setRecommendations(prev => [newRec, ...prev.slice(0, 3)]);
      toast({
        title: "✨ Nouvelle recommandation",
        description: "Une suggestion personnalisée a été ajoutée",
      });
    } catch (error) {
      logger.error("Failed to generate recommendation", error as Error, 'COACH');
      toast({
        title: "Erreur",
        description: "Impossible de générer une recommandation",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleNavigate = (link: string) => {
    navigate(link);
  };

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              Coach IA
            </CardTitle>
            <CardDescription>Suggestions personnalisées</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={fetchRecommendations}
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-3">
        <Button 
          onClick={generateRecommendation} 
          disabled={generating || loading}
          className="w-full gap-2"
          size="sm"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Nouvelle suggestion IA
            </>
          )}
        </Button>
        
        <div className="flex-1 space-y-2">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg border border-border">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {recommendations.map((rec, index) => {
                const config = typeConfig[rec.type] || typeConfig.activity;
                const IconComponent = config.icon;
                
                return (
                  <motion.button
                    key={rec.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigate(rec.link)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg border text-left",
                      "transition-all hover:bg-accent hover:border-primary/30",
                      "border-border bg-card"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      config.bg
                    )}>
                      <IconComponent className={cn("w-5 h-5", config.color)} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-foreground">
                          {rec.title}
                        </span>
                        {rec.priority === 'high' && (
                          <Badge variant="default" className="text-xs">
                            Recommandé
                          </Badge>
                        )}
                        {rec.estimatedTime && (
                          <Badge variant="outline" className="text-xs">
                            {rec.estimatedTime} min
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {rec.description}
                      </p>
                      {rec.reason && (
                        <p className="text-xs text-primary/70 mt-1">
                          💡 {rec.reason}
                        </p>
                      )}
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          )}
          
          {!loading && recommendations.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Brain className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune recommandation</p>
              <Button 
                variant="link" 
                onClick={generateRecommendation}
                className="mt-2"
              >
                Générer des suggestions
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachRecommendations;
