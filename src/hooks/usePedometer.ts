// @ts-nocheck
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

/** Configuration du podomètre */
export interface PedometerConfig {
  stepLength: number; // en mètres
  weight: number; // en kg
  sensitivity: number;
  dailyGoal: number;
  alertOnGoal: boolean;
  autoSave: boolean;
  saveInterval: number; // en ms
}

/** Données de pas */
export interface StepData {
  steps: number;
  cadence: number;
  timestamp: Date;
  distance: number;
  calories: number;
  pace: number;
  isActive: boolean;
}

/** Statistiques de marche */
export interface WalkStats {
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
  averageCadence: number;
  maxCadence: number;
  activeMinutes: number;
  goalProgress: number;
  currentStreak: number;
}

/** Session de marche */
export interface WalkSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  steps: number;
  distance: number;
  calories: number;
  averageCadence: number;
  maxCadence: number;
  duration: number;
  route?: { lat: number; lng: number }[];
}

/** Historique journalier */
export interface DailyStepHistory {
  date: string;
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
  goalReached: boolean;
}

/** Alerte podomètre */
export interface PedometerAlert {
  type: 'goal_reached' | 'milestone' | 'inactivity' | 'high_activity';
  message: string;
  timestamp: Date;
  value: number;
}

const DEFAULT_CONFIG: PedometerConfig = {
  stepLength: 0.75,
  weight: 70,
  sensitivity: 0.5,
  dailyGoal: 10000,
  alertOnGoal: true,
  autoSave: true,
  saveInterval: 60000
};

const MILESTONES = [1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000];

