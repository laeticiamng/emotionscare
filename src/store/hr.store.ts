import { create } from 'zustand';
import { logger } from '@/lib/logger';

import { createImmutableStore } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type HRSource = 'ble' | 'sim';

export type HRReading = {
  bpm: number;      // 30..220, validated
  ts: number;       // ms
  source: HRSource;
};

interface HRState {
  bpm: number | null;
  source: HRSource;
  connected: boolean;
  connecting: boolean;
  device: any | null; // BluetoothDevice
  characteristic: any | null; // BluetoothRemoteGATTCharacteristic
  readings: HRReading[];
  avgBpm: number | null;
  sessionStart: number | null;
  reducedMotion: boolean;
  error: string | null;
  isSupported: boolean;
}

interface HRActions {
  setBpm: (bpm: number | null) => void;
  setSource: (source: HRSource) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setDevice: (device: any | null) => void;
  setCharacteristic: (characteristic: any | null) => void;
  addReading: (reading: HRReading) => void;
  updateAvgBpm: () => void;
  startSession: () => void;
  endSession: () => void;
  setReducedMotion: (reduced: boolean) => void;
  setError: (error: string | null) => void;
  setSupported: (supported: boolean) => void;
  reset: () => void;
}

type HRStore = HRState & HRActions;

const initialState: HRState = {
  bpm: null,
  source: 'sim',
  connected: false,
  connecting: false,
  device: null,
  characteristic: null,
  readings: [],
  avgBpm: null,
  sessionStart: null,
  reducedMotion: false,
  error: null,
  isSupported: typeof navigator !== 'undefined' && 'bluetooth' in navigator,
};

const hrStoreBase = create<HRStore>()(
  createImmutableStore(
    (set, get) => ({
      ...initialState,

      setBpm: (bpm: number | null) => {
        if (bpm !== null && (bpm < 30 || bpm > 220)) {
          logger.warn('Invalid BPM value', { bpm }, 'SYSTEM');
          return;
        }
        set({ bpm });
      },

      setSource: (source: HRSource) => set({ source }),
      setConnected: (connected: boolean) => set({ connected }),
      setConnecting: (connecting: boolean) => set({ connecting }),
      setDevice: (device: any | null) => set({ device }),
      setCharacteristic: (characteristic: any | null) => set({ characteristic }),

      addReading: (reading: HRReading) => {
        const state = get();
        const newReadings = [...state.readings, reading];

        if (newReadings.length > 50) {
          newReadings.shift();
        }

        set({ readings: newReadings });
        get().updateAvgBpm();
      },

      updateAvgBpm: () => {
        const state = get();
        if (state.readings.length === 0) {
          set({ avgBpm: null });
          return;
        }

        const alpha = 0.1;
        let ema = state.readings[0].bpm;

        for (let i = 1; i < state.readings.length; i++) {
          ema = alpha * state.readings[i].bpm + (1 - alpha) * ema;
        }

        set({ avgBpm: Math.round(ema) });
      },

      startSession: () => set({ sessionStart: Date.now(), readings: [] }),
      endSession: () => set({ sessionStart: null }),
      setReducedMotion: (reducedMotion: boolean) => set({ reducedMotion }),
      setError: (error: string | null) => set({ error }),
      setSupported: (isSupported: boolean) => set({ isSupported }),

      reset: () => {
        const { reducedMotion, isSupported } = get();
        set({
          ...initialState,
          reducedMotion,
          isSupported,
        });
      },
    }),
    {
      persist: {
        name: 'hr-store',
        partialize: (state) => ({
          reducedMotion: state.reducedMotion,
        }),
      },
    }
  )
);

export const useHRStore = createSelectors(hrStoreBase);
