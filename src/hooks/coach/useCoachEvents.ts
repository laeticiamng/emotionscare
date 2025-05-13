
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CoachEvent } from '@/lib/coach/types';
import { completeChallenge } from '@/lib/gamificationService';

export const useCoachEvents = () => {
  const [events, setEvents] = useState<CoachEvent[]>([]);
  const { user } = useAuth();
  
  // Function to process coach events
  const processEvent = useCallback(async (event: CoachEvent) => {
    // Process different types of events
    switch (event.type) {
      case 'challenge_complete':
        if (event.data && event.data.challengeId) {
          await completeChallenge(event.data.challengeId, user?.id || '');
        }
        break;
        
      case 'badge_earned':
        // Handle badge earned event
        console.log('Badge earned:', event.data);
        break;
        
      case 'routine_completed':
        // Handle routine completed
        console.log('Routine completed:', event.data);
        break;
        
      default:
        console.log('Unknown event type:', event.type);
    }
  }, [user]);
  
  // Add a new event
  const addEvent = useCallback((event: CoachEvent) => {
    setEvents(prevEvents => [...prevEvents, event]);
    processEvent(event);
  }, [processEvent]);
  
  // Clear events
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);
  
  return {
    events,
    addEvent,
    clearEvents
  };
};

export default useCoachEvents;
