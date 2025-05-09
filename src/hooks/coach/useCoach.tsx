
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

  // Mock functions for backward compatibility
  const mockTriggerAfterScan = () => Promise.resolve();
  const mockTriggerAlert = () => Promise.resolve();
  const mockTriggerDailyReminder = () => Promise.resolve();
  const mockSuggestVRSession = () => Promise.resolve();

  return {
    // From recommendations
    recommendations,
    lastEmotion,
    sessionScore,
    generateRecommendation,
    setLastEmotion,
    setSessionScore,
    
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
    triggerAfterScan: mockTriggerAfterScan,
    triggerAlert: mockTriggerAlert,
    triggerDailyReminder: mockTriggerDailyReminder,
    suggestVRSession: mockSuggestVRSession
  };
}

export default useCoach;
