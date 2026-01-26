import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSelectors } from './utils/createSelectors';

export interface StimulusSpec {
  kind: 'mail' | 'notif' | 'timer';
  payload: any;
  at: number;
  id: string;
  processed?: boolean;
}

export interface CopingAnswer {
  id: string;
  value: 0 | 1 | 2 | 3;
}

export interface HRVSummary {
  baseline?: number;
  during?: number;
  after?: number;
}

export interface BattleEvent {
  type: 'start' | 'pause' | 'resume' | 'calm' | 'end' | 'error';
  timestamp: number;
  data?: any;
}

type BouncePhase = 'idle' | 'starting' | 'battle' | 'paused' | 'calming' | 'debrief' | 'pairing' | 'completed';
type BattleMode = 'quick' | 'standard' | 'zen' | 'challenge';

interface BounceStoreState {
  battleId: string | null;
  phase: BouncePhase;
  mode: BattleMode;
  stimuli: StimulusSpec[];
  processedStimuli: string[];
  events: BattleEvent[];
  startTime: Date | null;
  endTime: Date | null;
  duration: number; // en secondes
  timeLeft: number;
  calmBoostUsed: boolean;
  calmBoostCount: number;
  wsUrl: string | null;
  wsConnected: boolean;
  copingAnswers: CopingAnswer[];
  hrvSummary: HRVSummary | null;
  coachMessage: string | null;
  pairToken: string | null;
  pairedUser: string | null;
  tipSent: string | null;
  tipReceived: string | null;
}

interface BounceStoreActions {
  setPhase: (phase: BouncePhase) => void;
  setBattleId: (battleId: string) => void;
  setMode: (mode: BattleMode) => void;
  setStimuli: (stimuli: StimulusSpec[]) => void;
  addStimulus: (stimulus: StimulusSpec) => void;
  processStimulus: (stimulusId: string) => void;
  addEvent: (event: BattleEvent) => void;
  startBattle: () => void;
  pauseBattle: () => void;
  resumeBattle: () => void;
  useCalmBoost: () => void;
  endBattle: () => void;
  updateTimeLeft: (timeLeft: number) => void;
  setWsUrl: (wsUrl: string | null) => void;
  setWsConnected: (connected: boolean) => void;
  addCopingAnswer: (answer: CopingAnswer) => void;
  setHRVSummary: (summary: HRVSummary) => void;
  setCoachMessage: (message: string) => void;
  setPairToken: (token: string) => void;
  setPairedUser: (user: string) => void;
  setSentTip: (tip: string) => void;
  setReceivedTip: (tip: string) => void;
  reset: () => void;
}

type BounceStore = BounceStoreState & BounceStoreActions;

const initialState: BounceStoreState = {
  battleId: null,
  phase: 'idle',
  mode: 'standard',
  stimuli: [],
  processedStimuli: [],
  events: [],
  startTime: null,
  endTime: null,
  duration: 0,
  timeLeft: 0,
  calmBoostUsed: false,
  calmBoostCount: 0,
  wsUrl: null,
  wsConnected: false,
  copingAnswers: [],
  hrvSummary: null,
  coachMessage: null,
  pairToken: null,
  pairedUser: null,
  tipSent: null,
  tipReceived: null,
};

