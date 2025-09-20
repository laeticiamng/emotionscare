import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { create } from 'zustand';

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
});
