import { useQuery } from '@tanstack/react-query';
import type { JournalEntry, ListJournalEntriesInput } from '@emotionscare/contracts';
import { journalApi } from '../services/journalApi';

/**
 * Hook to fetch journal entries with optional filters
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useJournalEntries({
 *   limit: 20,
 *   mood: 'happy',
 *   sortBy: 'date',
 * });
 * ```
 */
export function useJournalEntries(filters?: ListJournalEntriesInput) {
  return useQuery({
    queryKey: ['journal', 'entries', filters],
    queryFn: () => journalApi.list(filters),
    staleTime: 30_000, // 30 seconds
  });
}
