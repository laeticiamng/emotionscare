import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type ChannelPrefs = {
  push: boolean;
  email: boolean;
  tz: string;
  quiet_hours: {
    start: string;
    end: string;
  };
};

export type ReminderKind = 'boss_grit' | 'screen_silk' | 'flash_glow' | 'journal' | 'vr_breath' | 'music_therapy';

export type Reminder = {
  id: string;
  kind: ReminderKind;
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  time: string; // "HH:mm" local
  window?: { start: string; end: string }; // optionnel, ex 10:00-18:00
  interval_min?: number; // ex 120 (toutes les 2h)
  enabled: boolean;
};

interface NotifyState {
  prefs: ChannelPrefs;
  reminders: Reminder[];
  hasPermission: boolean;
  subscriptionId: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setPrefs: (prefs: Partial<ChannelPrefs>) => void;
  setReminders: (reminders: Reminder[]) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  removeReminder: (id: string) => void;
  setPermission: (hasPermission: boolean) => void;
  setSubscriptionId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  prefs: {
    push: false,
    email: false,
    tz: 'Europe/Paris',
    quiet_hours: {
      start: '22:00',
      end: '07:00'
    }
  },
  reminders: [],
  hasPermission: false,
  subscriptionId: null,
  loading: false,
  error: null
};

const useNotifyStoreBase = create<NotifyState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setPrefs: (newPrefs) => {
        set((state) => ({
          prefs: { ...state.prefs, ...newPrefs }
        }));
      },
      
      setReminders: (reminders) => {
        set({ reminders });
      },
      
      addReminder: (reminder) => {
        set((state) => ({
          reminders: [...state.reminders, reminder]
        }));
      },
      
      updateReminder: (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((r) => 
            r.id === id ? { ...r, ...updates } : r
          )
        }));
      },
      
      removeReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id)
        }));
      },
      
      setPermission: (hasPermission) => {
        set({ hasPermission });
      },
      
      setSubscriptionId: (subscriptionId) => {
        set({ subscriptionId });
      },
      
      setLoading: (loading) => {
        set({ loading });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'notify-storage',
      partialize: (state) => ({
        prefs: state.prefs,
        hasPermission: state.hasPermission,
        subscriptionId: state.subscriptionId
      })
    }
  )
);

export const useNotifyStore = createSelectors(useNotifyStoreBase);
