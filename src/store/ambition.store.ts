// @ts-nocheck
import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export interface Upgrade {
  id: string;
  name: string;
  icon: string;
  path: 'vision' | 'discipline' | 'network' | 'craft';
  unlocked: boolean;
  cost?: number;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  estMinutes: number;
  flavor: string;
  status: 'available' | 'active' | 'completed';
  xpReward: number;
}

export interface Artifact {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic';
  description: string;
  icon: string;
  obtainedAt?: Date;
}

export interface PNJ {
  id: string;
  name: string;
  avatar: string;
  line: string;
  choices?: Array<{ id: string; text: string; value: number }>;
  isActive: boolean;
}

type AmbitionPhase = 'idle' | 'onboarding' | 'dialog' | 'questSelection' | 'questRunning' | 'questResult' | 'hub';

interface AmbitionStoreState {
  runId: string | null;
  phase: AmbitionPhase;
  currentObjective: string | null;
  objectiveSuggestions: string[];
  activePNJ: PNJ | null;
  upgrades: Upgrade[];
  quests: Quest[];
  artifacts: Artifact[];
  inventory: Artifact[];
  currentXP: number;
  totalXP: number;
  isFirstTime: boolean;
  activeQuestId: string | null;
  questStartTime: Date | null;
}

interface AmbitionStoreActions {
  setPhase: (phase: AmbitionPhase) => void;
  setRunId: (runId: string) => void;
  setObjective: (objective: string) => void;
  setSuggestions: (suggestions: string[]) => void;
  setActivePNJ: (pnj: PNJ | null) => void;
  addUpgrade: (upgrade: Upgrade) => void;
  unlockUpgrade: (upgradeId: string) => void;
  addQuest: (quest: Quest) => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string, success: boolean) => void;
  addArtifact: (artifact: Artifact) => void;
  addXP: (xp: number) => void;
  setFirstTime: (isFirstTime: boolean) => void;
  reset: () => void;
}

type AmbitionStore = AmbitionStoreState & AmbitionStoreActions;

const initialUpgrades: Upgrade[] = [
  {
    id: 'vision-1',
    name: 'Vision Claire',
    icon: '🎯',
    path: 'vision',
    unlocked: false,
    cost: 50,
    description: 'Améliore la clarté de tes objectifs'
  },
  {
    id: 'discipline-1',
    name: 'Rigueur',
    icon: '⚡',
    path: 'discipline',
    unlocked: false,
    cost: 75,
    description: 'Renforce ta discipline personnelle'
  },
  {
    id: 'network-1',
    name: 'Réseau',
    icon: '🤝',
    path: 'network',
    unlocked: false,
    cost: 60,
    description: 'Développe ton réseau professionnel'
  },
  {
    id: 'craft-1',
    name: 'Maîtrise',
    icon: '🛠️',
    path: 'craft',
    unlocked: false,
    cost: 80,
    description: 'Perfectionne tes compétences'
  }
];

const initialState: AmbitionStoreState = {
  runId: null,
  phase: 'idle',
  currentObjective: null,
  objectiveSuggestions: [],
  activePNJ: null,
  upgrades: initialUpgrades,
  quests: [],
  artifacts: [],
  inventory: [],
  currentXP: 0,
  totalXP: 0,
  isFirstTime: true,
  activeQuestId: null,
  questStartTime: null,
};

const useAmbitionStoreBase = create<AmbitionStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setPhase: (phase: AmbitionPhase) => {
        set({ phase });
      },
      
      setRunId: (runId: string) => {
        set({ runId });
      },
      
      setObjective: (objective: string) => {
        set({ currentObjective: objective });
      },
      
      setSuggestions: (suggestions: string[]) => {
        set({ objectiveSuggestions: suggestions });
      },
      
      setActivePNJ: (pnj: PNJ | null) => {
        set({ activePNJ: pnj });
      },
      
      addUpgrade: (upgrade: Upgrade) => {
        const state = get();
        set({ 
          upgrades: [...state.upgrades, upgrade] 
        });
      },
      
      unlockUpgrade: (upgradeId: string) => {
        const state = get();
        const updatedUpgrades = state.upgrades.map(upgrade =>
          upgrade.id === upgradeId 
            ? { ...upgrade, unlocked: true }
            : upgrade
        );
        set({ 
          upgrades: updatedUpgrades,
          currentXP: state.currentXP - (state.upgrades.find(u => u.id === upgradeId)?.cost || 0)
        });
      },
      
      addQuest: (quest: Quest) => {
        const state = get();
        const existingQuest = state.quests.find(q => q.id === quest.id);
        if (!existingQuest) {
          set({ 
            quests: [...state.quests, quest] 
          });
        }
      },
      
      startQuest: (questId: string) => {
        const state = get();
        const updatedQuests = state.quests.map(quest =>
          quest.id === questId 
            ? { ...quest, status: 'active' as const }
            : { ...quest, status: quest.status === 'active' ? 'available' as const : quest.status }
        );
        set({
          quests: updatedQuests,
          activeQuestId: questId,
          questStartTime: new Date(),
          phase: 'questRunning'
        });
      },
      
      completeQuest: (questId: string, success: boolean) => {
        const state = get();
        const quest = state.quests.find(q => q.id === questId);
        if (!quest) return;
        
        const xpGain = success ? quest.xpReward : Math.floor(quest.xpReward * 0.3);
        const updatedQuests = state.quests.map(q =>
          q.id === questId 
            ? { ...q, status: 'completed' as const }
            : q
        );
        
        set({
          quests: updatedQuests,
          activeQuestId: null,
          questStartTime: null,
          currentXP: state.currentXP + xpGain,
          totalXP: state.totalXP + xpGain,
          phase: 'questResult'
        });
      },
      
      addArtifact: (artifact: Artifact) => {
        const state = get();
        const artifactWithDate = { 
          ...artifact, 
          obtainedAt: new Date() 
        };
        set({ 
          artifacts: [...state.artifacts, artifactWithDate],
          inventory: [...state.inventory, artifactWithDate]
        });
      },
      
      addXP: (xp: number) => {
        const state = get();
        set({ 
          currentXP: state.currentXP + xp,
          totalXP: state.totalXP + xp
        });
      },
      
      setFirstTime: (isFirstTime: boolean) => {
        set({ isFirstTime });
      },
      
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'ambition-store',
      partialize: (state) => ({
        runId: state.runId,
        phase: state.phase,
        currentObjective: state.currentObjective,
        upgrades: state.upgrades,
        artifacts: state.artifacts,
        inventory: state.inventory,
        currentXP: state.currentXP,
        totalXP: state.totalXP,
        isFirstTime: state.isFirstTime,
      }),
    }
  )
);

export const useAmbitionStore = createSelectors(useAmbitionStoreBase);
