import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalPromptsService, type JournalPrompt } from '@/services/journalPrompts';

/**
 * Hook pour gérer les prompts de journal
 */
export const useJournalPrompts = () => {
  const queryClient = useQueryClient();

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['journal-prompts'],
    queryFn: () => journalPromptsService.getAllPrompts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const getRandomPromptMutation = useMutation({
    mutationFn: (category?: JournalPrompt['category']) =>
      journalPromptsService.getRandomPrompt(category),
  });

  const incrementUsageMutation = useMutation({
    mutationFn: (promptId: string) => 
      journalPromptsService.incrementUsage(promptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-prompts'] });
    },
  });

  return {
    prompts,
    isLoading,
    getRandomPrompt: getRandomPromptMutation.mutateAsync,
    incrementUsage: incrementUsageMutation.mutateAsync,
  };
};
