
import { useState, useCallback } from 'react';
import { VRSession, VRSessionTemplate } from '@/types';
import { useToast } from './use-toast';

interface UseVRSessionProps {
  onSessionComplete?: (session: VRSession) => void;
  initialSession?: VRSession | null;
}

export const useVRSession = ({ onSessionComplete, initialSession }: UseVRSessionProps = {}) => {
  const [session, setSession] = useState<VRSession | null>(initialSession || null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [heartRate, setHeartRate] = useState({ before: 75, after: 65 });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const startSession = useCallback((templateId?: string | VRSessionTemplate, emotionBefore?: string) => {
    setIsLoading(true);
    
    // Si templateId est un objet VRSessionTemplate, extraire son ID
    const actualTemplateId = typeof templateId === 'string' ? templateId : templateId?.id;
    
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      user_id: 'current-user', // Dans une app réelle, ce serait l'ID utilisateur réel
      date: new Date().toISOString(),
      started_at: new Date().toISOString(),
      start_time: new Date().toISOString(),
      duration: 0,
      duration_seconds: 0,
      template_id: actualTemplateId,
      emotion_before: emotionBefore,
      mood_before: emotionBefore,
      is_audio_only: false,
      completed: false
    };
    
    setSession(newSession);
    setIsActive(true);
    setStartTime(new Date());
    setDuration(0);
    setIsLoading(false);
    
    toast({
      title: 'Session démarrée',
      description: 'Votre session de bien-être a commencée.'
    });
    
    return newSession;
  }, [toast]);
  
  const completeSession = useCallback((emotionAfter?: string) => {
    if (!session || !isActive) return null;
    
    // Calculer la durée finale
    const endTime = new Date();
    const startTimeDate = startTime || new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTimeDate.getTime()) / 1000); // Convertir en secondes
    
    const completedSession: VRSession = {
      ...session,
      emotion_after: emotionAfter,
      mood_after: emotionAfter,
      duration_seconds: durationSeconds,
      duration: durationSeconds, // S'assurer que c'est un nombre
      completed: true,
      completed_at: endTime
    };
    
    setSession(completedSession);
    setIsActive(false);
    
    toast({
      title: 'Session terminée',
      description: `Votre session de ${formatDuration(durationSeconds)} est complétée.`
    });
    
    if (onSessionComplete) {
      onSessionComplete(completedSession);
    }
    
    return completedSession;
  }, [session, isActive, startTime, toast, onSessionComplete]);
  
  const cancelSession = useCallback(() => {
    setSession(null);
    setIsActive(false);
    setDuration(0);
    setStartTime(null);
    
    toast({
      title: 'Session annulée',
      description: 'Votre session a été annulée.'
    });
  }, [toast]);
  
  // Format duration for display (e.g., "5 min 30 sec")
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };
  
  return {
    session,
    isActive,
    duration,
    heartRate,
    isLoading,
    isSessionActive: isActive,
    activeTemplate: typeof session?.template_id === 'object' ? session?.template_id : null,
    startSession,
    completeSession,
    cancelSession,
    formatDuration
  };
};

export default useVRSession;
