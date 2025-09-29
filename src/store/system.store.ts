import { create } from 'zustand';

export type HealthState = 'online' | 'degraded' | 'offline';

export interface ServiceMap {
  [key: string]: boolean;
}

export interface Healthz {
  ok: boolean;
  version?: string;
  services?: ServiceMap;
}

interface SystemState {
  healthState: HealthState;
  version?: string;
  services?: ServiceMap;
  lastChecked?: number;
  loading: boolean;
  
  // Actions
  setHealthState: (state: HealthState) => void;
  setVersion: (version?: string) => void;
  setServices: (services?: ServiceMap) => void;
  setLastChecked: (timestamp: number) => void;
  setLoading: (loading: boolean) => void;
  updateHealth: (healthz: Healthz) => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  healthState: 'online',
  version: undefined,
  services: undefined,
  lastChecked: undefined,
  loading: false,
  
  setHealthState: (healthState) => set({ healthState }),
  setVersion: (version) => set({ version }),
  setServices: (services) => set({ services }),
  setLastChecked: (lastChecked) => set({ lastChecked }),
  setLoading: (loading) => set({ loading }),
  
  updateHealth: (healthz) => {
    const { ok, version, services } = healthz;
    
    let newState: HealthState;
    
    if (!ok) {
      newState = 'offline';
    } else if (services) {
      // Check if any service is down
      const serviceValues = Object.values(services);
      const allOnline = serviceValues.every(status => status === true);
      newState = allOnline ? 'online' : 'degraded';
    } else {
      newState = 'online';
    }
    
    const currentState = get().healthState;
    
    set({
      healthState: newState,
      version,
      services,
      lastChecked: Date.now()
    });
    
    // Analytics for state changes
    if (currentState !== newState && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'health_state_change', {
        custom_from: currentState,
        custom_to: newState
      });
    }
    
    // Version tracking
    if (version && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'health_version', {
        custom_version: version
      });
    }
  },
}));