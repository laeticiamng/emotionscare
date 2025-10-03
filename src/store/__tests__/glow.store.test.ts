import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGlowStore } from '../glow.store';

describe('useGlowStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-06T08:00:00.000Z'));
    useGlowStore.setState({
      pattern: '4-6-8',
      phase: 'idle',
      running: false,
      paused: false,
      startedAt: null,
      duration: 0,
      currentCycle: 0,
      totalCycles: 0,
      events: [],
      selfReport: {},
      badgeId: null,
      reduceMotion: false,
      enableSound: true,
      enableHaptic: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts a session and records the initial event', () => {
    const { start } = useGlowStore.getState();

    start();

    const state = useGlowStore.getState();
    expect(state.running).toBe(true);
    expect(state.phase).toBe('inhale');
    expect(state.startedAt).not.toBeNull();
    expect(state.events).toEqual([{ t: 0, type: 'start' }]);
  });

  it('pauses and resumes only when the session is active', () => {
    const { start, pause, resume } = useGlowStore.getState();

    start();
    vi.advanceTimersByTime(4000);
    pause();

    let state = useGlowStore.getState();
    expect(state.paused).toBe(true);
    expect(state.phase).toBe('paused');
    expect(state.events.at(-1)).toEqual({ t: 4, type: 'pause' });

    vi.advanceTimersByTime(3000);
    resume();

    state = useGlowStore.getState();
    expect(state.paused).toBe(false);
    expect(state.phase).toBe('inhale');
    expect(state.events.at(-1)).toEqual({ t: 7, type: 'resume' });

    useGlowStore.setState({ running: false, paused: false });
    pause();
    expect(useGlowStore.getState().events.at(-1)).toEqual({ t: 7, type: 'resume' });
  });

  it('stops a running session and captures the duration', () => {
    const { start, stop } = useGlowStore.getState();

    start();
    vi.advanceTimersByTime(6500);
    stop();

    const state = useGlowStore.getState();
    expect(state.running).toBe(false);
    expect(state.phase).toBe('finished');
    expect(state.duration).toBe(6);
    expect(state.events.at(-1)).toEqual({ t: 6, type: 'finish' });
  });

  it('merges self-report updates and tracks cycles', () => {
    const { updateSelfReport, incrementCycle } = useGlowStore.getState();

    updateSelfReport({ energized: true });
    updateSelfReport({ calm: 'oui' });
    incrementCycle();
    incrementCycle();

    const state = useGlowStore.getState();
    expect(state.selfReport).toEqual({ energized: true, calm: 'oui' });
    expect(state.currentCycle).toBe(2);
    expect(state.totalCycles).toBe(2);
  });

  it('resets to the persisted defaults', () => {
    useGlowStore.setState({
      pattern: '5-5',
      phase: 'exhale',
      running: true,
      paused: true,
      startedAt: 10,
      duration: 42,
      currentCycle: 5,
      totalCycles: 6,
      events: [{ t: 0, type: 'start' }, { t: 42, type: 'finish' }],
      selfReport: { energized: true },
      badgeId: 'badge-1',
      reduceMotion: true,
      enableSound: false,
      enableHaptic: false,
    });

    useGlowStore.getState().reset();

    const state = useGlowStore.getState();
    expect(state.pattern).toBe('4-6-8');
    expect(state.events).toEqual([]);
    expect(state.running).toBe(false);
    expect(state.enableSound).toBe(true);
    expect(state.enableHaptic).toBe(true);
    expect(state.reduceMotion).toBe(false);
  });
});
