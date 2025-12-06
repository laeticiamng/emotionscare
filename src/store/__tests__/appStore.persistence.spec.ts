// @ts-nocheck
import { beforeEach, describe, expect, it } from 'vitest';

import { migrate as migrateConfig, partialize as partializeConfig, useAppStore } from '@/store/appStore';

const STORAGE_KEY = 'ec.app.v3';

describe('appStore persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.getState().reset();
  });

  it('partialize ne persiste que les branches prévues', () => {
    const store = useAppStore.getState();
    store.setTheme('dark');
    store.setAuthenticated(true);
    store.setUser({ id: 'u-1', email: 'user@example.com', role: 'b2c' });
    store.updatePreferences({ notifications: false });
    store.updateMusicState({ isPlaying: true });
    store.updateEmotionState({ currentMood: 'joyful' });
    store.setCache('transient', { foo: 'bar' });

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();

    const persisted = JSON.parse(raw!);

    expect(persisted.version).toBe(3);
    expect(persisted.state.user).toEqual({ id: 'u-1', email: 'user@example.com', role: 'b2c' });
    expect(persisted.state.isAuthenticated).toBe(true);
    expect(persisted.state.theme).toBe('dark');
    expect(persisted.state.preferences.notifications).toBe(false);
    expect(persisted.state.modules.music.isPlaying).toBe(true);
    expect(persisted.state.modules.emotion).toBeUndefined();
    expect(persisted.state.cache).toBeUndefined();
  });

  it('migrate fusionne les valeurs persistées avec les valeurs par défaut', () => {
    const migrate = useAppStore.persist.getOptions().migrate;
    expect(migrate).toBeTypeOf('function');

    const migrated = migrate?.(
      {
        state: {
          cache: { stale: 'value' },
          cacheTimestamps: { stale: 123 },
          preferences: {
            notifications: false,
          },
          modules: {
            music: {
              isPlaying: true,
            },
          },
        },
      },
      2
    ) as any;

    const defaults = useAppStore.getState();

    expect(migrated.state.cache).toEqual({});
    expect(migrated.state.cacheTimestamps).toEqual({});
    expect(migrated.state.preferences.notifications).toBe(false);
    expect(migrated.state.preferences.autoSave).toBe(defaults.preferences.autoSave);
    expect(migrated.state.modules.music.volume).toBe(defaults.modules.music.volume);
    expect(migrated.state.modules.music.isPlaying).toBe(true);
  });

  it('expose les helpers de partialize et migrate pour vérification unitaire', () => {
    const state = useAppStore.getState();
    const snapshot = partializeConfig(state);

    expect(snapshot.cache).toBeUndefined();
    expect(snapshot.modules.music).toEqual(state.modules.music);

    const migrated = migrateConfig(
      {
        state: {
          cache: { foo: 'bar' },
          cacheTimestamps: { foo: Date.now() },
        },
      },
      1
    ) as any;

    expect(migrated.state.cache).toEqual({});
    expect(migrated.state.cacheTimestamps).toEqual({});
  });
});
