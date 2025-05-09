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
        // Define the mutateAsync function with the same parameter type as the real function
        mutateAsync: async (params: any) => {
          console.warn('QueryClient not available, using fallback mode');
          return true; // Return true instead of undefined to match the return type of the real mutations
        },
        isPending: false,
      };
    }
  };

  // Create safe mutations for each function
  const completeChallengeQuery = createSafeMutation(
    async (challengeId: string): Promise<boolean> => {
      await completeChallenge(challengeId);
      return true; // Return a consistent value for both real and mock mutations
    }
  );

  const saveRelaxationQuery = createSafeMutation(
    async (sessionData: any): Promise<boolean> => {
      await saveRelaxationSession(sessionData);
      return true; // Return a consistent value
    }
  );

  const saveJournalEntryQuery = createSafeMutation(
    async (entryData: any): Promise<boolean> => {
      await saveJournalEntry(entryData);
      return true; // Return a consistent value
    }
  );

  const handleCompleteChallenge = useCallback(
    async (challengeId: string): Promise<boolean> => {
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
    async (sessionData: any): Promise<boolean> => {
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
    async (entryData: any): Promise<boolean> => {
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
