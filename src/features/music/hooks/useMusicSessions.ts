import { useQuery } from '@tanstack/react-query';
import type { MusicGenerationSession, ListMusicSessionsInput } from '@emotionscare/contracts';
import { musicApi } from '../services/musicApi';

/**
 * Hook to fetch music generation sessions
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useMusicSessions({
 *   limit: 10,
 *   status: 'completed',
 * });
 * ```
 */
export function useMusicSessions(filters?: ListMusicSessionsInput) {
  return useQuery({
    queryKey: ['music', 'sessions', filters],
    queryFn: () => musicApi.listSessions(filters),
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Hook to fetch a single music generation session with polling
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useMusicSession('session-id', {
 *   refetchInterval: (data) => data?.status === 'completed' ? false : 2000,
 * });
 * ```
 */
export function useMusicSession(sessionId: string, options?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ['music', 'session', sessionId],
    queryFn: () => musicApi.getSession(sessionId),
    refetchInterval: options?.refetchInterval,
    enabled: !!sessionId,
  });
}
