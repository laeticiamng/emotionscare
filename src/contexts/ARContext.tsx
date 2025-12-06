/**
 * AR Context - Phase 4.5
 * Global AR state management
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ARSessionConfig, AuraVisualization, BreathingPattern } from '@/services/arService';

export interface ARContextType {
  // Session state
  isARSupported: boolean;
  sessionActive: boolean;
  sessionConfig: ARSessionConfig | null;
  setSessionConfig: (config: ARSessionConfig) => void;

  // Experience state
  currentExperience: 'aura' | 'breathing' | 'bubbles' | 'music' | null;
  setCurrentExperience: (experience: 'aura' | 'breathing' | 'bubbles' | 'music' | null) => void;

  // Aura state
  aura: AuraVisualization | null;
  setAura: (aura: AuraVisualization | null) => void;

  // Breathing state
  breathingPattern: BreathingPattern | null;
  setBreathingPattern: (pattern: BreathingPattern | null) => void;
  breathingCyclesCompleted: number;
  setBreathingCyclesCompleted: (cycles: number) => void;

  // Bubbles state
  bubblesScore: number;
  setBubblesScore: (score: number) => void;
  bubblePopCount: number;
  setBubblePopCount: (count: number) => void;

  // Music state
  currentVisualTheme: 'galaxy' | 'waves' | 'particles';
  setCurrentVisualTheme: (theme: 'galaxy' | 'waves' | 'particles') => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;

  // Performance state
  fps: number;
  setFps: (fps: number) => void;
  memoryUsage: number;
  setMemoryUsage: (usage: number) => void;

  // UI state
  showDebugPanel: boolean;
  setShowDebugPanel: (show: boolean) => void;
  arMode: 'immersive' | 'fallback';
  setARMode: (mode: 'immersive' | 'fallback') => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;

  // Reset function
  resetAR: () => void;
}

const ARContext = createContext<ARContextType | undefined>(undefined);

export interface ARProviderProps {
  children: React.ReactNode;
}

export function ARProvider({ children }: ARProviderProps) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionConfig, setSessionConfig] = useState<ARSessionConfig | null>(null);
  const [currentExperience, setCurrentExperience] = useState<
    'aura' | 'breathing' | 'bubbles' | 'music' | null
  >(null);

  const [aura, setAura] = useState<AuraVisualization | null>(null);
  const [breathingPattern, setBreathingPattern] = useState<BreathingPattern | null>(null);
  const [breathingCyclesCompleted, setBreathingCyclesCompleted] = useState(0);

  const [bubblesScore, setBubblesScore] = useState(0);
  const [bubblePopCount, setBubblePopCount] = useState(0);

  const [currentVisualTheme, setCurrentVisualTheme] = useState<'galaxy' | 'waves' | 'particles'>(
    'galaxy'
  );
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const [fps, setFps] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState(0);

  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [arMode, setARMode] = useState<'immersive' | 'fallback'>('fallback');

  const [error, setError] = useState<string | null>(null);

  const resetAR = useCallback(() => {
    setSessionActive(false);
    setSessionConfig(null);
    setCurrentExperience(null);
    setAura(null);
    setBreathingPattern(null);
    setBreathingCyclesCompleted(0);
    setBubblesScore(0);
    setBubblePopCount(0);
    setIsMusicPlaying(false);
    setFps(60);
    setMemoryUsage(0);
    setError(null);
  }, []);

  const value: ARContextType = {
    isARSupported,
    sessionActive,
    sessionConfig,
    setSessionConfig,

    currentExperience,
    setCurrentExperience,

    aura,
    setAura,

    breathingPattern,
    setBreathingPattern,
    breathingCyclesCompleted,
    setBreathingCyclesCompleted,

    bubblesScore,
    setBubblesScore,
    bubblePopCount,
    setBubblePopCount,

    currentVisualTheme,
    setCurrentVisualTheme,
    isMusicPlaying,
    setIsMusicPlaying,

    fps,
    setFps,
    memoryUsage,
    setMemoryUsage,

    showDebugPanel,
    setShowDebugPanel,
    arMode,
    setARMode,

    error,
    setError,

    resetAR
  };

  return <ARContext.Provider value={value}>{children}</ARContext.Provider>;
}

/**
 * Hook to use AR context
 */
export function useAR(): ARContextType {
  const context = useContext(ARContext);

  if (context === undefined) {
    throw new Error('useAR must be used within an ARProvider');
  }

  return context;
}
