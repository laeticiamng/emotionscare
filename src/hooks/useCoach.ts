
import { useContext } from 'react';
import { CoachContext, CoachContextType } from '@/contexts/coach';

export const useCoach = (): CoachContextType => {
  const context = useContext(CoachContext);
  
  if (!context) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  
  return context;
};

export default useCoach;
