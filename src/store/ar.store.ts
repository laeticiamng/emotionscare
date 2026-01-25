import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type Emotion = 'joy' | 'calm' | 'sad' | 'anger' | 'fear' | 'surprise' | 'neutral';

export type VisionReading = {
  emotion: Emotion;
  confidence: number; // 0..1
  ts: number;
};

export type ARSource = 'camera' | 'fallback';

interface ARState {
  active: boolean;
  hasCamera: boolean;
  cameraPermission: 'granted' | 'denied' | 'prompt';
  currentEmotion: VisionReading | null;
  sessionId: string | null;
  wsUrl: string | null;
  isConnected: boolean;
  source: ARSource;
  deviceId: string | null;
  reducedMotion: boolean;
  comment: string | null;
  error: string | null;
}

interface ARActions {
  setActive: (active: boolean) => void;
  setHasCamera: (hasCamera: boolean) => void;
  setCameraPermission: (permission: 'granted' | 'denied' | 'prompt') => void;
  setCurrentEmotion: (emotion: VisionReading | null) => void;
  setSessionData: (sessionId: string, wsUrl: string) => void;
  setConnected: (connected: boolean) => void;
  setSource: (source: ARSource) => void;
  setDeviceId: (deviceId: string | null) => void;
  setReducedMotion: (reduced: boolean) => void;
  setComment: (comment: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type ARStore = ARState & ARActions;

const initialState: ARState = {
  active: false,
  hasCamera: false,
  cameraPermission: 'prompt',
  currentEmotion: null,
  sessionId: null,
  wsUrl: null,
  isConnected: false,
  source: 'camera',
  deviceId: null,
  reducedMotion: false,
  comment: null,
  error: null,
};

const useARStoreBase = create<ARStore>()(
  persist(
    (set, _get) => ({
      ...initialState,
      
      setActive: (active: boolean) => {
        set({ active });
      },
      
      setHasCamera: (hasCamera: boolean) => {
        set({ hasCamera });
      },
      
      setCameraPermission: (cameraPermission: 'granted' | 'denied' | 'prompt') => {
        set({ cameraPermission });
      },
      
      setCurrentEmotion: (currentEmotion: VisionReading | null) => {
        set({ currentEmotion });
      },
      
      setSessionData: (sessionId: string, wsUrl: string) => {
        set({ sessionId, wsUrl });
      },
      
      setConnected: (isConnected: boolean) => {
        set({ isConnected });
      },
      
      setSource: (source: ARSource) => {
        set({ source });
      },
      
      setDeviceId: (deviceId: string | null) => {
        set({ deviceId });
      },
      
      setReducedMotion: (reducedMotion: boolean) => {
        set({ reducedMotion });
      },
      
      setComment: (comment: string | null) => {
        set({ comment });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
      
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'ar-store',
      partialize: (state) => ({
        reducedMotion: state.reducedMotion,
        deviceId: state.deviceId,
      }),
    }
  )
);

export const useARStore = createSelectors(useARStoreBase);
