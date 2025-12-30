/**
 * Hook enrichi pour gérer les filtres AR avec intégration Supabase
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ARFiltersService } from '../arFiltersService';
import type { ARFilterSession, ARFilterStats, FilterType } from '../types';
import { toast } from 'sonner';

export interface ARFilter {
  id: string;
  name: string;
  emoji: string;
  type: FilterType;
  color: string;
  description: string;
  cssFilter: string;
}

const AR_FILTERS: ARFilter[] = [
  { 
    id: 'joy', 
    name: 'Joie', 
    emoji: '😊', 
    type: 'joy', 
    color: 'from-yellow-400 to-orange-500',
    description: 'Filtre lumineux et chaleureux',
    cssFilter: 'brightness(1.1) saturate(1.3) sepia(0.1)'
  },
  { 
    id: 'calm', 
    name: 'Calme', 
    emoji: '😌', 
    type: 'calm', 
    color: 'from-blue-400 to-cyan-500',
    description: 'Tons apaisants et sereins',
    cssFilter: 'brightness(0.95) saturate(0.9) hue-rotate(10deg)'
  },
  { 
    id: 'energy', 
    name: 'Énergie', 
    emoji: '⚡', 
    type: 'energy', 
    color: 'from-red-400 to-pink-500',
    description: 'Boost dynamique et vivifiant',
    cssFilter: 'contrast(1.1) saturate(1.4) brightness(1.05)'
  },
  { 
    id: 'serenity', 
    name: 'Sérénité', 
    emoji: '🧘', 
    type: 'serenity', 
    color: 'from-purple-400 to-indigo-500',
    description: 'Ambiance zen et méditative',
    cssFilter: 'brightness(0.9) saturate(0.8) hue-rotate(-10deg)'
  },
  { 
    id: 'creativity', 
    name: 'Créativité', 
    emoji: '🎨', 
    type: 'creativity', 
    color: 'from-fuchsia-400 to-violet-500',
    description: 'Couleurs vives et inspirantes',
    cssFilter: 'saturate(1.5) hue-rotate(20deg) brightness(1.05)'
  },
  { 
    id: 'confidence', 
    name: 'Confiance', 
    emoji: '💪', 
    type: 'confidence', 
    color: 'from-emerald-400 to-teal-500',
    description: 'Tonalités affirmées et stables',
    cssFilter: 'contrast(1.05) brightness(1.05) saturate(1.1)'
  },
  { 
    id: 'playful', 
    name: 'Ludique', 
    emoji: '🎉', 
    type: 'playful', 
    color: 'from-pink-400 to-rose-500',
    description: 'Effets joyeux et amusants',
    cssFilter: 'saturate(1.6) brightness(1.1) hue-rotate(15deg)'
  },
  { 
    id: 'focused', 
    name: 'Focus', 
    emoji: '🎯', 
    type: 'focused', 
    color: 'from-slate-400 to-zinc-500',
    description: 'Concentration et clarté',
    cssFilter: 'grayscale(0.2) contrast(1.1) brightness(0.95)'
  },
];

export interface UseARFiltersReturn {
  // Filters
  filters: ARFilter[];
  currentFilter: ARFilter | null;
  selectFilter: (filter: ARFilter | null) => void;
  
  // Camera
  isCameraActive: boolean;
  isMirrored: boolean;
  toggleMirror: () => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  
  // Session
  sessionId: string | null;
  isSessionActive: boolean;
  startSession: () => void;
  endSession: (moodImpact?: string) => void;
  sessionDuration: number;
  
  // Photos
  capturedPhotos: string[];
  capturePhoto: () => void;
  deletePhoto: (index: number) => void;
  clearPhotos: () => void;
  downloadPhoto: (index: number) => void;
  sharePhoto: (index: number) => Promise<void>;
  
  // Stats & History
  stats: (ARFilterStats & { weeklyTrend: number[] }) | null;
  history: ARFilterSession[];
  isLoadingStats: boolean;
  
  // Session control flags
  isCreatingSession: boolean;
  isCompletingSession: boolean;
}

export const useARFilters = (userId?: string): UseARFiltersReturn => {
  const queryClient = useQueryClient();
  
  // State
  const [currentFilter, setCurrentFilter] = useState<ARFilter | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Video ref for camera - use proper ref
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Timer for session duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && startTime) {
      interval = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, startTime]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Fetch stats
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['ar-filters-stats', userId],
    queryFn: () => userId ? ARFiltersService.getStats(userId) : null,
    enabled: !!userId,
    staleTime: 60000,
  });

  // Fetch history
  const { data: history = [] } = useQuery({
    queryKey: ['ar-filters-history', userId],
    queryFn: () => userId ? ARFiltersService.fetchHistory(userId) : [],
    enabled: !!userId,
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: ({ filterType }: { filterType: string }) => {
      if (!userId) throw new Error('User ID required');
      return ARFiltersService.createSession(userId, filterType);
    },
    onSuccess: (session) => {
      setSessionId(session.id);
      setStartTime(Date.now());
      setIsSessionActive(true);
      toast.success('Session AR démarrée !');
    },
    onError: () => {
      toast.error('Erreur lors du démarrage de la session');
    },
  });

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: ({ sessionId, duration, moodImpact }: { sessionId: string; duration: number; moodImpact?: string }) => {
      return ARFiltersService.completeSession(sessionId, duration, moodImpact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ar-filters-stats', userId] });
      queryClient.invalidateQueries({ queryKey: ['ar-filters-history', userId] });
      toast.success('Session terminée avec succès !');
    },
  });

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Impossible d\'accéder à la caméra');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const toggleMirror = useCallback(() => {
    setIsMirrored(prev => !prev);
  }, []);

  // Session functions
  const startSession = useCallback(() => {
    if (currentFilter && userId) {
      createSessionMutation.mutate({ filterType: currentFilter.type });
    }
  }, [currentFilter, userId, createSessionMutation]);

  const endSession = useCallback((moodImpact?: string) => {
    if (sessionId && startTime) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      completeSessionMutation.mutate({ sessionId, duration, moodImpact });
    }
    setIsSessionActive(false);
    setSessionId(null);
    setStartTime(null);
    setSessionDuration(0);
  }, [sessionId, startTime, completeSessionMutation]);

  // Photo capture
  const capturePhoto = useCallback(() => {
    if (videoRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Handle mirroring
        if (isMirrored) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        
        // Apply filter effect
        if (currentFilter) {
          ctx.filter = currentFilter.cssFilter;
        }
        
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedPhotos(prev => [...prev, dataUrl]);
        
        // Update session photos count
        if (sessionId) {
          ARFiltersService.incrementPhotosTaken(sessionId);
        }
        toast.success('Photo capturée !');
      }
    }
  }, [isCameraActive, currentFilter, sessionId, isMirrored]);

  const deletePhoto = useCallback((index: number) => {
    setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
    toast.success('Photo supprimée');
  }, []);

  const clearPhotos = useCallback(() => {
    setCapturedPhotos([]);
    toast.success('Galerie vidée');
  }, []);

  const downloadPhoto = useCallback((index: number) => {
    const photo = capturedPhotos[index];
    if (photo) {
      const link = document.createElement('a');
      link.href = photo;
      link.download = `ar-photo-${Date.now()}-${index + 1}.png`;
      link.click();
      toast.success('Photo téléchargée !');
    }
  }, [capturedPhotos]);

  const sharePhoto = useCallback(async (index: number) => {
    const photo = capturedPhotos[index];
    if (!photo) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(photo);
      const blob = await response.blob();
      const file = new File([blob], `ar-photo-${Date.now()}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Ma photo AR EmotionsCare',
          text: 'Découvrez mon expérience avec les filtres AR émotionnels !',
          files: [file],
        });
        toast.success('Photo partagée !');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast.success('Photo copiée dans le presse-papiers !');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Impossible de partager la photo');
    }
  }, [capturedPhotos]);

  const selectFilter = useCallback((filter: ARFilter | null) => {
    setCurrentFilter(filter);
  }, []);

  return {
    filters: AR_FILTERS,
    currentFilter,
    selectFilter,
    isCameraActive,
    isMirrored,
    toggleMirror,
    startCamera,
    stopCamera,
    videoRef,
    sessionId,
    isSessionActive,
    startSession,
    endSession,
    sessionDuration,
    capturedPhotos,
    capturePhoto,
    deletePhoto,
    clearPhotos,
    downloadPhoto,
    sharePhoto,
    stats: statsData || null,
    history,
    isLoadingStats,
    isCreatingSession: createSessionMutation.isPending,
    isCompletingSession: completeSessionMutation.isPending,
  };
};
