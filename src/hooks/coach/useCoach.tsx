// @ts-nocheck

import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CoachEvent } from '@/types/coach/CoachEvent';
import { logger } from '@/lib/logger';

// Utilisation de la nouvelle interface CoachEvent
export const useCoach = (userId: string) => {
  const { toast } = useToast();
  const [events, setEvents] = useState<CoachEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coachStatus, setCoachStatus] = useState<'active' | 'idle' | 'disabled'>('idle');

  // Charger les événements précédents
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Événements fictifs
        const mockEvents: CoachEvent[] = [
          {
            id: '1',
            type: 'message',
            content: 'Bienvenue dans votre espace personnel ! Comment puis-je vous aider aujourd\'hui ?',
            timestamp: new Date().toISOString(),
            userId,
            read: true
          },
          {
            id: '2',
            type: 'suggestion',
            content: 'Avez-vous essayé la nouvelle fonctionnalité de méditation guidée ?',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            userId,
            read: false
          }
        ];
        
        setEvents(mockEvents);
      } catch (error) {
        logger.error('Error loading coach events', error as Error, 'UI');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      loadEvents();
    }
  }, [userId]);

  // Ajouter un nouvel événement
  const addEvent = useCallback((event: Omit<CoachEvent, 'id' | 'timestamp' | 'userId'>) => {
    const newEvent: CoachEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      ...event
    };
    
    setEvents(prev => [newEvent, ...prev]);
    
    // Afficher une notification pour certains types d'événements
    if (event.type === 'suggestion' || event.type === 'notification') {
      toast({
        title: 'Message du coach',
        description: event.content
      });
    }
    
    return newEvent.id;
  }, [userId, toast]);

  // Simuler une activité du coach
  useEffect(() => {
    if (coachStatus === 'active') {
      const timer = setTimeout(() => {
        addEvent({
          type: 'message',
          content: 'Je remarque que vous explorez la plateforme. Avez-vous des questions ?',
          read: false
        });
      }, 60000);
      
      return () => clearTimeout(timer);
    }
  }, [coachStatus, addEvent]);

  // Démarrer une session
  const startSession = useCallback(() => {
    setCoachStatus('active');
    addEvent({
      type: 'message',
      content: 'Session démarrée. Je suis là pour vous accompagner !',
      read: false
    });
  }, [addEvent]);

  // Terminer une session
  const endSession = useCallback(() => {
    setCoachStatus('idle');
  }, []);

  // Marquer un événement comme lu
  const markAsRead = useCallback((eventId: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, read: true } 
          : event
      )
    );
  }, []);

  return {
    events,
    isLoading,
    coachStatus,
    addEvent,
    startSession,
    endSession,
    markAsRead,
    unreadCount: events.filter(e => !e.read).length
  };
};

export default useCoach;
