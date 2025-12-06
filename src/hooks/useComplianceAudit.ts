// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ComplianceAudit {
  id: string;
  audit_date: string;
  overall_score: number;
  status: string;
  audit_type: string;
  completed_at: string;
  report_url: string;
}

export interface ComplianceCategory {
  id: string;
  category_name: string;
  category_code: string;
  score: number;
  max_score: number;
  checks_passed: number;
  checks_total: number;
  findings: any[];
}

export interface ComplianceRecommendation {
  id: string;
  category_name: string;
  severity: string;
  priority: number;
  title: string;
  description: string;
  impact: string;
  remediation: string;
  status: string;
  created_at: string;
}

export const useComplianceAudit = () => {
  const queryClient = useQueryClient();

  // Récupérer le dernier audit
  const { data: latestAudit, isLoading: auditLoading } = useQuery({
    queryKey: ['compliance-audit-latest'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('compliance-audit/latest');
      
      if (error) throw error;
      return data as {
        audit: ComplianceAudit;
        categories: ComplianceCategory[];
        recommendations: ComplianceRecommendation[];
      };
    },
    refetchInterval: 60000,
  });

  // Récupérer l'historique
  const { data: auditHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['compliance-audit-history'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('compliance-audit/history');
      
      if (error) throw error;
      return data.audits as ComplianceAudit[];
    },
  });

  // Lancer un audit
  const runAuditMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('compliance-audit/run');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['compliance-audit-latest'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-audit-history'] });
      toast.success(`Audit terminé avec un score de ${data.overall_score.toFixed(1)}/100`);
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de l'audit: ${error.message}`);
    },
  });

  // Mettre à jour une recommandation
  const updateRecommendationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data: { user } } = await supabase.auth.getUser();

      const updateData: any = { status };
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = user?.id;
      }

      const { data, error } = await supabase
        .from('compliance_recommendations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-audit-latest'] });
      toast.success('Recommandation mise à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  return {
    latestAudit,
    auditHistory,
    isLoading: auditLoading || historyLoading,
    runAudit: runAuditMutation.mutateAsync,
    updateRecommendation: updateRecommendationMutation.mutateAsync,
    isRunning: runAuditMutation.isPending,
  };
};
