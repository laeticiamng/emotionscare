/**
 * Hook principal pour la navigation Marketplace
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '../services/marketplaceApi';
import type { MarketplaceFilters, Program, ProgramCategory } from '../types';
import { toast } from 'sonner';

export function useMarketplace() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<MarketplaceFilters>({
    sortBy: 'popular'
  });

  // Fetch programs avec filtres
  const {
    data: programs = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['marketplace-programs', filters],
    queryFn: () => marketplaceApi.getPrograms(filters),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Fetch featured programs
  const { data: featuredPrograms = [] } = useQuery({
    queryKey: ['marketplace-featured'],
    queryFn: () => marketplaceApi.getFeaturedPrograms(),
    staleTime: 10 * 60 * 1000
  });

  // Fetch categories avec counts
  const { data: categories = [] } = useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: () => marketplaceApi.getCategories(),
    staleTime: 30 * 60 * 1000
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: (programId: string) => marketplaceApi.purchaseProgram(programId),
    onSuccess: () => {
      toast.success('Achat réussi ! Accédez à votre programme.');
      queryClient.invalidateQueries({ queryKey: ['user-purchases'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de l\'achat');
    }
  });

  const updateFilters = useCallback((newFilters: Partial<MarketplaceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const searchPrograms = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const filterByCategory = useCallback((category: ProgramCategory | undefined) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  return {
    programs,
    featuredPrograms,
    categories,
    filters,
    isLoading,
    error,
    updateFilters,
    searchPrograms,
    filterByCategory,
    purchaseProgram: purchaseMutation.mutate,
    isPurchasing: purchaseMutation.isPending
  };
}

export function useProgram(programId: string) {
  const { data: program, isLoading, error } = useQuery({
    queryKey: ['marketplace-program', programId],
    queryFn: () => marketplaceApi.getProgram(programId),
    enabled: !!programId
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['program-reviews', programId],
    queryFn: () => marketplaceApi.getProgramReviews(programId),
    enabled: !!programId
  });

  return { program, reviews, isLoading, error };
}

export function useUserPurchases() {
  const { data: purchases = [], isLoading, error } = useQuery({
    queryKey: ['user-purchases'],
    queryFn: () => marketplaceApi.getUserPurchases()
  });

  return { purchases, isLoading, error };
}
