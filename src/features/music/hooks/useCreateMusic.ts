import { useMutation, useQueryClient } from '@tanstack/react-query';
import { musicApi, type CreateMusicGenerationInput, type MusicGenerationSession } from '../services/musicApi';
import { logger } from '@/lib/logger';

/**
 * Hook to create a new music generation request
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateMusic({
 *   onSuccess: (session) => {
 *     logger.debug('Music generation started:', session.id, 'HOOK');
 *   },
 * });
 *
 * mutate({
 *   emotionState: { valence: 0.8, arousal: 0.6 },
 *   emotionBadge: 'happy',
 *   config: {
 *     customMode: false,
 *     instrumental: true,
 *     title: 'Peaceful Melody',
 *     style: 'ambient, peaceful, calm',
 *     model: 'V4_5',
 *   },
 * });
 * ```
 */
export function useCreateMusic(options?: {
  onSuccess?: (session: MusicGenerationSession) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMusicGenerationInput) => musicApi.createGeneration(input),
    onSuccess: (data) => {
      // Invalidate sessions list to refetch
      queryClient.invalidateQueries({ queryKey: ['music', 'sessions'] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type { CreateMusicGenerationInput, MusicGenerationSession };
