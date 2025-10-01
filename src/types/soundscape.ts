// @ts-nocheck

export interface SoundscapeContextType {
  isEnabled: boolean;
  volume: number;
  currentTheme: string | null;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  playTheme: (theme: string) => void;
  stopTheme: () => void;
  
  // Add missing properties
  playFunctionalSound: (soundType: string) => void;
}
