/**
 * useClinicalAssessments - Hook for managing clinical assessments
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ClinicalAssessmentRecord {
  id: string;
  user_id: string;
  type: 'WHO5' | 'PHQ9' | 'GAD7' | 'STAI6';
  answers: Record<string, number>;
  score: number;
  max_score: number;
  category: string | null;
  created_at: string;
}

interface CreateAssessmentInput {
  type: 'WHO5' | 'PHQ9';
  answers: Record<string, number>;
  score: number;
  maxScore: number;
  category: string;
}

export const useClinicalAssessments = (type?: 'WHO5' | 'PHQ9') => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch assessments history
  const historyQuery = useQuery({
    queryKey: ['clinical-assessments', user?.id, type],
    queryFn: async (): Promise<ClinicalAssessmentRecord[]> => {
      if (!user) return [];

      let query = supabase
        .from('clinical_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error fetching clinical assessments:', error);
        throw error;
      }

      return (data || []) as ClinicalAssessmentRecord[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  // Create new assessment
  const createMutation = useMutation({
    mutationFn: async (input: CreateAssessmentInput) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('clinical_assessments')
        .insert({
          user_id: user.id,
          type: input.type,
          answers: input.answers,
          score: input.score,
          max_score: input.maxScore,
          category: input.category,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating clinical assessment:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinical-assessments', user?.id] });
      toast.success('Évaluation enregistrée');
    },
    onError: (error) => {
      console.error('Error saving assessment:', error);
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  // Get statistics
  const getStats = () => {
    const assessments = historyQuery.data || [];
    
    const who5Assessments = assessments.filter(a => a.type === 'WHO5');
    const phq9Assessments = assessments.filter(a => a.type === 'PHQ9');

    const lastWHO5 = who5Assessments[0];
    const lastPHQ9 = phq9Assessments[0];

    // Calculate trends
    const who5Trend = who5Assessments.length >= 2
      ? (who5Assessments[0].score * 4) - (who5Assessments[1].score * 4)
      : null;

    const phq9Trend = phq9Assessments.length >= 2
      ? phq9Assessments[0].score - phq9Assessments[1].score
      : null;

    return {
      totalAssessments: assessments.length,
      who5Count: who5Assessments.length,
      phq9Count: phq9Assessments.length,
      lastWHO5,
      lastPHQ9,
      who5Trend,
      phq9Trend,
    };
  };

  return {
    assessments: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    createAssessment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    stats: getStats(),
    refetch: historyQuery.refetch,
  };
};

export default useClinicalAssessments;
