
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
  
  // Use coachEvents but handle potential errors if QueryClient isn't available
  let coachEvents;
  try {
    coachEvents = useCoachEvents();
  } catch (error) {
    console.warn('Error initializing coach events, using fallback mode:', error);
    // Provide fallback implementation
    coachEvents = {
      handleCompleteChallenge: async () => false,
      handleSaveRelaxationSession: async () => false,
      handleSaveJournalEntry: async () => false,
      isCompletingChallenge: false,
      isSavingRelaxation: false,
      isSavingJournalEntry: false
    };
  }

  const { 
    handleCompleteChallenge,
    handleSaveRelaxationSession,
    handleSaveJournalEntry,
    isCompletingChallenge,
    isSavingRelaxation,
    isSavingJournalEntry
  } = coachEvents;
  
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
