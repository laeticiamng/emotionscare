/**
 * Widget affichant les recommandations dynamiques personnalisées
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Wind, Music, BookOpen, Brain, MessageCircle, ArrowRight } from 'lucide-react';
import { useDynamicRecommendations, Recommendation } from '@/hooks/useDynamicRecommendations';
import { cn } from '@/lib/utils';

const iconMap = {
  breath: Wind,
  music: Music,
  journal: BookOpen,
  scan: Brain,
  coach: MessageCircle,
} as const;

const accentMap: Record<Recommendation['icon'], string> = {
  breath: 'bg-sky-500/10 text-sky-600',
  music: 'bg-info/10 text-info',
  journal: 'bg-success/10 text-success',
  scan: 'bg-primary/10 text-primary',
  coach: 'bg-accent/10 text-accent',
};

export default function DynamicRecommendationsWidget() {
  const { recommendations, loading, refetch } = useDynamicRecommendations();

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              Recommandé pour vous
            </CardTitle>
            <CardDescription>Basé sur votre activité récente</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-4">
            <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Continuez votre parcours pour recevoir des recommandations
            </p>
          </div>
        ) : (
          <div className="space-y-3" role="list" aria-label="Recommandations personnalisées">
            {recommendations.map((rec) => {
              const IconComponent = iconMap[rec.icon];
              const accentClass = accentMap[rec.icon];

              return (
                <Link
                  key={rec.id}
                  to={rec.to}
                  className="block"
                  aria-describedby={`rec-${rec.id}-reason`}
                >
                  <div
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-lg transition-all',
                      'bg-background/50 hover:bg-background/80 hover:shadow-sm',
                      'border border-transparent hover:border-border/50'
                    )}
                    role="listitem"
                  >
                    <div className={cn('h-10 w-10 rounded-full flex items-center justify-center shrink-0', accentClass)}>
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-medium">{rec.title}</h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {rec.description}
                      </p>
                      <p id={`rec-${rec.id}-reason`} className="text-xs text-primary/70 mt-1 italic">
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Bouton pour rafraîchir les recommandations */}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
            className="text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Actualiser les suggestions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
