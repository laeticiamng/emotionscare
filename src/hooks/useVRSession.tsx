
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VRSessionTemplate } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { createVRSession } from '@/lib/vrService';
import { useToast } from '@/hooks/use-toast';

export function useVRSession() {
  const [activeTemplate, setActiveTemplate] = useState<VRSessionTemplate | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [heartRate, setHeartRate] = useState({ before: 75, after: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Clean up resources when component unmounts or session ends
  useEffect(() => {
    return () => {
      // Any cleanup needed when session ends
    };
  }, []);
  
  // Start a VR session with a selected template
  const startSession = useCallback((template: VRSessionTemplate) => {
    setActiveTemplate(template);
    setIsSessionActive(true);
    setSessionDuration(0);
    setHeartRate(prev => ({ ...prev, after: 0 }));
    
    // Generate a simulated starting heart rate between 70-95
    setHeartRate(prev => ({
      ...prev,
      before: Math.floor(Math.random() * 25) + 70
    }));
  }, []);
  
  // Complete a VR session
  const completeSession = useCallback(async () => {
    if (!user?.id || !activeTemplate) {
      setIsSessionActive(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate heart rate reduction of 5-15 bpm
      const reduction = Math.floor(Math.random() * 10) + 5;
      const heartRateAfter = Math.max(heartRate.before - reduction, 60);
      setHeartRate(prev => ({ ...prev, after: heartRateAfter }));
      
      // Calculate session duration in seconds (use template duration or actual time)
      const durationSeconds = (activeTemplate.duration || 5) * 60;
      setSessionDuration(durationSeconds);
      
      // Log session to backend
      await createVRSession({
        user_id: user.id,
        template_id: activeTemplate.id,
        duration: durationSeconds,
        is_audio_only: activeTemplate.is_audio_only || false,
        mood_before: 'neutral'
      });
      
      toast({
        title: "Session terminée",
        description: `Votre session VR de ${activeTemplate.duration || 5} minutes a été enregistrée`
      });
      
      // Reset state
      setIsSessionActive(false);
      setActiveTemplate(null);
    } catch (error) {
      console.error('Error completing VR session:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre session VR",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, activeTemplate, heartRate.before, toast]);
  
  return {
    activeTemplate,
    isSessionActive,
    heartRate,
    isLoading,
    sessionDuration,
    startSession,
    completeSession
  };
}
