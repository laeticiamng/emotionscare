
import { useContext } from 'react';
import { CoachContext } from '@/contexts/coach';

export const useCoach = () => useContext(CoachContext);
