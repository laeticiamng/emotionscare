import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, CheckCircle2, Info, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Recommendation } from '@/hooks/useGDPRComplianceScore';

interface GDPRRecommendationsProps {
  recommendations: Recommendation[];
  isLoading: boolean;
}

const GDPRRecommendations: React.FC<GDPRRecommendationsProps> = ({ recommendations, isLoading }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'low':
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityVariant = (priority: string): 'default' | 'destructive' | 'secondary' => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'Priorité haute';
      case 'medium':
        return 'Priorité moyenne';
      case 'low':
        return 'Information';
      default:
        return 'Information';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Recommandations d'amélioration</CardTitle>
            <CardDescription>
              Actions recommandées pour optimiser votre conformité RGPD
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
            <p className="text-lg font-medium text-foreground">
              Excellente conformité !
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Aucune recommandation d'amélioration pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={cn(
                  'p-4 border rounded-lg space-y-3 transition-colors',
                  rec.priority === 'high'
                    ? 'border-destructive/50 bg-destructive/5'
                    : rec.priority === 'medium'
                    ? 'border-yellow-500/50 bg-yellow-500/5'
                    : 'border-border bg-background'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getPriorityIcon(rec.priority)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-foreground">{rec.title}</h4>
                        <Badge variant={getPriorityVariant(rec.priority)} className="text-xs">
                          {getPriorityLabel(rec.priority)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                  {rec.impact > 0 && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">Impact</span>
                      <span className="text-sm font-semibold text-foreground">
                        +{rec.impact}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {rec.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GDPRRecommendations;
