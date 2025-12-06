import { beforeEach, describe, expect, it } from 'vitest';
import { useMoodStore } from '@/store/mood.store';

type StoreState = ReturnType<typeof useMoodStore.getState>;

const resetStoreState = () => {
  const defaults: Partial<StoreState> = {
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
  };

  useMoodStore.setState(defaults);
};

describe('useMoodStore', () => {
  beforeEach(() => {
    localStorage.clear();
    (useMoodStore as unknown as { persist?: { clearStorage?: () => void } }).persist?.clearStorage?.();
    resetStoreState();
  });

  it('starts a session and primes the store state', () => {
    const { startSession } = useMoodStore.getState();

    startSession('session-123', 'wss://example.test');

    const state = useMoodStore.getState();
    expect(state.sessionId).toBe('session-123');
    expect(state.status).toBe('starting');
    expect(state.wsUrl).toBe('wss://example.test');
    expect(state.answers).toEqual([]);
    expect(state.humeSummary).toBeNull();
  });

  it('transitions to ending only when the session is running', () => {
    const { endSession, startSession, setIsPlaying } = useMoodStore.getState();

    startSession('session-active');
    useMoodStore.setState({ status: 'active' });
    setIsPlaying(true);

    endSession();

    const state = useMoodStore.getState();
    expect(state.status).toBe('ending');
    expect(state.isPlaying).toBe(false);

    useMoodStore.setState({ status: 'idle' });
    endSession();
    expect(useMoodStore.getState().status).toBe('idle');
  });

  it('stores selected cards and updates the emotion blend accordingly', () => {
    const { setCards } = useMoodStore.getState();
    useMoodStore.setState({ blend: { joy: 0, calm: 0, energy: 0, focus: 0 } });

    setCards(['joy', 'focus']);

    const state = useMoodStore.getState();
    expect(state.cards).toEqual(['joy', 'focus']);
    expect(state.blend.joy).toBeCloseTo(0.3, 5);
    expect(state.blend.focus).toBeCloseTo(0.3, 5);
    expect(state.blend.calm).toBe(0);
  });

  it('merges new blend values without overwriting other axes', () => {
    const { updateBlend } = useMoodStore.getState();

    updateBlend({ joy: 0.9 });

    const state = useMoodStore.getState();
    expect(state.blend.joy).toBe(0.9);
    expect(state.blend.calm).toBeCloseTo(0.5);
  });

  it('adds answers uniquely and replaces existing entries', () => {
    const { addAnswer } = useMoodStore.getState();

    addAnswer({ id: 'q1', value: 1 });
    addAnswer({ id: 'q1', value: 3 });
    addAnswer({ id: 'q2', value: 2 });

    const state = useMoodStore.getState();
    expect(state.answers).toHaveLength(2);
    expect(state.answers.find(a => a.id === 'q1')?.value).toBe(3);
  });

  it('activates playback when a track URL is provided', () => {
    const { setTrackUrl } = useMoodStore.getState();

    setTrackUrl('/audio/test.mp3');

    const state = useMoodStore.getState();
    expect(state.trackUrl).toBe('/audio/test.mp3');
    expect(state.status).toBe('active');
  });

  it('resets transient state but keeps the current session identifier', () => {
    const { startSession, setCards, addAnswer, setIsPlaying, reset } = useMoodStore.getState();

    startSession('session-reset');
    useMoodStore.setState({ status: 'active', blend: { joy: 0.8, calm: 0.2, energy: 0.6, focus: 0.4 } });
    setCards(['joy']);
    addAnswer({ id: 'q1', value: 2 });
    setIsPlaying(true);

    reset();

    const state = useMoodStore.getState();
    expect(state.sessionId).toBe('session-reset');
    expect(state.status).toBe('idle');
    expect(state.cards).toEqual([]);
    expect(state.answers).toEqual([]);
    expect(state.blend).toEqual({ joy: 0.5, calm: 0.5, energy: 0.5, focus: 0.5 });
    expect(state.isPlaying).toBe(false);
  });
});
