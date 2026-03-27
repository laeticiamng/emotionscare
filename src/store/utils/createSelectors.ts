// @ts-nocheck
import { useStore } from 'zustand';
import type { StoreApi } from 'zustand';

type ExtractState<TStore> = TStore extends { getState: () => infer TState } ? TState : never;

type UseSelectors<TStore extends StoreApi<object>> = TStore & {
  use: {
    [K in keyof ExtractState<TStore>]: () => ExtractState<TStore>[K];
  };
};

export const createSelectors = <TStore extends StoreApi<object>>(store: TStore) => {
  const useBoundStore = store as unknown as UseSelectors<TStore>;
  useBoundStore.use = useBoundStore.use ?? ({} as UseSelectors<TStore>['use']);

  const state = store.getState();
  (Object.keys(state) as Array<keyof ExtractState<TStore>>).forEach((key) => {
    Object.defineProperty(useBoundStore.use, key, {
      configurable: false,
      enumerable: true,
      get: () => () => useStore(store, (state) => state[key]),
    });
  });

  return useBoundStore;
};
