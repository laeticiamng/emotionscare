// @ts-nocheck
import type { StateCreator } from 'zustand';
import type { AppState } from '../appStore';

export interface UserProfile {
  display_name?: string;
  avatar_url?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
  profile?: UserProfile;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
}

export type AuthSlice = AuthState & AuthActions;

export const createAuthInitialState = (): AuthState => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set) => ({
  ...createAuthInitialState(),
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
});
