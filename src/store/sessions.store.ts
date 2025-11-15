/**
 * Shared Zustand Store - Sessions
 * Store global pour toutes les sessions (musique, respiration, etc.)
 *
 * @module store/sessions.store
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export interface SessionState {
  id: string;
  userId: string;
  type: 'music' | 'breath' | 'emotion' | 'journal' | 'coach';
  subtype?: string;
  status: 'idle' | 'active' | 'paused' | 'completed';
  startedAt?: string;
  completedAt?: string;
  duration: number;
  metadata?: Record<string, unknown>;
}

interface SessionsState {
  // Current active session
  activeSession: SessionState | null;

  // Recent sessions cache (last 10)
  recentSessions: SessionState[];

  // Loading state
  isLoading: boolean;
  error: string | null;
}

interface SessionsActions {
  // Session lifecycle
  startSession: (session: Omit<SessionState, 'status' | 'duration'>) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: (metadata?: Record<string, unknown>) => void;

  // Recent sessions
  addToRecent: (session: SessionState) => void;
  clearRecent: () => void;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type SessionsStore = SessionsState & SessionsActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: SessionsState = {
  activeSession: null,
  recentSessions: [],
  isLoading: false,
  error: null,
};

// ============================================================================
// STORE
// ============================================================================

export const useSessionsStore = create<SessionsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Start a new session
        startSession: (session) => {
          const now = new Date().toISOString();
          const newSession: SessionState = {
            ...session,
            status: 'active',
            startedAt: now,
            duration: 0,
          };

          set({ activeSession: newSession, error: null }, false, 'startSession');
        },

        // Pause current session
        pauseSession: () => {
          const { activeSession } = get();
          if (!activeSession) return;

          set(
            {
              activeSession: {
                ...activeSession,
                status: 'paused',
              },
            },
            false,
            'pauseSession'
          );
        },

        // Resume paused session
        resumeSession: () => {
          const { activeSession } = get();
          if (!activeSession || activeSession.status !== 'paused') return;

          set(
            {
              activeSession: {
                ...activeSession,
                status: 'active',
              },
            },
            false,
            'resumeSession'
          );
        },

        // Complete current session
        completeSession: (metadata) => {
          const { activeSession } = get();
          if (!activeSession) return;

          const now = new Date().toISOString();
          const startTime = new Date(activeSession.startedAt || now).getTime();
          const endTime = new Date(now).getTime();
          const duration = Math.floor((endTime - startTime) / 1000);

          const completedSession: SessionState = {
            ...activeSession,
            status: 'completed',
            completedAt: now,
            duration,
            metadata: { ...activeSession.metadata, ...metadata },
          };

          // Add to recent
          get().addToRecent(completedSession);

          set({ activeSession: null }, false, 'completeSession');
        },

        // Add session to recent list
        addToRecent: (session) => {
          set(
            (state) => ({
              recentSessions: [session, ...state.recentSessions].slice(0, 10),
            }),
            false,
            'addToRecent'
          );
        },

        // Clear recent sessions
        clearRecent: () => {
          set({ recentSessions: [] }, false, 'clearRecent');
        },

        // Set loading state
        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading');
        },

        // Set error
        setError: (error) => {
          set({ error }, false, 'setError');
        },

        // Reset store
        reset: () => {
          set(initialState, false, 'reset');
        },
      }),
      {
        name: 'emotionscare-sessions',
        partialize: (state) => ({
          recentSessions: state.recentSessions,
        }),
      }
    ),
    { name: 'SessionsStore' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const selectActiveSession = (state: SessionsStore) => state.activeSession;
export const selectIsSessionActive = (state: SessionsStore) =>
  state.activeSession?.status === 'active';
export const selectRecentSessions = (state: SessionsStore) => state.recentSessions;
export const selectRecentSessionsByType = (type: SessionState['type']) =>
  (state: SessionsStore) => state.recentSessions.filter((s) => s.type === type);
