
import { useState, useEffect, useCallback } from 'react';
import { CoachEvent } from '@/lib/coach/types';

export function useCoachEvents(userId: string) {
  const [events, setEvents] = useState<CoachEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch events from an API
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockEvents: CoachEvent[] = [
        {
          id: '1',
          type: 'session_started',
          data: { sessionId: 'session-1' },
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'insight_generated',
          data: { 
            text: "Vous semblez plus productif le matin. Essayez de planifier vos tâches importantes pour cette période." 
          },
          timestamp: new Date()
        }
      ];
      
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching coach events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]); // Add userId as dependency
  
  const addEvent = useCallback((eventType: string, eventData: any) => {
    const newEvent: CoachEvent = {
      id: Date.now().toString(),
      type: eventType,
      data: eventData,
      timestamp: new Date()
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    // In a real implementation, this would also send the event to an API
    console.log(`New coach event: ${eventType}`, eventData);
  }, []);

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    addEvent,
    fetchEvents
  };
}
