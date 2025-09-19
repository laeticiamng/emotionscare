import { beforeEach, describe, expect, it } from 'vitest';

import { useAppStore } from '@/store/appStore';

const STORAGE_KEY = 'ec-app-store';

describe('appStore persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.getState().reset();
  });

  it('partialize ne persiste que les branches prévues', () => {
    const store = useAppStore.getState();
    store.setTheme('dark');
    store.setUser({ id: 'u-1', email: 'user@example.com', role: 'b2c' });
    store.updatePreferences({ notifications: false });
    store.updateMusicState({ isPlaying: true });
    store.updateEmotionState({ currentMood: 'joyful' });
    store.updateJournalState({ currentEntry: { id: 'draft-1' } });

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();

    const persisted = JSON.parse(raw!);

    expect(persisted.version).toBe(1);
    expect(persisted.state.theme).toBe('dark');
    expect(persisted.state.preferences.notifications).toBe(false);
    expect(persisted.state.modules.music.isPlaying).toBe(true);
    expect(persisted.state.modules.emotion.currentMood).toBe('joyful');
    expect(persisted.state.user).toBeUndefined();
    expect(persisted.state.modules.journal).toBeUndefined();
  });

  it('migrate fusionne les valeurs persistées avec les valeurs par défaut', () => {
    const migrate = useAppStore.persist.getOptions().migrate;
    expect(migrate).toBeTypeOf('function');

    const migrated = migrate?.(
      {
        theme: 'dark',
        preferences: {
          notifications: false,
        },
        modules: {
          music: {
            isPlaying: true,
          },
        },
      },
      0
    ) as any;

    const defaults = useAppStore.getState();

    expect(migrated.theme).toBe('dark');
    expect(migrated.preferences.notifications).toBe(false);
    expect(migrated.preferences.autoSave).toBe(defaults.preferences.autoSave);
    expect(migrated.preferences.analyticsEnabled).toBe(defaults.preferences.analyticsEnabled);
    expect(migrated.modules.music.volume).toBe(defaults.modules.music.volume);
    expect(migrated.modules.music.isPlaying).toBe(true);
    expect(migrated.modules.emotion).toEqual(defaults.modules.emotion);
  });
});
