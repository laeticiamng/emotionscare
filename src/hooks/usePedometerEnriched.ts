/**
 * usePedometer ENRICHED - Hook de podomètre complet
 * Version enrichie avec Supabase persistence
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS (fallback)
// ─────────────────────────────────────────────────────────────

const HISTORY_KEY = 'pedometer-history';
const GOALS_KEY = 'pedometer-goals';
const STATS_KEY = 'pedometer-stats';
const PREFERENCES_KEY = 'pedometer-preferences';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface StepEntry {
  id: string;
  date: string;
  steps: number;
  distance: number; // meters
  calories: number;
  activeMinutes: number;
  cadenceAvg: number;
  cadenceMax: number;
  hourlyBreakdown: Record<number, number>;
}

interface StepGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  startDate: string;
  endDate: string;
  completed: boolean;
  completedAt?: string;
}

interface PedometerStats {
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
  averageDaily: number;
  bestDay: { date: string; steps: number };
  currentStreak: number;
  longestStreak: number;
  goalsCompleted: number;
  activeDays: number;
}

interface PedometerPreferences {
  stepLength: number; // cm
  weight: number; // kg
  dailyGoal: number;
  notifications: boolean;
  hapticFeedback: boolean;
}

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE HELPERS
// ─────────────────────────────────────────────────────────────

function getHistory(): StepEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
}

function saveHistory(history: StepEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 365)));
}

function getGoals(): StepGoal[] {
  try {
    return JSON.parse(localStorage.getItem(GOALS_KEY) || '[]');
  } catch { return []; }
}

function saveGoals(goals: StepGoal[]): void {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

function getStats(): PedometerStats {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  } catch {
    return {
      totalSteps: 0,
      totalDistance: 0,
      totalCalories: 0,
      averageDaily: 0,
      bestDay: { date: '', steps: 0 },
      currentStreak: 0,
      longestStreak: 0,
      goalsCompleted: 0,
      activeDays: 0,
    };
  }
}

function saveStats(stats: PedometerStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function getPreferences(): PedometerPreferences {
  try {
    return {
      stepLength: 75,
      weight: 70,
      dailyGoal: 10000,
      notifications: true,
      hapticFeedback: true,
      ...JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}'),
    };
  } catch {
    return {
      stepLength: 75,
      weight: 70,
      dailyGoal: 10000,
      notifications: true,
      hapticFeedback: true,
    };
  }
}

function savePreferences(prefs: PedometerPreferences): void {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export const usePedometerEnriched = () => {
  const { user } = useAuth();
  const [cadence, setCadence] = useState(0);
  const [steps, setSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [history, setHistory] = useState<StepEntry[]>([]);
  const [goals, setGoals] = useState<StepGoal[]>([]);
  const [stats, setStats] = useState<PedometerStats>(getStats());
  const [preferences, setPreferences] = useState<PedometerPreferences>(getPreferences());
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [hourlySteps, setHourlySteps] = useState<Record<number, number>>({});

  // Load from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', 'pedometer_data')
            .maybeSingle();
          
          if (data?.value) {
            const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
            if (parsed.history) setHistory(parsed.history);
            if (parsed.goals) setGoals(parsed.goals);
            if (parsed.stats) setStats(parsed.stats);
            if (parsed.preferences) setPreferences(parsed.preferences);
            return;
          }
        } catch (error) {
          logger.error('Failed to load pedometer data', error as Error, 'PEDOMETER');
        }
      }
      // Fallback localStorage
      setHistory(getHistory());
      setGoals(getGoals());
    };
    loadData();
  }, [user]);

  // Save to Supabase
  const saveToSupabase = useCallback(async (newHistory?: StepEntry[], newGoals?: StepGoal[], newStats?: PedometerStats) => {
    if (!user) return;
    
    const data = {
      history: newHistory || history,
      goals: newGoals || goals,
      stats: newStats || stats,
      preferences
    };
    
    await supabase.from('user_settings').upsert({
      user_id: user.id,
      key: 'pedometer_data',
      value: JSON.stringify(data),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,key' });
  }, [user, history, goals, stats, preferences]);

  // Calculate distance and calories
  const distance = useMemo(() => 
    Math.round((steps * preferences.stepLength) / 100), // meters
  [steps, preferences.stepLength]);

  const calories = useMemo(() => 
    Math.round(steps * 0.04 * (preferences.weight / 70)), // kcal
  [steps, preferences.weight]);

  // Today's entry
  const todayEntry = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return history.find(h => h.date === today);
  }, [history]);

  // Daily goal progress
  const dailyProgress = useMemo(() => {
    const todaySteps = todayEntry?.steps || steps;
    return Math.min(100, Math.round((todaySteps / preferences.dailyGoal) * 100));
  }, [todayEntry, steps, preferences.dailyGoal]);

  // Simulate cadence (in real app, would use accelerometer)
  useEffect(() => {
    if (!isTracking) return;

    const id = setInterval(() => {
      const newCadence = 60 + Math.round(Math.random() * 40);
      setCadence(newCadence);
      
      // Add steps based on cadence
      const stepsToAdd = Math.round(newCadence / 60);
      setSteps(prev => prev + stepsToAdd);
      
      // Track hourly breakdown
      const hour = new Date().getHours();
      setHourlySteps(prev => ({
        ...prev,
        [hour]: (prev[hour] || 0) + stepsToAdd,
      }));
    }, 1000);

    return () => clearInterval(id);
  }, [isTracking]);

  // Start tracking
  const startTracking = useCallback(() => {
    setIsTracking(true);
    setSessionStart(new Date());
    setSteps(todayEntry?.steps || 0);
    setHourlySteps(todayEntry?.hourlyBreakdown || {});
  }, [todayEntry]);

  // Stop tracking and save
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    setCadence(0);

    if (!sessionStart) return;

    const today = new Date().toISOString().split('T')[0];
    const activeMinutes = Math.round((Date.now() - sessionStart.getTime()) / 60000);

    const entry: StepEntry = {
      id: todayEntry?.id || crypto.randomUUID(),
      date: today,
      steps,
      distance,
      calories,
      activeMinutes: (todayEntry?.activeMinutes || 0) + activeMinutes,
      cadenceAvg: cadence,
      cadenceMax: Math.max(todayEntry?.cadenceMax || 0, cadence),
      hourlyBreakdown: hourlySteps,
    };

    const newHistory = [
      entry,
      ...history.filter(h => h.date !== today),
    ].slice(0, 365);

    setHistory(newHistory);
    saveHistory(newHistory);
    const updatedStats = updateStatsInternal(newHistory);
    checkGoals(steps);
    setSessionStart(null);
    
    // Sync to Supabase
    saveToSupabase(newHistory, undefined, updatedStats);
  }, [sessionStart, todayEntry, steps, distance, calories, cadence, hourlySteps, history, saveToSupabase]);

  // Update stats and return new stats
  const updateStatsInternal = useCallback((historyData: StepEntry[]): PedometerStats => {
    const totalSteps = historyData.reduce((sum, h) => sum + h.steps, 0);
    const totalDistance = historyData.reduce((sum, h) => sum + h.distance, 0);
    const totalCalories = historyData.reduce((sum, h) => sum + h.calories, 0);
    const activeDays = historyData.length;
    const averageDaily = activeDays > 0 ? Math.round(totalSteps / activeDays) : 0;

    const bestDay = historyData.reduce(
      (best, h) => h.steps > best.steps ? { date: h.date, steps: h.steps } : best,
      { date: '', steps: 0 }
    );

    let currentStreak = 0;
    const sortedHistory = [...historyData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const entry of sortedHistory) {
      if (entry.steps >= preferences.dailyGoal) {
        currentStreak++;
      } else {
        break;
      }
    }

    const newStats: PedometerStats = {
      totalSteps,
      totalDistance,
      totalCalories,
      averageDaily,
      bestDay,
      currentStreak,
      longestStreak: Math.max(stats.longestStreak, currentStreak),
      goalsCompleted: goals.filter(g => g.completed).length,
      activeDays,
    };

    setStats(newStats);
    saveStats(newStats);
    return newStats;
  }, [preferences.dailyGoal, stats.longestStreak, goals]);

  // Check and update goals
  const checkGoals = useCallback((currentSteps: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.completed) return goal;

      let current = goal.current;
      if (goal.type === 'daily') {
        current = currentSteps;
      }

      const completed = current >= goal.target;
      return {
        ...goal,
        current,
        completed,
        completedAt: completed ? new Date().toISOString() : undefined,
      };
    });

    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  }, [goals]);

  // Create goal
  const createGoal = useCallback((type: StepGoal['type'], target: number) => {
    const now = new Date();
    let endDate = new Date();

    switch (type) {
      case 'daily':
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
    }

    const goal: StepGoal = {
      id: crypto.randomUUID(),
      type,
      target,
      current: 0,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      completed: false,
    };

    const newGoals = [...goals, goal];
    setGoals(newGoals);
    saveGoals(newGoals);
    return goal;
  }, [goals]);

  // Delete goal
  const deleteGoal = useCallback((goalId: string) => {
    const newGoals = goals.filter(g => g.id !== goalId);
    setGoals(newGoals);
    saveGoals(newGoals);
  }, [goals]);

  // Update preferences
  const updatePreference = useCallback(<K extends keyof PedometerPreferences>(
    key: K,
    value: PedometerPreferences[K]
  ) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  }, [preferences]);

  // Get weekly summary
  const getWeeklySummary = useCallback(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const weekHistory = history.filter(h => h.date >= weekAgoStr);

    return {
      totalSteps: weekHistory.reduce((sum, h) => sum + h.steps, 0),
      totalDistance: weekHistory.reduce((sum, h) => sum + h.distance, 0),
      totalCalories: weekHistory.reduce((sum, h) => sum + h.calories, 0),
      activeDays: weekHistory.length,
      dailyAverage: weekHistory.length > 0 
        ? Math.round(weekHistory.reduce((sum, h) => sum + h.steps, 0) / weekHistory.length)
        : 0,
      entries: weekHistory,
    };
  }, [history]);

  // Export data
  const exportData = useCallback(() => {
    return {
      history,
      goals,
      stats,
      preferences,
      exportedAt: new Date().toISOString(),
    };
  }, [history, goals, stats, preferences]);

  const downloadExport = useCallback(() => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedometer-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportData]);

  return {
    // Real-time data
    cadence,
    steps,
    distance,
    calories,
    isTracking,
    dailyProgress,
    
    // Controls
    startTracking,
    stopTracking,
    
    // History
    history,
    todayEntry,
    getWeeklySummary,
    
    // Goals
    goals,
    createGoal,
    deleteGoal,
    
    // Stats
    stats,
    
    // Preferences
    preferences,
    updatePreference,
    
    // Export
    exportData,
    downloadExport,
  };
};

export default usePedometerEnriched;
