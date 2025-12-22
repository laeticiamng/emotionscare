import { create } from 'zustand';
import dayjs from 'dayjs';
import { fetchUserWeekly, fetchOrgWeekly, type BreathRow, type BreathOrgRow } from '@/services/breathApi';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface BreathDataStore {
  userWeekly?: CacheEntry<BreathRow[]>;
  orgWeekly: Record<string, CacheEntry<BreathOrgRow[]>>;
  getUserWeekly: (since?: dayjs.Dayjs) => Promise<BreathRow[]>;
  getOrgWeekly: (orgId: string, since?: dayjs.Dayjs) => Promise<BreathOrgRow[]>;
}

const FIVE_MIN = 5 * 60 * 1000;

export const useBreathDataStore = create<BreathDataStore>((set, get) => ({
  orgWeekly: {},
  async getUserWeekly(since) {
    const cache = get().userWeekly;
    if (cache && Date.now() - cache.timestamp < FIVE_MIN) {
      return cache.data;
    }
    const data = await fetchUserWeekly(since?.format('YYYY-MM-DD'));
    set({ userWeekly: { data, timestamp: Date.now() } });
    return data;
  },
  async getOrgWeekly(orgId, since) {
    const cache = get().orgWeekly[orgId];
    if (cache && Date.now() - cache.timestamp < FIVE_MIN) {
      return cache.data;
    }
    const data = await fetchOrgWeekly(orgId, since?.format('YYYY-MM-DD'));
    set(state => ({
      orgWeekly: { ...state.orgWeekly, [orgId]: { data, timestamp: Date.now() } }
    }));
    return data;
  }
}));
