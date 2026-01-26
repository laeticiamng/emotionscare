// @ts-nocheck
import { logger } from '@/lib/logger';
import { Sentry } from '@/lib/errors/sentry-compat';

export type ScanEventName =
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'scan_mode_changed'
  | 'scan_feedback_shown'
  | 'scan_history_viewed'
  | 'scan_submitted'
  | 'camera_permission_granted'
  | 'camera_permission_denied'
  | 'camera_analysis_started'
  | 'camera_analysis_completed'
  | 'slider_adjusted'
  | 'consent_prompted'
  | 'consent_accepted'
  | 'consent_declined';

interface ScanEventProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track scan-related analytics events
 */
export function trackScanEvent(
  eventName: ScanEventName,
  properties?: ScanEventProperties,
) {
  // Add to Sentry breadcrumbs for debugging
  Sentry.addBreadcrumb({
    category: 'analytics',
    message: `scan_event:${eventName}`,
    level: 'info',
    data: properties,
  });

  // Track with Sentry custom event
  Sentry.captureMessage(`Analytics: ${eventName}`, {
    level: 'info',
    tags: {
      event_category: 'scan',
      event_name: eventName,
    },
    extra: properties,
  });

  // Log to console in development
  if (import.meta.env.DEV) {
    logger.debug('[Analytics]', eventName, properties, 'LIB');
  }

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      event_category: 'scan',
      ...properties
    });
  }

  // Send to Mixpanel if available
  if (typeof window !== 'undefined' && (window as any).mixpanel) {
    (window as any).mixpanel.track(eventName, properties);
  }

  // Send to Sentry as breadcrumb for error context
  Sentry.addBreadcrumb({
    category: 'analytics',
    message: eventName,
    data: properties,
    level: 'info'
  });
}

/**
 * Track onboarding flow
 */
export const scanAnalytics = {
  onboardingStarted: () => {
    trackScanEvent('onboarding_started', {
      timestamp: Date.now(),
    });
  },

  onboardingCompleted: (stepCount: number) => {
    trackScanEvent('onboarding_completed', {
      step_count: stepCount,
      timestamp: Date.now(),
    });
  },

  onboardingSkipped: (currentStep: number, totalSteps: number) => {
    trackScanEvent('onboarding_skipped', {
      current_step: currentStep,
      total_steps: totalSteps,
      completion_rate: (currentStep / totalSteps) * 100,
      timestamp: Date.now(),
    });
  },

  modeChanged: (from: string, to: string) => {
    trackScanEvent('scan_mode_changed', {
      from_mode: from,
      to_mode: to,
      timestamp: Date.now(),
    });
  },

  feedbackShown: (type: 'badge' | 'toast', duration?: number) => {
    trackScanEvent('scan_feedback_shown', {
      feedback_type: type,
      duration_ms: duration,
      timestamp: Date.now(),
    });
  },

  historyViewed: (scanCount: number) => {
    trackScanEvent('scan_history_viewed', {
      scan_count: scanCount,
      timestamp: Date.now(),
    });
  },

  scanSubmitted: (source: string, valence: number, arousal: number, hasConsent: boolean) => {
    trackScanEvent('scan_submitted', {
      source,
      valence,
      arousal,
      has_consent: hasConsent,
      timestamp: Date.now(),
    });
  },

  cameraPermissionGranted: () => {
    trackScanEvent('camera_permission_granted', {
      timestamp: Date.now(),
    });
  },

  cameraPermissionDenied: () => {
    trackScanEvent('camera_permission_denied', {
      timestamp: Date.now(),
    });
  },

  cameraAnalysisStarted: () => {
    trackScanEvent('camera_analysis_started', {
      timestamp: Date.now(),
    });
  },

  cameraAnalysisCompleted: (durationMs: number) => {
    trackScanEvent('camera_analysis_completed', {
      duration_ms: durationMs,
      timestamp: Date.now(),
    });
  },

  sliderAdjusted: (type: 'valence' | 'arousal', value: number) => {
    trackScanEvent('slider_adjusted', {
      slider_type: type,
      value,
      timestamp: Date.now(),
    });
  },

  consentPrompted: (consentType: 'participation' | 'clinical') => {
    trackScanEvent('consent_prompted', {
      consent_type: consentType,
      timestamp: Date.now(),
    });
  },

  consentAccepted: (consentType: 'participation' | 'clinical') => {
    trackScanEvent('consent_accepted', {
      consent_type: consentType,
      timestamp: Date.now(),
    });
  },

  consentDeclined: (consentType: 'participation' | 'clinical') => {
    trackScanEvent('consent_declined', {
      consent_type: consentType,
      timestamp: Date.now(),
    });
  },
};
