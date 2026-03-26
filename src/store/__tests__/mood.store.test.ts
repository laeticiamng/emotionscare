// @ts-nocheck
import { describe, it, expect, beforeEach } from 'vitest';
import { useMoodStore } from '../mood.store';

describe('mood.store', () => {
  beforeEach(() => {
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
  });

  it('initialise en idle', () => {
    expect(useMoodStore.getState().status).toBe('idle');
    expect(useMoodStore.getState().sessionId).toBeNull();
  });

  it('démarre une session', () => {
    useMoodStore.getState().startSession('sess-1', 'wss://test');
    const state = useMoodStore.getState();
    expect(state.sessionId).toBe('sess-1');
    expect(state.status).toBe('starting');
    expect(state.wsUrl).toBe('wss://test');
  });

  it('termine une session active', () => {
    useMoodStore.getState().startSession('sess-1');
    useMoodStore.getState().endSession();
    expect(useMoodStore.getState().status).toBe('ending');
    expect(useMoodStore.getState().isPlaying).toBe(false);
  });

  it('ne termine pas en idle', () => {
    useMoodStore.getState().endSession();
    expect(useMoodStore.getState().status).toBe('idle');
  });

  it('met à jour le blend avec les cartes', () => {
    useMoodStore.getState().setCards(['joy', 'calm']);
    const { blend } = useMoodStore.getState();
    expect(blend.joy).toBeGreaterThan(0.5);
    expect(blend.calm).toBeGreaterThan(0.5);
  });

  it('met à jour le blend partiellement', () => {
    useMoodStore.getState().updateBlend({ energy: 0.9 });
    expect(useMoodStore.getState().blend.energy).toBe(0.9);
    expect(useMoodStore.getState().blend.joy).toBe(0.5);
  });

  it('passe en active quand track url défini', () => {
    useMoodStore.getState().startSession('s-1');
    useMoodStore.getState().setTrackUrl('https://example.com/track.mp3');
    expect(useMoodStore.getState().status).toBe('active');
    expect(useMoodStore.getState().trackUrl).toBe('https://example.com/track.mp3');
  });

  it('ajoute et met à jour des réponses', () => {
    useMoodStore.getState().addAnswer({ id: 'q1', value: 2 });
    expect(useMoodStore.getState().answers).toHaveLength(1);

    useMoodStore.getState().addAnswer({ id: 'q1', value: 3 });
    expect(useMoodStore.getState().answers).toHaveLength(1);
    expect(useMoodStore.getState().answers[0].value).toBe(3);

    useMoodStore.getState().addAnswer({ id: 'q2', value: 1 });
    expect(useMoodStore.getState().answers).toHaveLength(2);
  });

  it('gère humeSummary', () => {
    useMoodStore.getState().setHumeSummary({ frustration_index: 0.2 });
    expect(useMoodStore.getState().humeSummary?.frustration_index).toBe(0.2);
  });

  it('gère isPlaying et currentPrompt', () => {
    useMoodStore.getState().setIsPlaying(true);
    expect(useMoodStore.getState().isPlaying).toBe(true);

    useMoodStore.getState().setCurrentPrompt('p-1');
    expect(useMoodStore.getState().currentPromptId).toBe('p-1');
  });

  it('reset conserve le sessionId', () => {
    useMoodStore.getState().startSession('keep-me');
    useMoodStore.getState().setIsPlaying(true);
    useMoodStore.getState().reset();
    expect(useMoodStore.getState().sessionId).toBe('keep-me');
    expect(useMoodStore.getState().isPlaying).toBe(false);
  });
});
