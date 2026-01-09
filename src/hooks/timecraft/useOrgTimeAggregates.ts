/**
 * Hook pour les données agrégées organisationnelles (B2B)
 * Données anonymisées uniquement - pas de tracking individuel
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { startOfWeek, format } from 'date-fns';

export interface OrgTimeAggregate {
  id: string;
  org_id: string;
  week_start: string;
  department: string | null;
  aggregated_data: {
    totalEmployees: number;
    avgCreationHours: number;
    avgRecoveryHours: number;
    avgConstraintHours: number;
    avgEmotionalLoad: number;
    avgChosenRatio: number;
    riskZoneCount: number;
    weeklyTrend: number;
  };
  cohort_size: number;
  created_at: string;
}

export interface OrgTimeScenario {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  scenario_type: 'current' | 'projected';
  parameters: Record<string, unknown>;
  projected_impact: {
    recoveryChange: number;
    constraintChange: number;
    emotionalLoadChange: number;
    riskReduction: number;
  } | null;
  created_by: string;
  created_at: string;
}

export interface DepartmentStats {
  department: string;
  employeeCount: number;
  avgRecoveryHours: number;
  avgConstraintHours: number;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'improving' | 'stable' | 'declining';
}

const MINIMUM_COHORT_SIZE = 5; // Anonymisation : minimum 5 personnes par agrégation

export function useOrgTimeAggregates(orgId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch aggregates for organization
  const { data: aggregates = [], isLoading, error } = useQuery({
    queryKey: ['org-time-aggregates', orgId],
    queryFn: async () => {
      if (!orgId) return [];

      const { data, error } = await supabase
        .from('org_time_aggregates')
        .select('*')
        .eq('org_id', orgId)
        .gte('cohort_size', MINIMUM_COHORT_SIZE)
        .order('week_start', { ascending: false })
        .limit(12); // Last 12 weeks

      if (error) throw error;
      return data as OrgTimeAggregate[];
    },
    enabled: !!orgId,
  });

  // Fetch scenarios
  const { data: scenarios = [], isLoading: scenariosLoading } = useQuery({
    queryKey: ['org-time-scenarios', orgId],
    queryFn: async () => {
      if (!orgId) return [];

      const { data, error } = await supabase
        .from('org_time_scenarios')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OrgTimeScenario[];
    },
    enabled: !!orgId,
  });

  // Get current week stats
  const currentWeekStats = aggregates.length > 0 ? aggregates[0] : null;

  // Calculate department breakdown
  const departmentStats: DepartmentStats[] = aggregates
    .filter(a => a.department)
    .reduce((acc, agg) => {
      const existing = acc.find(d => d.department === agg.department);
      if (!existing && agg.aggregated_data) {
        const data = agg.aggregated_data;
        const recoveryConstraintRatio = data.avgRecoveryHours / Math.max(data.avgConstraintHours, 1);
        
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        if (recoveryConstraintRatio < 0.3 || data.avgEmotionalLoad > 0.7) riskLevel = 'high';
        else if (recoveryConstraintRatio < 0.5 || data.avgEmotionalLoad > 0.5) riskLevel = 'medium';

        acc.push({
          department: agg.department!,
          employeeCount: agg.cohort_size,
          avgRecoveryHours: data.avgRecoveryHours,
          avgConstraintHours: data.avgConstraintHours,
          riskLevel,
          trend: data.weeklyTrend > 0 ? 'improving' : data.weeklyTrend < 0 ? 'declining' : 'stable',
        });
      }
      return acc;
    }, [] as DepartmentStats[]);

  // Create scenario
  const createScenarioMutation = useMutation({
    mutationFn: async (input: {
      name: string;
      description?: string;
      scenario_type: 'current' | 'projected';
      parameters: Record<string, unknown>;
    }) => {
      if (!orgId) throw new Error('Organisation non définie');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('org_time_scenarios')
        .insert({
          org_id: orgId,
          created_by: user.id,
          ...input,
        })
        .select()
        .single();

      if (error) throw error;
      return data as OrgTimeScenario;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-time-scenarios'] });
      toast({
        title: 'Scénario créé',
        description: 'Le scénario organisationnel a été enregistré',
      });
    },
  });

  // Calculate projected impact for a scenario
  const simulateScenario = (parameters: {
    recoveryTimeChange: number; // % change
    constraintReduction: number; // % change
  }) => {
    if (!currentWeekStats?.aggregated_data) return null;

    const current = currentWeekStats.aggregated_data;
    const projectedRecovery = current.avgRecoveryHours * (1 + parameters.recoveryTimeChange / 100);
    const projectedConstraint = current.avgConstraintHours * (1 - parameters.constraintReduction / 100);

    // Simple projection model
    const currentRatio = current.avgRecoveryHours / current.avgConstraintHours;
    const projectedRatio = projectedRecovery / projectedConstraint;
    const ratioImprovement = ((projectedRatio - currentRatio) / currentRatio) * 100;

    return {
      projectedRecoveryHours: projectedRecovery,
      projectedConstraintHours: projectedConstraint,
      ratioImprovement,
      estimatedRiskReduction: Math.min(ratioImprovement * 0.5, 50), // Capped at 50%
      estimatedEmotionalLoadChange: -ratioImprovement * 0.3,
    };
  };

  // Generate heatmap data
  const heatmapData = aggregates.map(agg => ({
    weekStart: agg.week_start,
    department: agg.department || 'global',
    intensity: agg.aggregated_data?.avgEmotionalLoad ?? 0,
    riskZones: agg.aggregated_data?.riskZoneCount ?? 0,
  }));

  return {
    aggregates,
    currentWeekStats,
    departmentStats,
    scenarios,
    heatmapData,
    isLoading: isLoading || scenariosLoading,
    error,
    createScenario: createScenarioMutation.mutateAsync,
    simulateScenario,
    hasEnoughData: (currentWeekStats?.cohort_size ?? 0) >= MINIMUM_COHORT_SIZE,
    minimumCohortSize: MINIMUM_COHORT_SIZE,
  };
}
