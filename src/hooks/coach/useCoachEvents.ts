
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { completeChallenge } from '@/lib/gamificationService';
import { saveRelaxationSession } from '@/lib/vrService';
import { saveJournalEntry } from '@/lib/journalService';

export const useCoachEvents = () => {
  const queryClient = useQueryClient();

  // Handle completing a challenge
  const completeChallengeQuery = useMutation({
    mutationFn: async (challengeId: string) => {
      return completeChallenge(challengeId);
    },
    onSuccess: () => {
      // Invalidate the challenges cache to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

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

  // Handle saving a relaxation session
  const saveRelaxationQuery = useMutation({
    mutationFn: async (sessionData: any) => {
      await saveRelaxationSession(sessionData);
    },
    onSuccess: () => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ['vrSessions'] });
    },
  });

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

  // Handle saving a journal entry
  const saveJournalEntryQuery = useMutation({
    mutationFn: async (entryData: any) => {
      await saveJournalEntry(entryData);
    },
    onSuccess: () => {
      // Invalidate journal entries cache
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    },
  });

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
