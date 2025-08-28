import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  device: BluetoothDevice | null;
  characteristic: BluetoothRemoteGATTCharacteristic | null;
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
  setDevice: (device: BluetoothDevice | null) => void;
  setCharacteristic: (characteristic: BluetoothRemoteGATTCharacteristic | null) => void;
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

export const useHRStore = create<HRStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setBpm: (bpm: number | null) => {
        // Validate BPM range
        if (bpm !== null && (bpm < 30 || bpm > 220)) {
          console.warn('Invalid BPM value:', bpm);
          return;
        }
        set({ bpm });
      },
      
      setSource: (source: HRSource) => {
        set({ source });
      },
      
      setConnected: (connected: boolean) => {
        set({ connected });
      },
      
      setConnecting: (connecting: boolean) => {
        set({ connecting });
      },
      
      setDevice: (device: BluetoothDevice | null) => {
        set({ device });
      },
      
      setCharacteristic: (characteristic: BluetoothRemoteGATTCharacteristic | null) => {
        set({ characteristic });
      },
      
      addReading: (reading: HRReading) => {
        const state = get();
        const newReadings = [...state.readings, reading];
        
        // Keep only last 50 readings for memory efficiency
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
        
        // Calculate EMA (Exponential Moving Average)
        const alpha = 0.1; // Smoothing factor
        let ema = state.readings[0].bpm;
        
        for (let i = 1; i < state.readings.length; i++) {
          ema = alpha * state.readings[i].bpm + (1 - alpha) * ema;
        }
        
        set({ avgBpm: Math.round(ema) });
      },
      
      startSession: () => {
        set({ sessionStart: Date.now(), readings: [] });
      },
      
      endSession: () => {
        set({ sessionStart: null });
      },
      
      setReducedMotion: (reducedMotion: boolean) => {
        set({ reducedMotion });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
      
      setSupported: (isSupported: boolean) => {
        set({ isSupported });
      },
      
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
      name: 'hr-store',
      partialize: (state) => ({
        reducedMotion: state.reducedMotion,
      }),
    }
  )
);
