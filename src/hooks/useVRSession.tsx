
import { useState, useCallback } from 'react';
import { VRSession } from '@/types/vr';
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
  const { toast } = useToast();
  
  const startSession = useCallback((templateId?: string, emotionBefore?: string) => {
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      user_id: 'current-user', // In a real app, this would be the actual user ID
      date: new Date(),
      duration: 0,
      template_id: templateId,
      emotion_before: emotionBefore,
      start_time: new Date(),
      is_audio_only: false
    };
    
    setSession(newSession);
    setIsActive(true);
    setStartTime(new Date());
    setDuration(0);
    
    toast({
      title: 'Session démarrée',
      description: 'Votre session de bien-être a commencé.'
    });
    
    return newSession;
  }, [toast]);
  
  const completeSession = useCallback((emotionAfter?: string) => {
    if (!session || !isActive) return null;
    
    // Calculate final duration
    const endTime = new Date();
    const startTimeDate = startTime || new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTimeDate.getTime()) / 1000); // Convert to seconds
    
    const completedSession: VRSession = {
      ...session,
      emotion_after: emotionAfter,
      duration_seconds: durationSeconds,
      duration: durationSeconds, // Make sure it's a number
      completed: true
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
    startSession,
    completeSession,
    cancelSession,
    formatDuration
  };
};

export default useVRSession;
