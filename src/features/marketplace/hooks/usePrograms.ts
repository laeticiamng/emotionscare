/**
 * Hook pour la gestion des programmes achetés
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '../services/marketplaceApi';
import { toast } from 'sonner';

export function usePrograms() {
  const queryClient = useQueryClient();

  // Fetch user's purchased programs
  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['user-purchases'],
    queryFn: () => marketplaceApi.getUserPurchases()
  });

  // Track module completion
  const completeModuleMutation = useMutation({
    mutationFn: ({ purchaseId, moduleId }: { purchaseId: string; moduleId: string }) =>
      marketplaceApi.completeModule(purchaseId, moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-purchases'] });
    }
  });

  // Submit review
  const submitReviewMutation = useMutation({
    mutationFn: ({ programId, rating, comment }: { programId: string; rating: number; comment: string }) =>
      marketplaceApi.submitReview(programId, rating, comment),
    onSuccess: () => {
      toast.success('Merci pour votre avis !');
      queryClient.invalidateQueries({ queryKey: ['user-purchases'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la soumission');
    }
  });

  const completeModule = useCallback((purchaseId: string, moduleId: string) => {
    completeModuleMutation.mutate({ purchaseId, moduleId });
  }, [completeModuleMutation]);

  const submitReview = useCallback((programId: string, rating: number, comment: string) => {
    submitReviewMutation.mutate({ programId, rating, comment });
  }, [submitReviewMutation]);

  return {
    purchases,
    isLoading,
    completeModule,
    submitReview,
    isSubmittingReview: submitReviewMutation.isPending
  };
}
