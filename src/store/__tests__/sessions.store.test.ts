/**
 * Tests for sessions.store.ts - Global session management
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSessionsStore, type SessionState } from '../sessions.store';

describe('useSessionsStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useSessionsStore.getState().reset();
  });

  describe('Session lifecycle', () => {
    it('starts a new session with active status', () => {
      const { startSession } = useSessionsStore.getState();

      startSession({
        id: 'session-123',
        userId: 'user-456',
        type: 'music',
        subtype: 'therapeutic',
      });

      const { activeSession } = useSessionsStore.getState();
      expect(activeSession).toBeDefined();
      expect(activeSession?.id).toBe('session-123');
      expect(activeSession?.userId).toBe('user-456');
      expect(activeSession?.type).toBe('music');
      expect(activeSession?.subtype).toBe('therapeutic');
      expect(activeSession?.status).toBe('active');
      expect(activeSession?.duration).toBe(0);
      expect(activeSession?.startedAt).toBeDefined();
    });

    it('pauses an active session', () => {
      const { startSession, pauseSession } = useSessionsStore.getState();

      startSession({
        id: 'session-123',
        userId: 'user-456',
        type: 'breath',
      });

      pauseSession();

      const { activeSession } = useSessionsStore.getState();
      expect(activeSession?.status).toBe('paused');
    });

    it('resumes a paused session', () => {
      const { startSession, pauseSession, resumeSession } = useSessionsStore.getState();

      startSession({
        id: 'session-123',
        userId: 'user-456',
        type: 'breath',
      });

      pauseSession();
      expect(useSessionsStore.getState().activeSession?.status).toBe('paused');

      resumeSession();
      expect(useSessionsStore.getState().activeSession?.status).toBe('active');
    });

    it('does not resume if session is not paused', () => {
      const { startSession, resumeSession } = useSessionsStore.getState();

      startSession({
        id: 'session-123',
        userId: 'user-456',
        type: 'breath',
      });

      const beforeResume = useSessionsStore.getState().activeSession;
      resumeSession();
      const afterResume = useSessionsStore.getState().activeSession;

      expect(afterResume?.status).toBe('active');
      expect(beforeResume?.startedAt).toBe(afterResume?.startedAt);
    });

    it('completes a session and adds it to recent sessions', () => {
      const { startSession, completeSession } = useSessionsStore.getState();

      startSession({
        id: 'session-123',
        userId: 'user-456',
        type: 'music',
        subtype: 'therapeutic',
      });

      // Wait a bit to have some duration
      vi.useFakeTimers();
      vi.advanceTimersByTime(5000); // 5 seconds

      completeSession({ effectiveness: 0.85 });

      const { activeSession, recentSessions } = useSessionsStore.getState();

      expect(activeSession).toBeNull();
      expect(recentSessions).toHaveLength(1);
      expect(recentSessions[0].status).toBe('completed');
      expect(recentSessions[0].completedAt).toBeDefined();
      expect(recentSessions[0].metadata?.effectiveness).toBe(0.85);

      vi.useRealTimers();
    });

    it('does not complete if there is no active session', () => {
      const { completeSession } = useSessionsStore.getState();

      completeSession();

      const { activeSession, recentSessions } = useSessionsStore.getState();
      expect(activeSession).toBeNull();
      expect(recentSessions).toHaveLength(0);
    });
  });

  describe('Recent sessions management', () => {
    it('adds session to recent list', () => {
      const { addToRecent } = useSessionsStore.getState();

      const session: SessionState = {
        id: 'session-1',
        userId: 'user-1',
        type: 'music',
        status: 'completed',
        duration: 600,
      };

      addToRecent(session);

      const { recentSessions } = useSessionsStore.getState();
      expect(recentSessions).toHaveLength(1);
      expect(recentSessions[0]).toEqual(session);
    });

    it('maintains recent sessions in reverse chronological order', () => {
      const { addToRecent } = useSessionsStore.getState();

      const session1: SessionState = {
        id: 'session-1',
        userId: 'user-1',
        type: 'music',
        status: 'completed',
        duration: 600,
      };

      const session2: SessionState = {
        id: 'session-2',
        userId: 'user-1',
        type: 'breath',
        status: 'completed',
        duration: 300,
      };

      addToRecent(session1);
      addToRecent(session2);

      const { recentSessions } = useSessionsStore.getState();
      expect(recentSessions[0]).toEqual(session2);
      expect(recentSessions[1]).toEqual(session1);
    });

    it('limits recent sessions to 10', () => {
      const { addToRecent } = useSessionsStore.getState();

      // Add 15 sessions
      for (let i = 0; i < 15; i++) {
        addToRecent({
          id: `session-${i}`,
          userId: 'user-1',
          type: 'music',
          status: 'completed',
          duration: 100,
        });
      }

      const { recentSessions } = useSessionsStore.getState();
      expect(recentSessions).toHaveLength(10);
      // Most recent should be session-14 (last added)
      expect(recentSessions[0].id).toBe('session-14');
      // Oldest should be session-5 (session-0 to session-4 were removed)
      expect(recentSessions[9].id).toBe('session-5');
    });

    it('clears all recent sessions', () => {
      const { addToRecent, clearRecent } = useSessionsStore.getState();

      addToRecent({
        id: 'session-1',
        userId: 'user-1',
        type: 'music',
        status: 'completed',
        duration: 600,
      });

      expect(useSessionsStore.getState().recentSessions).toHaveLength(1);

      clearRecent();

      expect(useSessionsStore.getState().recentSessions).toHaveLength(0);
    });
  });

  describe('State management', () => {
    it('sets loading state', () => {
      const { setLoading } = useSessionsStore.getState();

      setLoading(true);
      expect(useSessionsStore.getState().isLoading).toBe(true);

      setLoading(false);
      expect(useSessionsStore.getState().isLoading).toBe(false);
    });

    it('sets error state', () => {
      const { setError } = useSessionsStore.getState();

      setError('Test error');
      expect(useSessionsStore.getState().error).toBe('Test error');

      setError(null);
      expect(useSessionsStore.getState().error).toBeNull();
    });

    it('clears error when starting a new session', () => {
      const { setError, startSession } = useSessionsStore.getState();

      setError('Previous error');
      expect(useSessionsStore.getState().error).toBe('Previous error');

      startSession({
        id: 'session-123',
        userId: 'user-456',
        type: 'music',
      });

      expect(useSessionsStore.getState().error).toBeNull();
    });

    it('resets store to initial state', () => {
      const { startSession, setLoading, setError, reset } = useSessionsStore.getState();

      // Modify state
      startSession({
        id: 'session-123',
        userId: 'user-456',
        type: 'music',
      });
      setLoading(true);
      setError('Error');

      reset();

      const state = useSessionsStore.getState();
      expect(state.activeSession).toBeNull();
      expect(state.recentSessions).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('Selectors', () => {
    it('selectActiveSession returns active session', () => {
      const { startSession } = useSessionsStore.getState();

      startSession({
        id: 'session-123',
        userId: 'user-456',
        type: 'music',
      });

      const activeSession = useSessionsStore((state) => state.activeSession);
      expect(activeSession?.id).toBe('session-123');
    });

    it('selectIsSessionActive returns true only when status is active', () => {
      const { startSession, pauseSession } = useSessionsStore.getState();

      startSession({
        id: 'session-123',
        userId: 'user-456',
        type: 'music',
      });

      let isActive = useSessionsStore.getState().activeSession?.status === 'active';
      expect(isActive).toBe(true);

      pauseSession();

      isActive = useSessionsStore.getState().activeSession?.status === 'active';
      expect(isActive).toBe(false);
    });

    it('selectRecentSessions returns recent sessions list', () => {
      const { addToRecent } = useSessionsStore.getState();

      addToRecent({
        id: 'session-1',
        userId: 'user-1',
        type: 'music',
        status: 'completed',
        duration: 600,
      });

      const recentSessions = useSessionsStore((state) => state.recentSessions);
      expect(recentSessions).toHaveLength(1);
    });
  });

  describe('Different session types', () => {
    it('handles music session', () => {
      const { startSession } = useSessionsStore.getState();

      startSession({
        id: 'music-1',
        userId: 'user-1',
        type: 'music',
        subtype: 'therapeutic',
      });

      expect(useSessionsStore.getState().activeSession?.type).toBe('music');
    });

    it('handles breath session', () => {
      const { startSession } = useSessionsStore.getState();

      startSession({
        id: 'breath-1',
        userId: 'user-1',
        type: 'breath',
        subtype: 'immersive',
      });

      expect(useSessionsStore.getState().activeSession?.type).toBe('breath');
    });

    it('handles emotion session', () => {
      const { startSession } = useSessionsStore.getState();

      startSession({
        id: 'emotion-1',
        userId: 'user-1',
        type: 'emotion',
      });

      expect(useSessionsStore.getState().activeSession?.type).toBe('emotion');
    });

    it('handles journal session', () => {
      const { startSession } = useSessionsStore.getState();

      startSession({
        id: 'journal-1',
        userId: 'user-1',
        type: 'journal',
      });

      expect(useSessionsStore.getState().activeSession?.type).toBe('journal');
    });

    it('handles coach session', () => {
      const { startSession } = useSessionsStore.getState();

      startSession({
        id: 'coach-1',
        userId: 'user-1',
        type: 'coach',
      });

      expect(useSessionsStore.getState().activeSession?.type).toBe('coach');
    });
  });

  describe('Metadata handling', () => {
    it('preserves metadata from start to complete', () => {
      const { startSession, completeSession } = useSessionsStore.getState();

      startSession({
        id: 'session-1',
        userId: 'user-1',
        type: 'music',
        metadata: { preset: 'relaxing' },
      });

      completeSession({ effectiveness: 0.9 });

      const { recentSessions } = useSessionsStore.getState();
      expect(recentSessions[0].metadata?.preset).toBe('relaxing');
      expect(recentSessions[0].metadata?.effectiveness).toBe(0.9);
    });
  });
});
