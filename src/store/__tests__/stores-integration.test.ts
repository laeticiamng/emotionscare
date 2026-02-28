import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSessionsStore } from '@/store/sessions.store';
import { useMoodStore } from '@/store/mood.store';
import { useGamificationStore } from '@/store/gamification.store';

/**
 * Tests d'intégration entre stores — vérifie que les stores
 * peuvent coexister et être réinitialisés indépendamment.
 */
describe('Stores — isolation et coexistence', () => {
  beforeEach(() => {
    useSessionsStore.getState().reset();
    useMoodStore.setState({
      sessionId: null,
      status: 'idle',
      cards: [],
      blend: { joy: 0.5, calm: 0.5, energy: 0.5, focus: 0.5 },
      trackUrl: null,
      wsUrl: null,
      answers: [],
      humeSummary: null,
      isPlaying: false,
      currentPromptId: null,
    });
    useGamificationStore.getState().reset();
  });

  it('sessions et mood sont indépendants', () => {
    useSessionsStore.getState().startSession({
      id: 's-1',
      userId: 'u-1',
      type: 'music',
    });
    useMoodStore.getState().startSession('mood-1');

    expect(useSessionsStore.getState().activeSession?.id).toBe('s-1');
    expect(useMoodStore.getState().sessionId).toBe('mood-1');

    useSessionsStore.getState().reset();
    expect(useSessionsStore.getState().activeSession).toBeNull();
    expect(useMoodStore.getState().sessionId).toBe('mood-1');
  });

  it('gamification reset n\'affecte pas sessions', () => {
    useSessionsStore.getState().startSession({
      id: 's-2',
      userId: 'u-1',
      type: 'breath',
    });
    useGamificationStore.getState().setScope('global');

    useGamificationStore.getState().reset();
    expect(useGamificationStore.getState().scope).toBe('friends');
    expect(useSessionsStore.getState().activeSession?.id).toBe('s-2');
  });

  it('tous les stores se reset correctement', () => {
    useSessionsStore.getState().startSession({ id: 's', userId: 'u', type: 'coach' });
    useMoodStore.getState().startSession('m');
    useGamificationStore.getState().setError('err');

    useSessionsStore.getState().reset();
    useMoodStore.setState({ sessionId: null, status: 'idle' });
    useGamificationStore.getState().reset();

    expect(useSessionsStore.getState().activeSession).toBeNull();
    expect(useMoodStore.getState().status).toBe('idle');
    expect(useGamificationStore.getState().error).toBeNull();
  });
});
