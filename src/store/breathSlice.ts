// @ts-nocheck
import { create } from 'zustand';

export interface FlowWalkData {
  start?: Date;
  steps?: number;
  rpmSeries: number[];
  cadenceSeries: number[];
}

export interface GlowMugData {
  hrPre?: number;
  hrPost?: number;
  mood?: number;
}

export interface BreathState {
  flowWalk: FlowWalkData;
  glowMug: GlowMugData;
  setFlowWalk: (data: Partial<FlowWalkData>) => void;
  reset: () => void;
}

export const useBreathStore = create<BreathState>((set) => ({
  flowWalk: { rpmSeries: [], cadenceSeries: [] },
  glowMug: {},
  setFlowWalk: (data) =>
    set((state) => ({ flowWalk: { ...state.flowWalk, ...data } })),
  reset: () => set({ flowWalk: { rpmSeries: [], cadenceSeries: [] }, glowMug: {} }),
}));
