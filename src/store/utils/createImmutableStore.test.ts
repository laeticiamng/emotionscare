import { beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';

import { createImmutableStore, persist } from './createImmutableStore';

interface CounterState {
  count: number;
  label: string;
  increment: () => void;
}

describe('createImmutableStore persist integration', () => {
  const STORAGE_KEY = 'createImmutableStore-test';

  beforeEach(() => {
    localStorage.clear();
  });

  it('stores serialisable parts of the state when persisting', () => {
    const useCounterStore = create(
      persist<CounterState>(
        (set) => ({
          count: 0,
          label: 'ready',
          increment: () => set((state) => ({ count: state.count + 1 })),
        }),
        { name: STORAGE_KEY },
      ),
    );

    useCounterStore.getState().increment();

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(persisted).toEqual({
      state: {
        count: 1,
        label: 'ready',
      },
      version: 0,
    });
  });

  it('applies partialize and migrate hooks during hydration', () => {
    const migrate = vi.fn((state: Partial<CounterState> | undefined, version: number) => {
      expect(version).toBe(1);
      return {
        count: (state?.count ?? 0) + 2,
        label: state?.label ?? 'migrated',
      } satisfies Partial<CounterState>;
    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        state: { count: 3, label: 'legacy' },
        version: 1,
      }),
    );

    const useCounterStore = create(
      createImmutableStore<CounterState>(
        (set) => ({
          count: 0,
          label: 'initial',
          increment: () => set((state) => ({ count: state.count + 1 })),
        }),
        {
          persist: {
            name: STORAGE_KEY,
            partialize: (state) => ({ count: state.count }),
            version: 2,
            migrate,
          },
        },
      ),
    );

    const state = useCounterStore.getState();
    expect(state.count).toBe(5);
    expect(state.label).toBe('initial');
    expect(migrate).toHaveBeenCalledWith({ count: 3, label: 'legacy' }, 1);

    state.increment();
    const snapshot = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(snapshot.state).toEqual({ count: 6 });
    expect(snapshot.version).toBe(2);
  });

  it('gracefully skips persistence when storage is unavailable', () => {
    const storageFactory = vi.fn(() => {
      throw new Error('denied');
    });

    const useStore = create(
      createImmutableStore<{ value: number; setValue: (value: number) => void }>(
        (set) => ({
          value: 10,
          setValue: (value) => set({ value }),
        }),
        {
          persist: {
            name: 'unavailable-storage',
            storage: storageFactory,
          },
        },
      ),
    );

    expect(useStore.getState().value).toBe(10);
    expect(storageFactory).toHaveBeenCalled();
    expect(localStorage.getItem('unavailable-storage')).toBeNull();
  });

  it('exposes persist options on the store api', () => {
    const useStore = create(
      createImmutableStore<{ value: number; setValue: (value: number) => void }>(
        (set) => ({
          value: 1,
          setValue: (value) => set({ value }),
        }),
        {
          persist: {
            name: STORAGE_KEY,
            version: 4,
          },
        },
      ),
    );

    const persistOptions = (useStore as unknown as { persist?: { getOptions: () => unknown } }).persist?.getOptions();
    expect(persistOptions).toEqual({ name: STORAGE_KEY, version: 4 });
  });
});
