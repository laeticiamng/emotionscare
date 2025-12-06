import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function RealtimeComplianceScore() {
  const { data: latestScore } = useQuery({
    queryKey: ['realtime-compliance-score'],
    queryFn: async () => {
      const { data } = await supabase
        .from('compliance_scores')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: recentChanges } = useQuery({
    queryKey: ['recent-score-changes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('compliance_scores')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      return data || [];
    },
    refetchInterval: 10000,
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getImpactIcon = (impact: number) => {
    if (impact > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (impact < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Score de Conformité en Temps Réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Score Actuel</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold ${getScoreColor(latestScore?.score || 0)}`}>
                  {latestScore?.score || 0}
                </span>
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              {latestScore?.impact !== 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {getImpactIcon(latestScore?.impact || 0)}
                  <span className="text-sm font-medium">
                    {latestScore?.impact > 0 ? '+' : ''}{latestScore?.impact} points
                  </span>
                </div>
              )}
            </div>

            {latestScore?.affected_areas && latestScore.affected_areas.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Domaines affectés</p>
                <div className="flex flex-col gap-1">
                  {latestScore.affected_areas.map((area: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Modifications Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentChanges?.map((change) => (
              <div key={change.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getImpactIcon(change.impact)}
                  <div>
                    <p className="text-sm font-medium">{change.event_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(change.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {change.previous_score} → {change.score}
                  </p>
                  <p className={`text-xs ${change.impact > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change.impact > 0 ? '+' : ''}{change.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
