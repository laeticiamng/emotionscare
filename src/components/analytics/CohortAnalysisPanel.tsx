// @ts-nocheck
/**
 * CohortAnalysisPanel - Analyse de cohortes
 * Segmentation et comparaison de groupes d'utilisateurs
 */

import { memo, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
  Filter,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface CohortData {
  period: string;
  initialUsers: number;
  retentionRates: number[];
}

interface CohortMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface CohortAnalysisPanelProps {
  className?: string;
}

const WEEK_LABELS = ['Sem 0', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'];

const getRetentionColor = (rate: number): string => {
  if (rate === 0) return 'bg-muted text-muted-foreground';
  if (rate >= 70) return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
  if (rate >= 50) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
  if (rate >= 30) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
  return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
};

export const CohortAnalysisPanel = memo(function CohortAnalysisPanel({
  className = '',
}: CohortAnalysisPanelProps) {
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState('retention');
  const [selectedPeriod, setSelectedPeriod] = useState('6m');

  // Fetch cohort data from Supabase
  const {
    data: cohorts = [],
    isLoading: cohortsLoading,
    error: cohortsError,
  } = useQuery<CohortData[]>({
    queryKey: ['cohort_analysis', user?.id, selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cohort_analysis')
        .select('*')
        .order('period', { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        period: row.period ?? '',
        initialUsers: row.initial_users ?? 0,
        retentionRates: row.retention_rates ?? [100, 0, 0, 0, 0, 0],
      }));
    },
    enabled: !!user?.id,
  });

  // Fetch cohort metrics from Supabase
  const {
    data: metrics = [],
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery<CohortMetric[]>({
    queryKey: ['cohort_metrics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cohort_metrics')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        name: row.name ?? '',
        value: row.value ?? 0,
        change: row.change ?? 0,
        trend: row.trend ?? 'stable',
      }));
    },
    enabled: !!user?.id,
  });

  const isLoading = cohortsLoading || metricsLoading;
  const error = cohortsError || metricsError;

  const averageRetention = useMemo(() => {
    const week4Rates = cohorts
      .map((c) => c.retentionRates[4])
      .filter((r) => r > 0);
    if (week4Rates.length === 0) return 0;
    return Math.round(week4Rates.reduce((a, b) => a + b, 0) / week4Rates.length);
  }, [cohorts]);

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center" role="alert">
          <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-500">Erreur lors du chargement de l'analyse de cohortes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Analyse de cohortes
          </CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retention">Rétention</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="revenue">Revenu</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="12m">12 mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Métriques clés */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
        <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((metric) => (
            <div key={metric.name} className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">{metric.name}</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-xl font-bold">{metric.value}%</span>
                <span className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-600' :
                  metric.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tableau de rétention */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium">Cohorte</th>
                <th className="text-right py-2 px-3 font-medium">Users</th>
                {WEEK_LABELS.map((week) => (
                  <th key={week} className="text-center py-2 px-3 font-medium">
                    {week}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort) => (
                <tr key={cohort.period} className="border-b last:border-0">
                  <td className="py-2 px-3 font-medium">{cohort.period}</td>
                  <td className="py-2 px-3 text-right text-muted-foreground">
                    {cohort.initialUsers.toLocaleString()}
                  </td>
                  {cohort.retentionRates.map((rate, idx) => (
                    <td key={idx} className="py-2 px-1 text-center">
                      <span className={`inline-block min-w-[3rem] px-2 py-1 rounded text-xs font-medium ${getRetentionColor(rate)}`}>
                        {rate > 0 ? `${rate}%` : '-'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Légende */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-200 dark:bg-green-900" />
              &gt;70%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-900" />
              50-70%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-200 dark:bg-amber-900" />
              30-50%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-200 dark:bg-red-900" />
              &lt;30%
            </span>
          </div>
          <Badge variant="outline">
            <TrendingUp className="h-3 w-3 mr-1" />
            Rétention moyenne S4 : {averageRetention}%
          </Badge>
        </div>

        {cohorts.length === 0 && (
          <div className="text-center py-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">Aucune donnée de cohorte</p>
            <p className="text-sm text-muted-foreground mt-1">
              Les données de cohorte apparaîtront ici une fois disponibles.
            </p>
          </div>
        )}
        </>
        )}
      </CardContent>
    </Card>
  );
});

export default CohortAnalysisPanel;
