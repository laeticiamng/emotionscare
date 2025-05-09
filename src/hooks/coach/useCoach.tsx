
import { useRecommendations } from './useRecommendations';
import { useCoachEvents } from './useCoachEvents';
import { useCoachQueries } from './useCoachQueries';

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
    handleCompleteChallenge,
    handleSaveRelaxationSession,
    handleSaveJournalEntry,
    isCompletingChallenge,
    isSavingRelaxation,
    isSavingJournalEntry
  } = useCoachEvents();
  
  const { askQuestion } = useCoachQueries();

  return {
    // From recommendations
    recommendations,
    lastEmotion,
    sessionScore,
    generateRecommendation,
    
    // From events
    handleCompleteChallenge,
    handleSaveRelaxationSession,
    handleSaveJournalEntry,
    isCompletingChallenge,
    isSavingRelaxation,
    isSavingJournalEntry,
    
    // From queries
    askQuestion,
    
    // Mock these properties to maintain backward compatibility
    isProcessing: false,
    lastTrigger: null,
    triggerAfterScan: () => Promise.resolve(),
    triggerAlert: () => Promise.resolve(),
    triggerDailyReminder: () => Promise.resolve(),
    suggestVRSession: () => Promise.resolve()
  };
}

export default useCoach;