const useBounceStoreBase = create<BounceStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setPhase: (phase: BouncePhase) => {
        set({ phase });
      },
      
      setBattleId: (battleId: string) => {
        set({ battleId });
      },
      
      setMode: (mode: BattleMode) => {
        set({ mode });
      },
      
      setStimuli: (stimuli: StimulusSpec[]) => {
        set({ stimuli });
      },
      
      addStimulus: (stimulus: StimulusSpec) => {
        const state = get();
        set({ 
          stimuli: [...state.stimuli, stimulus] 
        });
      },
      
      processStimulus: (stimulusId: string) => {
        const state = get();
        set({
          processedStimuli: [...state.processedStimuli, stimulusId],
          stimuli: state.stimuli.map(s => 
            s.id === stimulusId ? { ...s, processed: true } : s
          )
        });
      },
      
      addEvent: (event: BattleEvent) => {
        const state = get();
        set({ 
          events: [...state.events, event] 
        });
      },
      
      startBattle: () => {
        const now = new Date();
        const state = get();
        // Duration based on mode: quick=90, standard=180, zen=240, challenge=300
        const durationMap: Record<BattleMode, number> = {
          quick: 90,
          standard: 180,
          zen: 240,
          challenge: 300
        };
        const duration = durationMap[state.mode] || 180;
        
        set({
          phase: 'battle',
          startTime: now,
          timeLeft: duration,
          events: [{
            type: 'start',
            timestamp: now.getTime()
          }]
        });
      },
      
      pauseBattle: () => {
        set({
          phase: 'paused'
        });

        get().addEvent({
          type: 'pause',
          timestamp: Date.now()
        });
      },

      resumeBattle: () => {
        set({
          phase: 'battle'
        });
        
        get().addEvent({
          type: 'resume',
          timestamp: Date.now()
        });
      },
      
      useCalmBoost: () => {
        const state = get();
        if (state.calmBoostCount >= 2) return; // Maximum 2 calm boosts
        
        set({
          phase: 'calming',
          calmBoostUsed: true,
          calmBoostCount: state.calmBoostCount + 1
        });
        
        get().addEvent({
          type: 'calm',
          timestamp: Date.now()
        });
        
        // Auto-resume after 20 seconds
        setTimeout(() => {
          const currentState = get();
          if (currentState.phase === 'calming') {
            set({ phase: 'battle' });
          }
        }, 20000);
      },
      
      endBattle: () => {
        const now = new Date();
        const state = get();
        const duration = state.startTime 
          ? (now.getTime() - state.startTime.getTime()) / 1000 
          : 0;
        
        set({
          phase: 'debrief',
          endTime: now,
          duration,
          timeLeft: 0
        });
        
        get().addEvent({
          type: 'end',
          timestamp: now.getTime()
        });
      },
      
      updateTimeLeft: (timeLeft: number) => {
        set({ timeLeft });
        
        // Auto-end when time reaches 0
        if (timeLeft <= 0) {
          get().endBattle();
        }
      },
      
      setWsUrl: (wsUrl: string | null) => {
        set({ wsUrl });
      },
      
      setWsConnected: (connected: boolean) => {
        set({ wsConnected: connected });
      },
      
      addCopingAnswer: (answer: CopingAnswer) => {
        const state = get();
        const existingIndex = state.copingAnswers.findIndex(a => a.id === answer.id);
        
        if (existingIndex >= 0) {
          const updatedAnswers = [...state.copingAnswers];
          updatedAnswers[existingIndex] = answer;
          set({ copingAnswers: updatedAnswers });
        } else {
          set({ 
            copingAnswers: [...state.copingAnswers, answer] 
          });
        }
      },
      
      setHRVSummary: (summary: HRVSummary) => {
        set({ hrvSummary: summary });
      },
      
      setCoachMessage: (message: string) => {
        set({ coachMessage: message });
      },
      
      setPairToken: (token: string) => {
        set({ pairToken: token });
      },
      
      setPairedUser: (user: string) => {
        set({ pairedUser: user });
      },
      
      setSentTip: (tip: string) => {
        set({ tipSent: tip });
      },
      
      setReceivedTip: (tip: string) => {
        set({ tipReceived: tip });
      },
      
      reset: () => {
        set({
          ...initialState,
          mode: get().mode // Keep mode preference
        });
      },
    }),
    {
      name: 'bounce-store',
      partialize: (state) => ({
        mode: state.mode,
        calmBoostCount: state.calmBoostCount,
      }),
    }
  )
);

export const useBounceStore = createSelectors(useBounceStoreBase);
