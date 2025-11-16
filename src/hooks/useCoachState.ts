import { useState, useCallback, useEffect } from 'react';

export interface CoachState {
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
  sessionId: string | null;
  userId: string | null;
}

export interface UseCoachStateReturn extends CoachState {
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setConnected: (connected: boolean) => void;
  setSessionId: (id: string | null) => void;
  setUserId: (id: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE: CoachState = {
  isLoading: false,
  error: null,
  isConnected: false,
  sessionId: null,
  userId: null,
};

/**
 * Hook pour gérer l'état global du coach
 */
export const useCoachState = (initialUserId?: string): UseCoachStateReturn => {
  const [state, setState] = useState<CoachState>({
    ...INITIAL_STATE,
    userId: initialUserId || null,
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const setConnected = useCallback((isConnected: boolean) => {
    setState((prev) => ({ ...prev, isConnected }));
  }, []);

  const setSessionId = useCallback((sessionId: string | null) => {
    setState((prev) => ({ ...prev, sessionId }));
  }, []);

  const setUserId = useCallback((userId: string | null) => {
    setState((prev) => ({ ...prev, userId }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Persist userId to localStorage
  useEffect(() => {
    if (state.userId) {
      localStorage.setItem('coach:userId:v1', state.userId);
    }
  }, [state.userId]);

  return {
    ...state,
    setLoading,
    setError,
    setConnected,
    setSessionId,
    setUserId,
    reset,
  };
};
