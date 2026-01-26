// @ts-nocheck

import { useState, useEffect } from 'react';
import VRService from '@/lib/vrService';
import { VRSession, VRSessionTemplate } from '@/types/vr';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface UseVRSessionOptions {
  autoStart?: boolean;
  userId?: string;
}

export const useVRSession = (templateId?: string, options: UseVRSessionOptions = {}) => {
  const { autoStart = false, userId = 'current-user' } = options;
  const [template, setTemplate] = useState<VRSessionTemplate | null>(null);
  const [session, setSession] = useState<VRSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { toast } = useToast();
  
  // Load template details
  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);
  
  // Auto-start session if configured
  useEffect(() => {
    if (autoStart && template && !session) {
      startSession();
    }
  }, [template, autoStart]);
  
  // Timer for active sessions
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isActive && session) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, session]);
  
  // Load template details
  const loadTemplate = async (id: string) => {
    setIsLoading(true);
    try {
      const templates = await VRService.getTemplates();
      const found = templates.find(t => t.id === id);
      if (found) {
        setTemplate(found);
      }
    } catch (error) {
      logger.error('Error loading VR template', error as Error, 'VR');
      toast({
        title: "Erreur",
        description: "Impossible de charger le template VR",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start a new session
  const startSession = async () => {
    if (!templateId) return;
    
    setIsLoading(true);
    try {
      const newSession = await VRService.startSession(userId, templateId);
      setSession(newSession);
      setIsActive(true);
      setElapsedTime(0);
      
      toast({
        title: "Session démarrée",
        description: "Votre expérience VR a commencé"
      });
    } catch (error) {
      logger.error('Error starting VR session', error as Error, 'VR');
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la session VR",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // End the current session
  const endSession = async (feedback?: {
    rating: number;
    emotionBefore: string;
    emotionAfter: string;
    comment: string;
  }) => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const endedSession = await VRService.endSession(session.id, feedback);
      setSession(endedSession);
      setIsActive(false);
      
      toast({
        title: "Session terminée",
        description: "Votre expérience VR est terminée"
      });
      
      return endedSession;
    } catch (error) {
      logger.error('Error ending VR session', error as Error, 'VR');
      toast({
        title: "Erreur",
        description: "Impossible de terminer la session VR",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    template,
    session,
    isLoading,
    isActive,
    elapsedTime,
    startSession,
    endSession,
    progress: isActive ? elapsedTime / (template?.duration || 1) : 0
  };
};

export default useVRSession;
