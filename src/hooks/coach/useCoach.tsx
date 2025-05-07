
import { useRecommendations } from './useRecommendations';
import { useCoachEvents } from './useCoachEvents';
import { useCoachQueries } from './useCoachQueries';
import type { CoachEmotionData } from './types';

/**
 * Main hook for Coach IA interactions
 * Integrates recommendations, events, and direct queries
 */
export function useCoach() {
  const { 
    recommendations, 
    lastEmotion, 
    sessionScore, 
    generateRecommendation,
    setLastEmotion,
    setSessionScore
  } = useRecommendations();
  
  const {
    isProcessing,
    lastTrigger,
    triggerAfterScan,
    triggerAlert,
    triggerDailyReminder,
    suggestVRSession
  } = useCoachEvents(generateRecommendation, setLastEmotion, setSessionScore);
  
  const { askQuestion } = useCoachQueries(generateRecommendation);

  return {
    // From recommendations
    recommendations,
    lastEmotion,
    sessionScore,
    generateRecommendation,
    
    // From events
    isProcessing,
    lastTrigger,
    triggerAfterScan,
    triggerAlert,
    triggerDailyReminder,
    suggestVRSession,
    
    // From queries
    askQuestion
  };
}

export default useCoach;
