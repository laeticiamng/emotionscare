/**
 * PredictiveInsightsPanel - Insights prédictifs IA
 * Analyse des tendances et recommandations proactives
 */

import { memo, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Calendar,
  ArrowRight,
  Sparkles,
  Clock,
} from 'lucide-react';

interface Prediction {
  id: string;
  type: 'mood' | 'energy' | 'stress' | 'sleep' | 'activity';
  title: string;
  description: string;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation?: string;
}

interface Insight {
  id: string;
  category: 'pattern' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  importance: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestedAction?: string;
}

interface PredictiveInsightsPanelProps {
  className?: string;
}


const TYPE_ICONS: Record<string, React.ReactNode> = {
  mood: <Sparkles className="h-4 w-4 text-purple-500" />,
  energy: <TrendingUp className="h-4 w-4 text-amber-500" />,
  stress: <AlertTriangle className="h-4 w-4 text-red-500" />,
  sleep: <Clock className="h-4 w-4 text-blue-500" />,
  activity: <Target className="h-4 w-4 text-green-500" />,
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pattern: { 
    label: 'Pattern', 
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  anomaly: { 
    label: 'Anomalie', 
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    icon: <Sparkles className="h-4 w-4" />,
  },
  opportunity: { 
    label: 'Opportunité', 
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    icon: <Lightbulb className="h-4 w-4" />,
  },
  risk: { 
    label: 'Risque', 
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
};

export const PredictiveInsightsPanel = memo(function PredictiveInsightsPanel({
  className = '',
}: PredictiveInsightsPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'predictions' | 'insights'>('predictions');

  // Fetch predictions from Supabase
  const {
    data: predictions = [],
    isLoading: predictionsLoading,
    error: predictionsError,
  } = useQuery<Prediction[]>({
    queryKey: ['predictive_insights', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictive_insights')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        type: row.type ?? 'mood',
        title: row.title ?? '',
        description: row.description ?? '',
        confidence: row.confidence ?? 0,
        trend: row.trend ?? 'stable',
        timeframe: row.timeframe ?? '',
        impact: row.impact ?? 'neutral',
        recommendation: row.recommendation,
      }));
    },
    enabled: !!user?.id,
  });

  // Fetch insights from Supabase
  const {
    data: insights = [],
    isLoading: insightsLoading,
    error: insightsError,
  } = useQuery<Insight[]>({
    queryKey: ['ai_insights', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        category: row.category ?? 'pattern',
        title: row.title ?? '',
        description: row.description ?? '',
        importance: row.importance ?? 'medium',
        actionable: row.actionable ?? false,
        suggestedAction: row.suggested_action,
      }));
    },
    enabled: !!user?.id,
  });

  const isLoading = predictionsLoading || insightsLoading;
  const error = predictionsError || insightsError;

  const sortedInsights = useMemo(() =>
    [...insights].sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.importance] - order[b.importance];
    }),
    [insights]
  );

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center" role="alert">
          <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-500">Erreur lors du chargement des insights prédictifs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Insights prédictifs IA
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'predictions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('predictions')}
          >
            <Target className="h-4 w-4 mr-1" />
            Prédictions
          </Button>
          <Button
            variant={activeTab === 'insights' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('insights')}
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            Insights
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            {activeTab === 'predictions' && (
              <div className="space-y-4">
                {predictions.length === 0 ? (
                  <div className="text-center py-6">
                    <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium">Aucune prédiction disponible</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Les prédictions apparaîtront ici une fois vos données analysées.
                    </p>
                  </div>
                ) : predictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {TYPE_ICONS[prediction.type]}
                        <h4 className="font-medium">{prediction.title}</h4>
                      </div>
                      <Badge
                        variant={prediction.impact === 'positive' ? 'default' :
                                 prediction.impact === 'negative' ? 'destructive' : 'secondary'}
                      >
                        {prediction.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                        {prediction.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                        {prediction.timeframe}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {prediction.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Confiance</span>
                      <Progress value={prediction.confidence} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{prediction.confidence}%</span>
                    </div>

                    {prediction.recommendation && (
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-sm flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                          {prediction.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-4">
                {sortedInsights.length === 0 ? (
                  <div className="text-center py-6">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium">Aucun insight disponible</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Les insights apparaîtront ici une fois vos données analysées.
                    </p>
                  </div>
                ) : sortedInsights.map((insight) => {
                  const config = CATEGORY_CONFIG[insight.category];
                  return (
                    <div
                      key={insight.id}
                      className="rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={config.color}>
                            {config.icon}
                            <span className="ml-1">{config.label}</span>
                          </Badge>
                          {insight.importance === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              Important
                            </Badge>
                          )}
                        </div>
                      </div>

                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>

                      {insight.actionable && insight.suggestedAction && (
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          {insight.suggestedAction}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <div className="pt-2 border-t text-center">
          <Button variant="ghost" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            Voir l'historique complet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default PredictiveInsightsPanel;
