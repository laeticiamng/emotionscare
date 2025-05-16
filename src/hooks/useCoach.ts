
import { useContext } from 'react';
import { CoachContext, CoachContextType } from '@/contexts/coach';

export function useCoach(): CoachContextType {
  const context = useContext(CoachContext);
  
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  
  return context;
}
