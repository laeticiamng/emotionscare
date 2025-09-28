import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

import { useAppStore } from '@/store/appStore';
import { useThemeValue } from '@/store/hooks';
import { selectMusicModule } from '@/store/selectors';

describe('appStore actions', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.getState().reset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('setUser met à jour l\'état sans muter les autres branches', () => {
    const previousState = useAppStore.getState();
    const previousPreferences = previousState.preferences;
    const previousCache = previousState.cache;

    useAppStore.getState().setUser({
      id: 'user-1',
      email: 'user@example.com',
      role: 'b2c',
    });

    const currentState = useAppStore.getState();

    expect(currentState).not.toBe(previousState);
    expect(currentState.user).toEqual({
      id: 'user-1',
      email: 'user@example.com',
      role: 'b2c',
    });
    expect(previousState.user).toBeNull();
    expect(currentState.preferences).toBe(previousPreferences);
    expect(currentState.cache).toBe(previousCache);
  });

  it('updateMusicState fusionne sans écraser les autres modules', () => {
    const initialState = useAppStore.getState();
    const previousModules = initialState.modules;
    const previousEmotion = initialState.modules.emotion;

    useAppStore.getState().updateMusicState({
      isPlaying: true,
      playlist: ['track-1'],
    });

    const currentState = useAppStore.getState();

    expect(currentState.modules).not.toBe(previousModules);
    expect(currentState.modules.music).not.toBe(previousModules.music);
    expect(currentState.modules.music).toEqual({
      ...previousModules.music,
      isPlaying: true,
      playlist: ['track-1'],
    });
    expect(currentState.modules.emotion).toBe(previousEmotion);
    expect(initialState.modules.music.isPlaying).toBe(false);
  });

  it('clearCache supprime une entrée sans muter les autres', () => {
    const store = useAppStore.getState();
    store.setCache('alpha', 'value-a');
    store.setCache('beta', 'value-b');

    const withCache = useAppStore.getState();
    const previousCache = withCache.cache;
    const previousTimestamps = withCache.cacheTimestamps;

    withCache.clearCache('alpha');

    const afterClear = useAppStore.getState();

    expect(afterClear.cache).not.toBe(previousCache);
    expect(afterClear.cacheTimestamps).not.toBe(previousTimestamps);
    expect(afterClear.cache.alpha).toBeUndefined();
    expect(afterClear.cache.beta).toBe('value-b');
    expect(previousCache.alpha).toBe('value-a');

    afterClear.clearCache();

    const afterReset = useAppStore.getState();
    expect(afterReset.cache).toEqual({});
    expect(afterReset.cacheTimestamps).toEqual({});
  });

  it('isCacheValid respecte le paramètre maxAge', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));

    const store = useAppStore.getState();
    store.setCache('report', { foo: 'bar' });

    expect(useAppStore.getState().isCacheValid('report', 2000)).toBe(true);

    vi.advanceTimersByTime(2500);

    expect(useAppStore.getState().isCacheValid('report', 2000)).toBe(false);
  });

  it('conserve la référence utilisateur lors du changement de thème', () => {
    useAppStore.getState().setUser({
      id: 'user-42',
      email: 'user42@example.com',
      role: 'b2c',
    });

    const before = useAppStore.getState().user;

    useAppStore.getState().setTheme('dark');

    expect(useAppStore.getState().user).toBe(before);
  });

  it('le sélecteur musique renvoie la même référence si inchangé', () => {
    const first = selectMusicModule(useAppStore.getState());

    useAppStore.getState().setTheme('dark');

    const second = selectMusicModule(useAppStore.getState());

    expect(second).toBe(first);
  });

  it('les abonnés au thème ne re-rendent pas lorsque seul l\'utilisateur change', () => {
    const renders: number[] = [];

    const { result } = renderHook(() => {
      renders.push(1);
      return useThemeValue();
    });

    expect(renders).toHaveLength(1);

    act(() => {
      useAppStore.getState().setUser({
        id: 'user-99',
        email: 'user99@example.com',
        role: 'b2c',
      });
    });

    expect(renders).toHaveLength(1);

    act(() => {
      useAppStore.getState().setTheme(result.current === 'dark' ? 'light' : 'dark');
    });

    expect(renders).toHaveLength(2);
  });
});
