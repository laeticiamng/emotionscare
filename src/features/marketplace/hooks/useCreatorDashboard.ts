/**
 * Hook pour le dashboard créateur
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '../services/marketplaceApi';
import type { Program, CreatorStats } from '../types';
import { toast } from 'sonner';

export function useCreatorDashboard() {
  const queryClient = useQueryClient();

  // Fetch creator profile
  const { data: creator, isLoading: isLoadingCreator } = useQuery({
    queryKey: ['creator-profile'],
    queryFn: () => marketplaceApi.getCreatorProfile()
  });

  // Fetch creator stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['creator-stats'],
    queryFn: () => marketplaceApi.getCreatorStats(),
    enabled: !!creator
  });

  // Fetch creator programs
  const { data: programs = [], isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['creator-programs'],
    queryFn: () => marketplaceApi.getCreatorPrograms(),
    enabled: !!creator
  });

  // Fetch payout history
  const { data: payouts = [] } = useQuery({
    queryKey: ['creator-payouts'],
    queryFn: () => marketplaceApi.getPayoutHistory(),
    enabled: !!creator
  });

  // Create program mutation
  const createProgramMutation = useMutation({
    mutationFn: (program: Partial<Program>) => marketplaceApi.createProgram(program),
    onSuccess: () => {
      toast.success('Programme créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['creator-programs'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création');
    }
  });

  // Update program mutation
  const updateProgramMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Program> }) => 
      marketplaceApi.updateProgram(id, data),
    onSuccess: () => {
      toast.success('Programme mis à jour');
      queryClient.invalidateQueries({ queryKey: ['creator-programs'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  });

  // Submit for review mutation
  const submitForReviewMutation = useMutation({
    mutationFn: (programId: string) => marketplaceApi.submitForReview(programId),
    onSuccess: () => {
      toast.success('Programme soumis pour révision');
      queryClient.invalidateQueries({ queryKey: ['creator-programs'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la soumission');
    }
  });

  // Request payout mutation
  const requestPayoutMutation = useMutation({
    mutationFn: () => marketplaceApi.requestPayout(),
    onSuccess: () => {
      toast.success('Demande de paiement envoyée');
      queryClient.invalidateQueries({ queryKey: ['creator-stats'] });
      queryClient.invalidateQueries({ queryKey: ['creator-payouts'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la demande');
    }
  });

  return {
    creator,
    stats,
    programs,
    payouts,
    isLoading: isLoadingCreator || isLoadingStats || isLoadingPrograms,
    createProgram: createProgramMutation.mutate,
    updateProgram: updateProgramMutation.mutate,
    submitForReview: submitForReviewMutation.mutate,
    requestPayout: requestPayoutMutation.mutate,
    isCreating: createProgramMutation.isPending,
    isUpdating: updateProgramMutation.isPending
  };
}
