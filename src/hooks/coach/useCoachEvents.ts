
import { useState, useCallback, useEffect } from 'react';
import { CoachEvent } from '@/types/coach/CoachEvent';

export const useCoachEvents = (userId: string) => {
  const [events, setEvents] = useState<CoachEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialEvents = async () => {
      setIsLoading(true);
      try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const initialEvents: CoachEvent[] = [
          {
            id: '1',
            type: 'message',
            content: 'Bienvenue dans votre espace coaching ! Je suis Emma, votre coach personnel.',
            timestamp: new Date().toISOString(),
            userId
          },
          {
            id: '2',
            type: 'suggestion',
            content: 'Essayez notre nouvelle fonctionnalité de méditation guidée pour réduire votre stress.',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 jour avant
            userId
          }
        ];
        
        setEvents(initialEvents);
      } catch (error) {
        console.error('Failed to fetch coach events', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialEvents();
  }, [userId]);

  const addEvent = useCallback((newEvent: Omit<CoachEvent, 'id' | 'timestamp' | 'userId'>) => {
    const completeEvent: CoachEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      ...newEvent
    };
    
    setEvents(prev => [completeEvent, ...prev]);
    return completeEvent;
  }, [userId]);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  }, []);

  const clearAllEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const markEventAsRead = useCallback((eventId: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, read: true }
          : event
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setEvents(prev => 
      prev.map(event => ({ ...event, read: true }))
    );
  }, []);

  return {
    events,
    isLoading,
    addEvent,
    deleteEvent,
    clearAllEvents,
    markEventAsRead,
    markAllAsRead,
    unreadCount: events.filter(e => e.read !== true).length
  };
};

export default useCoachEvents;
