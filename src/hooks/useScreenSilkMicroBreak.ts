/**
 * Hook for Screen Silk Micro-breaks - Pauses visuelles
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Types
export interface SilkPattern {
  id: string;
  name: string;
  description: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  icon: string;
}

export interface SilkTheme {
  id: string;
  name: string;
  colors: { primary: string; secondary: string; background: string };
}

export interface SilkSession {
  id: string;
  pattern: SilkPattern;
  theme: SilkTheme;
  startedAt: Date;
  completedAt?: Date;
  blinkCount: number;
  interrupted: boolean;
  label?: 'gain' | 'léger' | 'incertain';
}

export interface SilkStats {
  totalSessions: number;
  completedSessions: number;
  totalBreakMinutes: number;
  averageDuration: number;
  completionRate: number;
  currentStreak: number;
  bestStreak: number;
}

const DEFAULT_PATTERNS: SilkPattern[] = [
  { id: 'gentle-waves', name: 'Vagues Douces', description: 'Mouvements fluides', duration: 60, intensity: 'low', icon: '🌊' },
  { id: 'breathing-circle', name: 'Cercle Respirant', description: 'Expansion synchronisée', duration: 120, intensity: 'medium', icon: '⭕' },
  { id: 'aurora-flow', name: 'Flux Aurora', description: 'Lumières nordiques', duration: 180, intensity: 'low', icon: '🌌' },
  { id: 'focus-pulse', name: 'Pulse Focus', description: 'Battements rythmiques', duration: 90, intensity: 'medium', icon: '💫' },
  { id: 'zen-garden', name: 'Jardin Zen', description: 'Motifs méditatifs', duration: 150, intensity: 'low', icon: '🪷' }
];

const DEFAULT_THEMES: SilkTheme[] = [
  { id: 'ocean', name: 'Océan', colors: { primary: '#0ea5e9', secondary: '#0284c7', background: '#0c4a6e' } },
  { id: 'forest', name: 'Forêt', colors: { primary: '#22c55e', secondary: '#16a34a', background: '#14532d' } },
  { id: 'sunset', name: 'Coucher de Soleil', colors: { primary: '#f97316', secondary: '#ea580c', background: '#7c2d12' } },
  { id: 'midnight', name: 'Minuit', colors: { primary: '#8b5cf6', secondary: '#7c3aed', background: '#1e1b4b' } }
];

export function useScreenSilkMicroBreak() {
  const [patterns] = useState(DEFAULT_PATTERNS);
  const [themes] = useState(DEFAULT_THEMES);
  const [selectedPattern, setSelectedPattern] = useState<SilkPattern | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEMES[0]);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [blinkCount, setBlinkCount] = useState(0);
  const [stats, setStats] = useState<SilkStats>({ totalSessions: 0, completedSessions: 0, totalBreakMinutes: 0, averageDuration: 0, completionRate: 0, currentStreak: 0, bestStreak: 0 });
  const [sessionHistory, setSessionHistory] = useState<SilkSession[]>([]);
  const [currentSession, setCurrentSession] = useState<SilkSession | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const blinkRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('silk-stats');
    const history = localStorage.getItem('silk-history');
    if (saved) setStats(JSON.parse(saved));
    if (history) setSessionHistory(JSON.parse(history));
  }, []);

  const startSession = useCallback(() => {
    if (!selectedPattern) return;
    const session: SilkSession = { id: crypto.randomUUID(), pattern: selectedPattern, theme: selectedTheme, startedAt: new Date(), blinkCount: 0, interrupted: false };
    setCurrentSession(session);
    setIsSessionActive(true);
    setTimeRemaining(selectedPattern.duration);
    setBlinkCount(0);
    timerRef.current = setInterval(() => setTimeRemaining(t => Math.max(0, t - 1)), 1000);
    blinkRef.current = setInterval(() => setBlinkCount(c => c + 1), 4000);
  }, [selectedPattern, selectedTheme]);

  const pauseSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (blinkRef.current) clearInterval(blinkRef.current);
    setIsPaused(true);
  }, []);

  const resumeSession = useCallback(() => {
    setIsPaused(false);
    timerRef.current = setInterval(() => setTimeRemaining(t => Math.max(0, t - 1)), 1000);
    blinkRef.current = setInterval(() => setBlinkCount(c => c + 1), 4000);
  }, []);

  const completeSession = useCallback((label: 'gain' | 'léger' | 'incertain') => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (blinkRef.current) clearInterval(blinkRef.current);
    const completed = { ...currentSession!, completedAt: new Date(), blinkCount, label, interrupted: false };
    const newHistory = [...sessionHistory, completed];
    const newStats = { ...stats, totalSessions: stats.totalSessions + 1, completedSessions: stats.completedSessions + 1, currentStreak: stats.currentStreak + 1, bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1), totalBreakMinutes: stats.totalBreakMinutes + (selectedPattern?.duration || 0) / 60, completionRate: ((stats.completedSessions + 1) / (stats.totalSessions + 1)) * 100, averageDuration: (stats.totalBreakMinutes + (selectedPattern?.duration || 0) / 60) / (stats.completedSessions + 1) };
    setStats(newStats);
    setSessionHistory(newHistory);
    localStorage.setItem('silk-stats', JSON.stringify(newStats));
    localStorage.setItem('silk-history', JSON.stringify(newHistory.slice(-50)));
    setIsSessionActive(false);
    setCurrentSession(null);
  }, [currentSession, blinkCount, sessionHistory, stats, selectedPattern]);

  const interruptSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (blinkRef.current) clearInterval(blinkRef.current);
    const newStats = { ...stats, totalSessions: stats.totalSessions + 1, currentStreak: 0 };
    setStats(newStats);
    localStorage.setItem('silk-stats', JSON.stringify(newStats));
    setIsSessionActive(false);
    setCurrentSession(null);
  }, [stats]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); if (blinkRef.current) clearInterval(blinkRef.current); }, []);

  return { patterns, themes, selectedPattern, selectedTheme, isSessionActive, isPaused, timeRemaining, blinkCount, stats, sessionHistory, selectPattern: setSelectedPattern, selectTheme: setSelectedTheme, startSession, pauseSession, resumeSession, completeSession, interruptSession };
}