export const usePedometer = (initialConfig?: Partial<PedometerConfig>) => {
  const [config, setConfig] = useState<PedometerConfig>({ ...DEFAULT_CONFIG, ...initialConfig });
  const [isTracking, setIsTracking] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [steps, setSteps] = useState(0);
  const [cadence, setCadence] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [pace, setPace] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<WalkSession | null>(null);
  const [history, setHistory] = useState<StepData[]>([]);
  const [dailyHistory, setDailyHistory] = useState<DailyStepHistory[]>([]);
  const [alerts, setAlerts] = useState<PedometerAlert[]>([]);
  const [stats, setStats] = useState<WalkStats>({
    totalSteps: 0,
    totalDistance: 0,
    totalCalories: 0,
    averageCadence: 0,
    maxCadence: 0,
    activeMinutes: 0,
    goalProgress: 0,
    currentStreak: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const historyRef = useRef<StepData[]>([]);
  const sessionStartRef = useRef<Date | null>(null);
  const lastActiveRef = useRef<Date>(new Date());
  const reachedMilestonesRef = useRef<Set<number>>(new Set());
  const todayStepsRef = useRef(0);

  // Calculer les calories brûlées
  const calculateCalories = useCallback((stepCount: number, currentCadence: number): number => {
    // MET approximatif basé sur la cadence
    let met = 2.0; // Marche lente
    if (currentCadence > 100) met = 3.5; // Marche normale
    if (currentCadence > 120) met = 5.0; // Marche rapide
    if (currentCadence > 140) met = 8.0; // Course légère

    // Calories = MET × poids (kg) × durée (heures)
    const stepDuration = stepCount / Math.max(currentCadence, 60); // en minutes
    const hours = stepDuration / 60;

    return Math.round(met * config.weight * hours * 10) / 10;
  }, [config.weight]);

  // Calculer la distance
  const calculateDistance = useCallback((stepCount: number): number => {
    return Math.round(stepCount * config.stepLength) / 1000; // en km
  }, [config.stepLength]);

  // Simuler les données de pas
  const generateSimulatedData = useCallback(() => {
    // Simuler une activité variable
    const now = Date.now();
    const cyclePosition = (now % 30000) / 30000;

    // Périodes d'activité et de repos
    const activityLevel = Math.sin(cyclePosition * Math.PI * 2) * 0.5 + 0.5;
    const isCurrentlyActive = activityLevel > 0.3;

    let newCadence = 0;
    if (isCurrentlyActive) {
      const baseCadence = 80 + activityLevel * 60;
      const noise = (Math.random() - 0.5) * 20;
      newCadence = Math.round(baseCadence + noise);
    }

    // Calculer les nouveaux pas
    const stepsThisSecond = isCurrentlyActive ? Math.round(newCadence / 60) : 0;

    return {
      steps: stepsThisSecond,
      cadence: newCadence,
      isActive: isCurrentlyActive
    };
  }, []);

  // Vérifier les alertes et milestones
  const checkAlerts = useCallback((currentSteps: number, currentCadence: number) => {
    const newAlerts: PedometerAlert[] = [];

    // Objectif atteint
    if (config.alertOnGoal && currentSteps >= config.dailyGoal &&
      !reachedMilestonesRef.current.has(config.dailyGoal)) {
      reachedMilestonesRef.current.add(config.dailyGoal);
      newAlerts.push({
        type: 'goal_reached',
        message: `Félicitations ! Objectif de ${config.dailyGoal} pas atteint !`,
        timestamp: new Date(),
        value: currentSteps
      });
    }

    // Milestones
    for (const milestone of MILESTONES) {
      if (currentSteps >= milestone && !reachedMilestonesRef.current.has(milestone)) {
        reachedMilestonesRef.current.add(milestone);
        if (milestone !== config.dailyGoal) {
          newAlerts.push({
            type: 'milestone',
            message: `${milestone.toLocaleString()} pas atteints !`,
            timestamp: new Date(),
            value: milestone
          });
        }
      }
    }

    // Haute activité
    if (currentCadence > 150) {
      newAlerts.push({
        type: 'high_activity',
        message: 'Excellente cadence ! Continuez ainsi !',
        timestamp: new Date(),
        value: currentCadence
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50));
    }
  }, [config.alertOnGoal, config.dailyGoal]);

  // Calculer les statistiques
  const calculateStats = useCallback(() => {
    const recent = historyRef.current;
    if (recent.length === 0) return;

    const activeData = recent.filter(d => d.isActive);
    const cadences = activeData.map(d => d.cadence);

    const avgCadence = cadences.length > 0
      ? Math.round(cadences.reduce((a, b) => a + b, 0) / cadences.length)
      : 0;

    const maxCadence = cadences.length > 0 ? Math.max(...cadences) : 0;
    const activeMinutes = Math.round(activeData.length / 60);

    setStats({
      totalSteps: steps,
      totalDistance: distance,
      totalCalories: calories,
      averageCadence: avgCadence,
      maxCadence,
      activeMinutes,
      goalProgress: Math.round((steps / config.dailyGoal) * 100),
      currentStreak: 0 // À calculer depuis l'historique
    });
  }, [steps, distance, calories, config.dailyGoal]);

  // Démarrer le tracking
  const startTracking = useCallback(() => {
    if (intervalRef.current) return;

    setIsTracking(true);
    sessionStartRef.current = new Date();
    reachedMilestonesRef.current.clear();

    setCurrentSession({
      id: `session_${Date.now()}`,
      startTime: new Date(),
      steps: 0,
      distance: 0,
      calories: 0,
      averageCadence: 0,
      maxCadence: 0,
      duration: 0
    });

    intervalRef.current = setInterval(() => {
      const data = generateSimulatedData();

      // Mettre à jour les totaux
      setSteps(prev => {
        const newTotal = prev + data.steps;
        todayStepsRef.current = newTotal;
        return newTotal;
      });
      setCadence(data.cadence);
      setIsActive(data.isActive);

      // Calculer distance et calories
      const newDistance = calculateDistance(steps + data.steps);
      const newCalories = calculateCalories(steps + data.steps, data.cadence);
      setDistance(newDistance);
      setCalories(newCalories);

      // Pace (minutes par km)
      if (data.cadence > 0) {
        const stepsPerKm = 1000 / config.stepLength;
        const minutesPerKm = stepsPerKm / data.cadence;
        setPace(Math.round(minutesPerKm * 10) / 10);
      }

      // Historique
      const stepData: StepData = {
        steps: data.steps,
        cadence: data.cadence,
        timestamp: new Date(),
        distance: newDistance,
        calories: newCalories,
        pace,
        isActive: data.isActive
      };
      historyRef.current = [...historyRef.current.slice(-3600), stepData];
      setHistory([...historyRef.current]);

      // Mettre à jour la session
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          steps: prev.steps + data.steps,
          distance: newDistance,
          calories: newCalories,
          averageCadence: data.cadence,
          maxCadence: Math.max(prev.maxCadence, data.cadence),
          duration: Math.round((Date.now() - prev.startTime.getTime()) / 1000)
        };
      });

      calculateStats();
      checkAlerts(steps + data.steps, data.cadence);

      if (data.isActive) {
        lastActiveRef.current = new Date();
      }
    }, 1000);

    // Auto-save
    if (config.autoSave) {
      saveIntervalRef.current = setInterval(() => {
        saveProgress();
      }, config.saveInterval);
    }
  }, [steps, pace, config, generateSimulatedData, calculateDistance, calculateCalories, calculateStats, checkAlerts]);

  // Arrêter le tracking
  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }
    setIsTracking(false);

    if (currentSession) {
      setCurrentSession(prev => prev ? { ...prev, endTime: new Date() } : null);
    }
  }, [currentSession]);

  // Sauvegarder le progrès
  const saveProgress = useCallback(async (): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return false;

      await supabase.from('step_logs').insert({
        user_id: userData.user.id,
        steps,
        distance,
        calories,
        active_minutes: stats.activeMinutes,
        date: new Date().toISOString().split('T')[0]
      });

      return true;
    } catch (error) {
      console.error('Error saving step progress:', error);
      return false;
    }
  }, [steps, distance, calories, stats.activeMinutes]);

  // Charger l'historique
  const loadHistory = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      const { data } = await supabase
        .from('step_logs')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (data) {
        setDailyHistory(data.map(d => ({
          date: d.date,
          steps: d.steps,
          distance: d.distance,
          calories: d.calories,
          activeMinutes: d.active_minutes || 0,
          goalReached: d.steps >= config.dailyGoal
        })));
      }
    } catch (error) {
      console.error('Error loading step history:', error);
    }
  }, [config.dailyGoal]);

  // Réinitialiser pour aujourd'hui
  const resetToday = useCallback(() => {
    setSteps(0);
    setDistance(0);
    setCalories(0);
    setCadence(0);
    setPace(0);
    setIsActive(false);
    historyRef.current = [];
    setHistory([]);
    reachedMilestonesRef.current.clear();
    todayStepsRef.current = 0;
  }, []);

  // Exporter les données
  const exportData = useCallback((): string => {
    let csv = 'Date,Steps,Distance (km),Calories,Active Minutes,Goal Reached\n';
    for (const day of dailyHistory) {
      csv += `${day.date},${day.steps},${day.distance},${day.calories},${day.activeMinutes},${day.goalReached}\n`;
    }
    return csv;
  }, [dailyHistory]);

  // Mettre à jour la configuration
  const updateConfig = useCallback((updates: Partial<PedometerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Obtenir le streak
  const getStreak = useCallback((): number => {
    let streak = 0;
    for (const day of dailyHistory) {
      if (day.goalReached) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [dailyHistory]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  // Charger l'historique au montage
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Auto-start
  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, []);

  return {
    // État principal
    steps,
    cadence,
    distance,
    calories,
    pace,
    isActive,
    isTracking,
    hasPermission,

    // Session et historique
    currentSession,
    history,
    dailyHistory,
    alerts,
    stats,
    config,

    // Actions
    startTracking,
    stopTracking,
    saveProgress,
    loadHistory,
    resetToday,
    exportData,
    updateConfig,

    // Utilitaires
    getStreak,

    // Constantes
    milestones: MILESTONES
  };
};

export default usePedometer;
