// @ts-nocheck
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { create } from 'zustand';

import { persist } from './createImmutableStore';

import { createSelectors } from './createSelectors';

describe('createSelectors', () => {
  it('exposes a hook per state key that stays in sync', () => {
    const initialState = {
      count: 1,
      label: 'initial',
    } as const;
    const baseStore = create(() => ({ ...initialState }));

    const enhanced = createSelectors(baseStore);

    const { result: countHook } = renderHook(() => enhanced.use.count());
    const { result: labelHook } = renderHook(() => enhanced.use.label());

    expect(countHook.current).toBe(1);
    expect(labelHook.current).toBe('initial');

    act(() => {
      enhanced.setState({ count: 5, label: 'updated' });
    });

    expect(countHook.current).toBe(5);
    expect(labelHook.current).toBe('updated');
  });

  it('defines selector getters only once per key', () => {
    const baseStore = create(() => ({
      ready: true,
      value: 42,
    }));

    const enhanced = createSelectors(baseStore);
    const keys = Object.keys(enhanced.use).sort();

    expect(keys).toEqual(['ready', 'value']);
    const descriptor = Object.getOwnPropertyDescriptor(enhanced.use, 'ready');
    expect(descriptor?.get).toBeDefined();

    const firstGetter = descriptor?.get;
    const { get: secondGetter } = Object.getOwnPropertyDescriptor(createSelectors(baseStore).use, 'ready') ?? {};

    expect(secondGetter).toBe(firstGetter);
  });

  it('keeps persisted stores compatible with the selector facade', () => {
    localStorage.clear();

    const persistOptions = { name: 'selectors-test' } as const;

    const baseStore = create(
      persist(
        (set) => ({
          count: 0,
          increment: () => set((state) => ({ count: state.count + 1 })),
        }),
        persistOptions,
      ),
    );

    const enhanced = createSelectors(baseStore);
    const { result } = renderHook(() => enhanced.use.count());

    expect(result.current).toBe(0);

    act(() => {
      enhanced.getState().increment();
    });

    expect(result.current).toBe(1);
    expect((enhanced as unknown as { persist?: { getOptions: () => unknown } }).persist?.getOptions()).toEqual(
      persistOptions,
    );
    expect(localStorage.getItem('selectors-test')).toContain('"count":1');
  });

  it('exposes read-only selectors backed by getters', () => {
    let status: 'idle' | 'ready' = 'idle';

    const baseStore = create(() => {
      const state: { toggle: () => void; version: number } & { status: string } = {
        version: 1,
        toggle: () => {
          status = status === 'idle' ? 'ready' : 'idle';
        },
        status: 'idle',
      } as never;

      Object.defineProperty(state, 'status', {
        enumerable: true,
        configurable: false,
        get: () => status,
      });

      return state;
    });

    const enhanced = createSelectors(baseStore);
    const { result } = renderHook(() => enhanced.use.status());

    expect(result.current).toBe('idle');

    act(() => {
      baseStore.getState().toggle();
      baseStore.setState({ version: baseStore.getState().version + 1 });
    });

    expect(result.current).toBe('ready');
  });
});
