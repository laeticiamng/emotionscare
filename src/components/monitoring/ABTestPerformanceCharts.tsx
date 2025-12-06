import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ABTestPerformanceChartsProps {
  testData: any[];
  metricsData: any[];
}

export const ABTestPerformanceCharts: React.FC<ABTestPerformanceChartsProps> = ({ testData, metricsData }) => {
  // Transform metrics data for time series
  const performanceTrend = metricsData?.map(m => ({
    date: new Date(m.metric_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    accuracy: Math.round(m.escalation_accuracy || 0),
    resolutionTime: Math.round(m.avg_resolution_time_minutes || 0),
    escalations: m.total_escalations || 0
  })).reverse() || [];

  // Calculate A/B test comparison data
  const abTestComparison = testData
    ?.filter(t => t.metadata?.control_metrics && t.metadata?.variant_metrics)
    .map(t => ({
      name: t.name.length > 20 ? t.name.substring(0, 20) + '...' : t.name,
      control: Math.round((t.metadata.control_metrics.resolution_rate || 0) * 100),
      variant: Math.round((t.metadata.variant_metrics.resolution_rate || 0) * 100),
      improvement: Math.round(
        ((t.metadata.variant_metrics.resolution_rate - t.metadata.control_metrics.resolution_rate) / 
        (t.metadata.control_metrics.resolution_rate || 1)) * 100
      ),
      status: t.status
    }))
    .slice(0, 5) || [];

  // Calculate trend predictions (simple linear regression)
  const predictedTrend: Array<{
    date: string;
    accuracy: number;
    resolutionTime: number;
    escalations: number;
    predicted?: boolean;
  }> = performanceTrend.length > 0 ? [...performanceTrend] : [];
  
  if (predictedTrend.length >= 3) {
    const lastThree = predictedTrend.slice(-3);
    const avgChange = lastThree.reduce((sum, point, idx, arr) => {
      if (idx === 0) return 0;
      return sum + (point.accuracy - arr[idx - 1].accuracy);
    }, 0) / (lastThree.length - 1);

    // Add 3 predicted points
    for (let i = 1; i <= 3; i++) {
      const lastPoint = predictedTrend[predictedTrend.length - 1];
      predictedTrend.push({
        date: `Prév +${i}j`,
        accuracy: Math.max(0, Math.min(100, Math.round(lastPoint.accuracy + avgChange * i))),
        resolutionTime: lastPoint.resolutionTime,
        escalations: lastPoint.escalations,
        predicted: true
      });
    }
  }

  // Calculate ML confidence distribution
  const confidenceDistribution = testData
    ?.filter(t => t.metadata?.confidence)
    .reduce((acc, t) => {
      const confidence = Math.round((t.metadata.confidence || 0) * 100);
      const bucket = Math.floor(confidence / 10) * 10;
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

  const confidenceData = Object.entries(confidenceDistribution || {}).map(([bucket, count]) => ({
    range: `${bucket}-${parseInt(bucket) + 9}%`,
    count: count as number
  }));

  const overallTrend = performanceTrend.length >= 2
    ? performanceTrend[performanceTrend.length - 1].accuracy - performanceTrend[0].accuracy
    : 0;

  return (
    <div className="space-y-6">
      {/* Performance Trend Line Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Évolution des Performances
              </CardTitle>
              <CardDescription>
                Précision des escalades avec prédictions ML (pointillés)
              </CardDescription>
            </div>
            <Badge variant={overallTrend > 0 ? 'default' : 'destructive'} className="gap-1">
              {overallTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {overallTrend > 0 ? '+' : ''}{overallTrend}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={predictedTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Précision (%)"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* A/B Test Comparison Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Comparaison Tests A/B: Contrôle vs Variant
          </CardTitle>
          <CardDescription>
            Taux de résolution (%) - Les variants en vert ont de meilleures performances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={abTestComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Bar 
                dataKey="control" 
                fill="hsl(var(--muted))" 
                name="Contrôle"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="variant" 
                fill="hsl(var(--primary))" 
                name="Variant"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Improvement indicators */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {abTestComparison.slice(0, 3).map((test, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium truncate flex-1">{test.name}</span>
                <Badge variant={test.improvement > 0 ? 'default' : 'destructive'} className="gap-1">
                  {test.improvement > 0 ? '+' : ''}{test.improvement}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resolution Time vs Escalations Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Temps de Résolution vs Nombre d'Escalades</CardTitle>
          <CardDescription>
            Corrélation entre le volume d'escalades et le temps moyen de résolution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="resolutionTime" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary) / 0.2)"
                name="Temps (min)"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="escalations" 
                stroke="hsl(var(--destructive))" 
                fill="hsl(var(--destructive) / 0.2)"
                name="Escalades"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ML Confidence Distribution */}
      {confidenceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Niveaux de Confiance ML</CardTitle>
            <CardDescription>
              Répartition de la confiance des prédictions machine learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="range" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--chart-1))"
                  name="Nombre de tests"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
