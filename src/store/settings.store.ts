import { create } from 'zustand';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';
import {
  safeClassAdd,
  safeClassRemove,
  safeGetDocumentRoot
} from '@/lib/safe-helpers';

export type Theme = 'system' | 'light' | 'dark';

export type A11y = {
  reduced_motion: boolean;
  high_contrast: boolean;
  font_scale: number;
  dyslexic_font: boolean;
};

export type Profile = {
  display_name?: string;
  language: 'fr' | 'en' | 'auto';
  theme: Theme;
  a11y: A11y;
};

interface SettingsState {
  profile: Profile;
  loading: boolean;
  error: string | null;
  
  // Actions
  setProfile: (profile: Partial<Profile>) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Profile['language']) => void;
  setA11y: (a11y: Partial<A11y>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  applyTheme: () => void;
  applyA11y: () => void;
  reset: () => void;
}

const initialState: Profile = {
  display_name: '',
  language: 'fr',
  theme: 'system',
  a11y: {
    reduced_motion: false,
    high_contrast: false,
    font_scale: 1.0,
    dyslexic_font: false
  }
};

// Apply theme to document
const applyThemeToDocument = (theme: Theme) => {
  if (typeof window === 'undefined') return;

  const root = safeGetDocumentRoot();

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = prefersDark ? 'dark' : 'light';
  } else {
    root.dataset.theme = theme;
  }
};

// Apply accessibility settings to CSS
const applyA11yToDocument = (a11y: A11y) => {
  const root = safeGetDocumentRoot();

  // Reduced motion
  if (a11y.reduced_motion) {
    safeClassAdd(root, 'reduced-motion');
  } else {
    safeClassRemove(root, 'reduced-motion');
  }

  // High contrast
  if (a11y.high_contrast) {
    safeClassAdd(root, 'high-contrast');
  } else {
    safeClassRemove(root, 'high-contrast');
  }

  // Font scale
  root.style.setProperty('--font-scale', a11y.font_scale.toString());

  // Dyslexic font
  if (a11y.dyslexic_font) {
    safeClassAdd(root, 'dyslexic-font');
  } else {
    safeClassRemove(root, 'dyslexic-font');
  }
};

const useSettingsStoreBase = create<SettingsState>()(
  persist(
    (set, get) => ({
      profile: initialState,
      loading: false,
      error: null,
      
      setProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates }
        }));
        
        // Apply changes immediately
        const newProfile = { ...get().profile, ...updates };
        if (updates.theme) {
          applyThemeToDocument(newProfile.theme);
        }
        if (updates.a11y) {
          applyA11yToDocument(newProfile.a11y);
        }
      },
      
      setTheme: (theme) => {
        set((state) => ({
          profile: { ...state.profile, theme }
        }));
        applyThemeToDocument(theme);
      },
      
      setLanguage: (language) => {
        set((state) => ({
          profile: { ...state.profile, language }
        }));
      },
      
      setA11y: (updates) => {
        set((state) => ({
          profile: {
            ...state.profile,
            a11y: { ...state.profile.a11y, ...updates }
          }
        }));
        applyA11yToDocument({ ...get().profile.a11y, ...updates });
      },
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      applyTheme: () => {
        const { theme } = get().profile;
        applyThemeToDocument(theme);
      },
      
      applyA11y: () => {
        const { a11y } = get().profile;
        applyA11yToDocument(a11y);
      },
      
      reset: () => {
        set({ profile: initialState, loading: false, error: null });
        applyThemeToDocument(initialState.theme);
        applyA11yToDocument(initialState.a11y);
      }
    }),
    {
      name: 'settings-storage',
    }
  )
);

export const useSettingsStore = createSelectors(useSettingsStoreBase);
