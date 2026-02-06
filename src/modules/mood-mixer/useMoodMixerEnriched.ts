/**
 * Hook enrichi pour Mood Mixer avec intégration Supabase complète
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MoodMixerService, type MoodMixerSession, type MoodMixerStats } from './moodMixerServiceUnified';
import { toast } from 'sonner';

// Types
export interface MoodComponent {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  value: number;
}

export interface MoodPreset {
  id: string;
  name: string;
  description: string;
  category: 'relax' | 'energy' | 'focus' | 'sleep' | 'creative' | 'custom';
  components: MoodComponent[];
  isBuiltIn: boolean;
  isFavorite: boolean;
}

const DEFAULT_COMPONENTS: MoodComponent[] = [
  { id: 'energy', name: 'Énergie', color: 'from-red-400 to-orange-500', icon: 'Zap', description: 'Niveau d\'activation et de dynamisme', value: 50 },
  { id: 'calm', name: 'Calme', color: 'from-blue-400 to-cyan-500', icon: 'CloudRain', description: 'Sensation de paix et tranquillité', value: 70 },
  { id: 'joy', name: 'Joie', color: 'from-yellow-400 to-orange-500', icon: 'Sun', description: 'Sentiment de bonheur et optimisme', value: 60 },
  { id: 'focus', name: 'Focus', color: 'from-purple-400 to-indigo-500', icon: 'Sparkles', description: 'Concentration et clarté mentale', value: 40 },
  { id: 'comfort', name: 'Réconfort', color: 'from-pink-400 to-rose-500', icon: 'Heart', description: 'Sensation de sécurité et bien-être', value: 80 },
  { id: 'serenity', name: 'Sérénité', color: 'from-green-400 to-emerald-500', icon: 'Moon', description: 'Équilibre et harmonie intérieure', value: 55 },
];

const BUILT_IN_PRESETS: MoodPreset[] = [
  {
    id: 'preset-relax',
    name: 'Détente Profonde',
    description: 'Mix parfait pour se relaxer après une longue journée',
    category: 'relax',
    components: [
      { id: 'energy', name: 'Énergie', color: 'from-red-400 to-orange-500', icon: 'Zap', description: '', value: 20 },
      { id: 'calm', name: 'Calme', color: 'from-blue-400 to-cyan-500', icon: 'CloudRain', description: '', value: 90 },
      { id: 'joy', name: 'Joie', color: 'from-yellow-400 to-orange-500', icon: 'Sun', description: '', value: 60 },
      { id: 'focus', name: 'Focus', color: 'from-purple-400 to-indigo-500', icon: 'Sparkles', description: '', value: 30 },
      { id: 'comfort', name: 'Réconfort', color: 'from-pink-400 to-rose-500', icon: 'Heart', description: '', value: 85 },
      { id: 'serenity', name: 'Sérénité', color: 'from-green-400 to-emerald-500', icon: 'Moon', description: '', value: 95 },
    ],
    isBuiltIn: true,
    isFavorite: false,
  },
  {
    id: 'preset-energy',
    name: 'Boost Matinal',
    description: 'Réveillez-vous en pleine forme et plein d\'énergie',
    category: 'energy',
    components: [
      { id: 'energy', name: 'Énergie', color: 'from-red-400 to-orange-500', icon: 'Zap', description: '', value: 95 },
      { id: 'calm', name: 'Calme', color: 'from-blue-400 to-cyan-500', icon: 'CloudRain', description: '', value: 30 },
      { id: 'joy', name: 'Joie', color: 'from-yellow-400 to-orange-500', icon: 'Sun', description: '', value: 85 },
      { id: 'focus', name: 'Focus', color: 'from-purple-400 to-indigo-500', icon: 'Sparkles', description: '', value: 70 },
      { id: 'comfort', name: 'Réconfort', color: 'from-pink-400 to-rose-500', icon: 'Heart', description: '', value: 50 },
      { id: 'serenity', name: 'Sérénité', color: 'from-green-400 to-emerald-500', icon: 'Moon', description: '', value: 40 },
    ],
    isBuiltIn: true,
    isFavorite: false,
  },
  {
    id: 'preset-focus',
    name: 'Concentration Maximale',
    description: 'Pour un travail profond et productif',
    category: 'focus',
    components: [
      { id: 'energy', name: 'Énergie', color: 'from-red-400 to-orange-500', icon: 'Zap', description: '', value: 60 },
      { id: 'calm', name: 'Calme', color: 'from-blue-400 to-cyan-500', icon: 'CloudRain', description: '', value: 70 },
      { id: 'joy', name: 'Joie', color: 'from-yellow-400 to-orange-500', icon: 'Sun', description: '', value: 50 },
      { id: 'focus', name: 'Focus', color: 'from-purple-400 to-indigo-500', icon: 'Sparkles', description: '', value: 100 },
      { id: 'comfort', name: 'Réconfort', color: 'from-pink-400 to-rose-500', icon: 'Heart', description: '', value: 55 },
      { id: 'serenity', name: 'Sérénité', color: 'from-green-400 to-emerald-500', icon: 'Moon', description: '', value: 60 },
    ],
    isBuiltIn: true,
    isFavorite: false,
  },
  {
    id: 'preset-sleep',
    name: 'Préparation au Sommeil',
    description: 'Transition douce vers un sommeil réparateur',
    category: 'sleep',
    components: [
      { id: 'energy', name: 'Énergie', color: 'from-red-400 to-orange-500', icon: 'Zap', description: '', value: 10 },
      { id: 'calm', name: 'Calme', color: 'from-blue-400 to-cyan-500', icon: 'CloudRain', description: '', value: 95 },
      { id: 'joy', name: 'Joie', color: 'from-yellow-400 to-orange-500', icon: 'Sun', description: '', value: 40 },
      { id: 'focus', name: 'Focus', color: 'from-purple-400 to-indigo-500', icon: 'Sparkles', description: '', value: 15 },
      { id: 'comfort', name: 'Réconfort', color: 'from-pink-400 to-rose-500', icon: 'Heart', description: '', value: 90 },
      { id: 'serenity', name: 'Sérénité', color: 'from-green-400 to-emerald-500', icon: 'Moon', description: '', value: 100 },
    ],
    isBuiltIn: true,
    isFavorite: false,
  },
  {
    id: 'preset-creative',
    name: 'Flow Créatif',
    description: 'Libérez votre créativité et inspiration',
    category: 'creative',
    components: [
      { id: 'energy', name: 'Énergie', color: 'from-red-400 to-orange-500', icon: 'Zap', description: '', value: 75 },
      { id: 'calm', name: 'Calme', color: 'from-blue-400 to-cyan-500', icon: 'CloudRain', description: '', value: 50 },
      { id: 'joy', name: 'Joie', color: 'from-yellow-400 to-orange-500', icon: 'Sun', description: '', value: 90 },
      { id: 'focus', name: 'Focus', color: 'from-purple-400 to-indigo-500', icon: 'Sparkles', description: '', value: 65 },
      { id: 'comfort', name: 'Réconfort', color: 'from-pink-400 to-rose-500', icon: 'Heart', description: '', value: 70 },
      { id: 'serenity', name: 'Sérénité', color: 'from-green-400 to-emerald-500', icon: 'Moon', description: '', value: 55 },
    ],
    isBuiltIn: true,
    isFavorite: false,
  },
  {
    id: 'preset-balanced',
    name: 'Équilibre Zen',
    description: 'Harmonie parfaite entre tous les états',
    category: 'relax',
    components: [
      { id: 'energy', name: 'Énergie', color: 'from-red-400 to-orange-500', icon: 'Zap', description: '', value: 50 },
      { id: 'calm', name: 'Calme', color: 'from-blue-400 to-cyan-500', icon: 'CloudRain', description: '', value: 50 },
      { id: 'joy', name: 'Joie', color: 'from-yellow-400 to-orange-500', icon: 'Sun', description: '', value: 50 },
      { id: 'focus', name: 'Focus', color: 'from-purple-400 to-indigo-500', icon: 'Sparkles', description: '', value: 50 },
      { id: 'comfort', name: 'Réconfort', color: 'from-pink-400 to-rose-500', icon: 'Heart', description: '', value: 50 },
      { id: 'serenity', name: 'Sérénité', color: 'from-green-400 to-emerald-500', icon: 'Moon', description: '', value: 50 },
    ],
    isBuiltIn: true,
    isFavorite: false,
  },
];

const FAVORITES_KEY = 'mood-mixer-favorites';
const CUSTOM_PRESETS_KEY = 'mood-mixer-custom-presets';

export interface UseMoodMixerEnrichedReturn {
  // Components
  moodComponents: MoodComponent[];
  updateComponent: (id: string, value: number) => void;
  resetComponents: () => void;
  
  // Presets
  presets: MoodPreset[];
  applyPreset: (preset: MoodPreset) => void;
  saveAsPreset: (name: string, description: string) => void;
  toggleFavorite: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  
  // Session
  sessionId: string | null;
  isSessionActive: boolean;
  sessionDuration: number;
  startSession: () => void;
  endSession: (satisfaction?: number) => void;
  
  // Playback
  isPlaying: boolean;
  togglePlayback: () => void;
  
  // Stats & History
  stats: MoodMixerStats | null;
  history: MoodMixerSession[];
  isLoadingStats: boolean;
  isLoadingHistory: boolean;
  
  // Mood description
  getMoodDescription: () => string;
  getMoodScore: () => number;
}

export function useMoodMixerEnriched(userId?: string): UseMoodMixerEnrichedReturn {
  const queryClient = useQueryClient();
  
  // State
  const [moodComponents, setMoodComponents] = useState<MoodComponent[]>(DEFAULT_COMPONENTS);
  const [presets, setPresets] = useState<MoodPreset[]>(BUILT_IN_PRESETS);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load favorites and custom presets from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    const savedCustom = localStorage.getItem(CUSTOM_PRESETS_KEY);
    
    const favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];
    const customPresets: MoodPreset[] = savedCustom ? JSON.parse(savedCustom) : [];
    
    const updatedBuiltIn = BUILT_IN_PRESETS.map(preset => ({
      ...preset,
      isFavorite: favorites.includes(preset.id)
    }));
    
    setPresets([...updatedBuiltIn, ...customPresets]);
  }, []);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && startTime) {
      interval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, startTime]);

  // Fetch stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['mood-mixer-stats', userId],
    queryFn: () => userId ? MoodMixerService.getStats(userId) : null,
    enabled: !!userId,
    staleTime: 60000,
  });

  // Fetch history
  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['mood-mixer-history', userId],
    queryFn: () => userId ? MoodMixerService.fetchHistory(userId) : [],
    enabled: !!userId,
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('User ID required');
      const moodBefore = getMoodDescription();
      return MoodMixerService.createSession(userId, moodBefore);
    },
    onSuccess: (session) => {
      setSessionId(session.id);
      setStartTime(Date.now());
      setIsSessionActive(true);
      toast.success('Session démarrée !');
    },
    onError: () => {
      toast.error('Erreur lors du démarrage de la session');
    },
  });

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: ({ sessionId, duration, satisfaction }: { sessionId: string; duration: number; satisfaction?: number }) => {
      const moodAfter = getMoodDescription();
      return MoodMixerService.completeSession(sessionId, duration, moodAfter, satisfaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-mixer-stats', userId] });
      queryClient.invalidateQueries({ queryKey: ['mood-mixer-history', userId] });
      toast.success('Session terminée avec succès !');
    },
  });

  // Component functions
  const updateComponent = useCallback((id: string, value: number) => {
    setMoodComponents(prev => 
      prev.map(comp => comp.id === id ? { ...comp, value } : comp)
    );
  }, []);

  const resetComponents = useCallback(() => {
    setMoodComponents(DEFAULT_COMPONENTS);
    setIsPlaying(false);
  }, []);

  // Preset functions
  const applyPreset = useCallback((preset: MoodPreset) => {
    setMoodComponents(preset.components.map(pc => ({
      ...pc,
      description: DEFAULT_COMPONENTS.find(dc => dc.id === pc.id)?.description || ''
    })));
    toast.success(`Preset "${preset.name}" appliqué`);
  }, []);

  const saveAsPreset = useCallback((name: string, description: string) => {
    const newPreset: MoodPreset = {
      id: `custom-${Date.now()}`,
      name,
      description,
      category: 'custom',
      components: moodComponents.map(c => ({ ...c })),
      isBuiltIn: false,
      isFavorite: false,
    };
    
    const savedCustom = localStorage.getItem(CUSTOM_PRESETS_KEY);
    const customPresets: MoodPreset[] = savedCustom ? JSON.parse(savedCustom) : [];
    customPresets.push(newPreset);
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets));
    
    setPresets(prev => [...prev, newPreset]);
    toast.success(`Preset "${name}" sauvegardé !`);
  }, [moodComponents]);

  const toggleFavorite = useCallback((presetId: string) => {
    setPresets(prev => prev.map(p => 
      p.id === presetId ? { ...p, isFavorite: !p.isFavorite } : p
    ));
    
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    const favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (favorites.includes(presetId)) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.filter(id => id !== presetId)));
    } else {
      favorites.push(presetId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, []);

  const deletePreset = useCallback((presetId: string) => {
    if (presetId.startsWith('preset-')) {
      toast.error('Impossible de supprimer un preset intégré');
      return;
    }
    
    setPresets(prev => prev.filter(p => p.id !== presetId));
    
    const savedCustom = localStorage.getItem(CUSTOM_PRESETS_KEY);
    const customPresets: MoodPreset[] = savedCustom ? JSON.parse(savedCustom) : [];
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets.filter(p => p.id !== presetId)));
    
    toast.success('Preset supprimé');
  }, []);

  // Session functions
  const startSession = useCallback(() => {
    if (userId) {
      createSessionMutation.mutate();
    } else {
      // Mode local sans authentification
      setSessionId(`local-${Date.now()}`);
      setStartTime(Date.now());
      setIsSessionActive(true);
      toast.success('Session locale démarrée');
    }
  }, [userId, createSessionMutation]);

  const endSession = useCallback((satisfaction?: number) => {
    if (sessionId && startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      if (userId && !sessionId.startsWith('local-')) {
        completeSessionMutation.mutate({ sessionId, duration, satisfaction });
      } else {
        toast.success('Session terminée !');
      }
    }
    setIsSessionActive(false);
    setSessionId(null);
    setStartTime(null);
    setSessionDuration(0);
    setIsPlaying(false);
  }, [sessionId, startTime, userId, completeSessionMutation]);

  // Audio synthesis for mood components
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const startAudio = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        audioContextRef.current = new AudioContextClass();
      }
      
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Stop existing oscillators
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) { /* oscillator already stopped */ }
      });
      oscillatorsRef.current = [];

      // Create oscillators based on mood components
      const frequencies: Record<string, number> = {
        energy: 528,    // "Love" frequency - energizing
        calm: 432,      // Natural frequency - calming
        joy: 639,       // Harmony frequency
        focus: 40,      // Gamma binaural (40Hz) for focus
        comfort: 396,   // Liberation frequency
        serenity: 285   // Healing frequency
      };

      moodComponents.forEach(comp => {
        if (comp.value > 30 && audioContextRef.current) {
          const osc = audioContextRef.current.createOscillator();
          const gain = audioContextRef.current.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(frequencies[comp.id] || 432, audioContextRef.current.currentTime);
          
          // Volume based on component value (0-1, scaled down for mixing)
          const volume = (comp.value / 100) * 0.05;
          gain.gain.setValueAtTime(0, audioContextRef.current.currentTime);
          gain.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.5);
          
          osc.connect(gain);
          gain.connect(audioContextRef.current.destination);
          osc.start();
          
          oscillatorsRef.current.push(osc);
        }
      });
    } catch (e) {
      console.warn('Audio synthesis not available:', e);
    }
  }, [moodComponents]);

  const stopAudio = useCallback(() => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) { /* oscillator already stopped */ }
    });
    oscillatorsRef.current = [];
  }, []);

  // Playback
  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => {
      if (!prev) {
        startAudio();
      } else {
        stopAudio();
      }
      return !prev;
    });
  }, [startAudio, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAudio]);

  // Mood helpers
  const getMoodDescription = useCallback((): string => {
    const avgValue = moodComponents.reduce((sum, comp) => sum + comp.value, 0) / moodComponents.length;
    
    if (avgValue > 75) return "Humeur très positive et équilibrée";
    if (avgValue > 60) return "Humeur stable et agréable";
    if (avgValue > 40) return "Humeur modérée";
    if (avgValue > 25) return "Humeur nécessitant un boost";
    return "Humeur à améliorer";
  }, [moodComponents]);

  const getMoodScore = useCallback((): number => {
    return Math.round(moodComponents.reduce((sum, comp) => sum + comp.value, 0) / moodComponents.length);
  }, [moodComponents]);

  return {
    moodComponents,
    updateComponent,
    resetComponents,
    presets,
    applyPreset,
    saveAsPreset,
    toggleFavorite,
    deletePreset,
    sessionId,
    isSessionActive,
    sessionDuration,
    startSession,
    endSession,
    isPlaying,
    togglePlayback,
    stats: stats ?? null,
    history,
    isLoadingStats,
    isLoadingHistory,
    getMoodDescription,
    getMoodScore,
  };
}

// Re-export the simple hook for backward compatibility
export { useMoodMixer } from './useMoodMixer';
