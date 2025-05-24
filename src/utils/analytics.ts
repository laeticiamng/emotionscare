
export interface AnalyticsEvent {
  event: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

export const trackEvent = async (eventData: AnalyticsEvent): Promise<void> => {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...eventData,
        timestamp: eventData.timestamp || new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to track analytics event:', error);
  }
};

export const analytics = {
  // User actions
  userSignUp: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'userSignUp', userId, metadata }),
  
  userLogin: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'userLogin', userId, metadata }),
  
  userLogout: (userId: string) =>
    trackEvent({ event: 'userLogout', userId }),

  // Journal events
  journalEntryAdded: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'journalEntryAdded', userId, metadata }),

  // Music events
  musicGenerationStarted: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'musicGenerationStarted', userId, metadata }),

  musicGenerationFinished: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'musicGenerationFinished', userId, metadata }),

  // Voice events
  voiceTranscriptRequested: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'voiceTranscriptRequested', userId, metadata }),

  voiceTranscriptDone: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'voiceTranscriptDone', userId, metadata }),

  // Emotional scan events
  emotionalScanStarted: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'emotionalScanStarted', userId, metadata }),

  emotionalScanCompleted: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'emotionalScanCompleted', userId, metadata }),

  // Coach events
  coachSessionStarted: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'coachSessionStarted', userId, metadata }),

  coachQuestionAsked: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'coachQuestionAsked', userId, metadata }),

  // Social events
  postCreated: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'postCreated', userId, metadata }),

  commentAdded: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'commentAdded', userId, metadata }),

  // VR events (if enabled)
  vrSessionStarted: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'vrSessionStarted', userId, metadata }),

  vrSessionCompleted: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'vrSessionCompleted', userId, metadata }),

  // Onboarding events
  onboardingStarted: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'onboardingStarted', userId, metadata }),

  onboardingCompleted: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'onboardingCompleted', userId, metadata }),

  onboardingStepCompleted: (userId: string, metadata?: Record<string, any>) =>
    trackEvent({ event: 'onboardingStepCompleted', userId, metadata }),
};
