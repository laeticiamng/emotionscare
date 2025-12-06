import type { StateCreator, StoreApi } from 'zustand';
import { logger } from '@/lib/logger';

type ImmutableSet<T extends object> = (
  partial: Partial<T> | ((state: T) => Partial<T>),
  replace?: boolean,
) => void;

type ImmutableCreator<T extends object> = (
  set: ImmutableSet<T>,
  get: () => T,
  api: StoreApi<T>,
) => T;

interface PersistedPayload<T extends object> {
  state: Partial<T>;
  version: number;
}

export interface PersistOptions<T extends object> {
  name: string;
  storage?: () => Storage;
  partialize?: (state: T) => Partial<T>;
  version?: number;
  migrate?: (persistedState: Partial<T> | undefined, version: number) => Partial<T>;
}

export interface ImmutableStoreOptions<T extends object> {
  persist?: PersistOptions<T>;
}

const toSerializable = <T extends object>(state: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function'),
  ) as Partial<T>;
};

const resolveStorage = (factory?: () => Storage) => {
  if (typeof window === 'undefined') return undefined;
  try {
    return factory ? factory() : window.localStorage;
  } catch {
    return undefined;
  }
};

const parsePersistedState = <T extends object>(
  raw: string | null,
): PersistedPayload<T> | undefined => {
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as PersistedPayload<T> | Partial<T>;

    if (parsed && 'state' in parsed && 'version' in parsed) {
      return parsed as PersistedPayload<T>;
    }

    return {
      state: parsed as Partial<T>,
      version: 0,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.warn('Unable to parse stored value', error, 'SYSTEM');
    }

    return undefined;
  }
};

export const createImmutableStore = <T extends object>(
  initializer: ImmutableCreator<T>,
  options?: ImmutableStoreOptions<T>,
): StateCreator<T, [], []> => {
  return (set, get, api) => {
    const persistOptions = options?.persist;
    const storage = persistOptions ? resolveStorage(persistOptions.storage) : undefined;

    if (persistOptions) {
      Object.defineProperty(api, 'persist', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {
          getOptions: () => persistOptions,
        },
      });
    }

    const persistSnapshot = (state: T) => {
      if (!persistOptions || !storage) return;

      try {
        const snapshot = persistOptions.partialize
          ? persistOptions.partialize(state)
          : toSerializable(state);

        const payload: PersistedPayload<T> = {
          state: snapshot,
          version: persistOptions.version ?? 0,
        };

        storage.setItem(persistOptions.name, JSON.stringify(payload));
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          logger.warn('Unable to store state', { name: persistOptions.name, error }, 'SYSTEM');
        }
      }
    };

    const immutableSet: typeof set = (partial, replace) => {
      const currentState = get();
      const partialState =
        typeof partial === 'function'
          ? (partial as (state: T) => Partial<T>)(currentState)
          : (partial as Partial<T>);

      const nextState = replace
        ? (partialState as T)
        : ({ ...currentState, ...partialState } as T);

      set(nextState as T, true);
      persistSnapshot(nextState);
    };

    let state = initializer(immutableSet, get, api);

    if (persistOptions && storage) {
      const payload = parsePersistedState<T>(storage.getItem(persistOptions.name));

      if (payload) {
        const migrated = persistOptions.migrate
          ? persistOptions.migrate(payload.state, payload.version)
          : payload.state;

        state = { ...state, ...migrated };
      } else {
        persistSnapshot(state);
      }
    }

    return state;
  };
};

export const persist = <T extends object>(
  initializer: ImmutableCreator<T>,
  options: PersistOptions<T>,
) => createImmutableStore(initializer, { persist: options });
