
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { completeChallenge } from '@/lib/gamificationService';
import { saveRelaxationSession } from '@/lib/vrService';
import { saveJournalEntry } from '@/lib/journalService';

export const useCoachEvents = () => {
  // Create safe versions of mutations that don't crash when QueryClient is missing
  const createSafeMutation = (mutationFn: any) => {
    try {
      return useMutation({
        mutationFn,
        onSuccess: () => {
          // We can't access queryClient safely here, so we skip cache invalidation
          // This is a fallback mode when QueryClient isn't available
        },
      });
    } catch (error) {
      // Return a mock mutation object if QueryClient isn't available
      return {
        mutateAsync: async () => {
          console.warn('QueryClient not available, using fallback mode');
          return true;
        },
        isPending: false,
      };
    }
  };

  // Create safe mutations for each function
  const completeChallengeQuery = createSafeMutation(
    async (challengeId: string) => {
      return completeChallenge(challengeId);
    }
  );

  const saveRelaxationQuery = createSafeMutation(
    async (sessionData: any) => {
      await saveRelaxationSession(sessionData);
    }
  );

  const saveJournalEntryQuery = createSafeMutation(
    async (entryData: any) => {
      await saveJournalEntry(entryData);
    }
  );

  const handleCompleteChallenge = useCallback(
    async (challengeId: string) => {
      try {
        await completeChallengeQuery.mutateAsync(challengeId);
        return true;
      } catch (error) {
        console.error('Failed to complete challenge:', error);
        return false;
      }
    },
    [completeChallengeQuery]
  );

  const handleSaveRelaxationSession = useCallback(
    async (sessionData: any) => {
      try {
        await saveRelaxationQuery.mutateAsync(sessionData);
        return true;
      } catch (error) {
        console.error('Failed to save relaxation session:', error);
        return false;
      }
    },
    [saveRelaxationQuery]
  );

  const handleSaveJournalEntry = useCallback(
    async (entryData: any) => {
      try {
        await saveJournalEntryQuery.mutateAsync(entryData);
        return true;
      } catch (error) {
        console.error('Failed to save journal entry:', error);
        return false;
      }
    },
    [saveJournalEntryQuery]
  );

  return {
    handleCompleteChallenge,
    handleSaveRelaxationSession,
    handleSaveJournalEntry,
    isCompletingChallenge: completeChallengeQuery.isPending,
    isSavingRelaxation: saveRelaxationQuery.isPending,
    isSavingJournalEntry: saveJournalEntryQuery.isPending,
  };
};
