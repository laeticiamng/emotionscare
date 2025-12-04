// @ts-nocheck
/**
 * Analytics Integration Module
 * Supports multiple analytics platforms: Google Analytics, Mixpanel, Amplitude, Posthog
 */

import { logger } from '@/lib/logger';

// Analytics Provider Types
type AnalyticsProvider = 'google' | 'mixpanel' | 'amplitude' | 'posthog' | 'internal';

interface AnalyticsConfig {
  providers: AnalyticsProvider[];
  googleAnalyticsId?: string;
  mixpanelToken?: string;
  amplitudeApiKey?: string;
  posthogApiKey?: string;
  posthogHost?: string;
  debug?: boolean;
}

interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  plan?: string;
  segment?: 'b2c' | 'b2b';
  role?: string;
  createdAt?: string;
  [key: string]: any;
}

interface EventProperties {
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// Global declarations for analytics SDKs
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    mixpanel?: any;
    amplitude?: any;
    posthog?: any;
  }
}

class AnalyticsIntegration {
  private config: AnalyticsConfig;
  private initialized: boolean = false;
  private userProperties: UserProperties = {};
  private eventQueue: Array<{ name: string; properties: EventProperties }> = [];

  constructor() {
    this.config = {
      providers: ['internal'],
      debug: import.meta.env.DEV,
    };
  }

  /**
   * Initialize analytics with configuration
   */
  async init(config: Partial<AnalyticsConfig>): Promise<void> {
    this.config = { ...this.config, ...config };

    try {
      // Initialize Google Analytics
      if (this.config.providers.includes('google') && this.config.googleAnalyticsId) {
        await this.initGoogleAnalytics();
      }

      // Initialize Mixpanel
      if (this.config.providers.includes('mixpanel') && this.config.mixpanelToken) {
        await this.initMixpanel();
      }

      // Initialize Amplitude
      if (this.config.providers.includes('amplitude') && this.config.amplitudeApiKey) {
        await this.initAmplitude();
      }

      // Initialize Posthog
      if (this.config.providers.includes('posthog') && this.config.posthogApiKey) {
        await this.initPosthog();
      }

      this.initialized = true;

      // Process queued events
      this.processQueue();

      this.log('Analytics initialized', { providers: this.config.providers });
    } catch (error) {
      logger.error('Failed to initialize analytics', error as Error, 'ANALYTICS');
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  private async initGoogleAnalytics(): Promise<void> {
    const GA_ID = this.config.googleAnalyticsId;
    if (!GA_ID) return;

    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      send_page_view: false, // We'll handle page views manually
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });

    this.log('Google Analytics initialized', { id: GA_ID });
  }

  /**
   * Initialize Mixpanel
   * Note: Requires 'mixpanel-browser' package to be installed
   */
  private async initMixpanel(): Promise<void> {
    const token = this.config.mixpanelToken;
    if (!token) return;

    // Mixpanel SDK not installed - log and skip
    this.log('Mixpanel SDK not installed, skipping initialization. Install with: npm install mixpanel-browser');
  }

  /**
   * Initialize Amplitude
   * Note: Requires '@amplitude/analytics-browser' package to be installed
   */
  private async initAmplitude(): Promise<void> {
    const apiKey = this.config.amplitudeApiKey;
    if (!apiKey) return;

    // Amplitude SDK not installed - log and skip
    this.log('Amplitude SDK not installed, skipping initialization. Install with: npm install @amplitude/analytics-browser');
  }

  /**
   * Initialize Posthog
   * Note: Requires 'posthog-js' package to be installed
   */
  private async initPosthog(): Promise<void> {
    const apiKey = this.config.posthogApiKey;
    if (!apiKey) return;

    // Posthog SDK not installed - log and skip
    this.log('Posthog SDK not installed, skipping initialization. Install with: npm install posthog-js');
  }

  /**
   * Identify user across all providers
   */
  identify(userId: string, properties?: UserProperties): void {
    this.userProperties = { userId, ...properties };

    // Google Analytics
    if (window.gtag) {
      window.gtag('set', 'user_properties', {
        user_id: userId,
        ...properties,
      });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.identify(userId);
      if (properties) {
        window.mixpanel.people.set(properties);
      }
    }

    // Amplitude
    if (window.amplitude) {
      window.amplitude.setUserId(userId);
      if (properties) {
        const identify = new window.amplitude.Identify();
        Object.entries(properties).forEach(([key, value]) => {
          identify.set(key, value);
        });
        window.amplitude.identify(identify);
      }
    }

    // Posthog
    if (window.posthog) {
      window.posthog.identify(userId, properties);
    }

    this.log('User identified', { userId, properties });
  }

  /**
   * Track an event across all providers
   */
  track(eventName: string, properties?: EventProperties): void {
    if (!this.initialized) {
      this.eventQueue.push({ name: eventName, properties: properties || {} });
      return;
    }

    const enrichedProperties = {
      ...properties,
      timestamp: Date.now(),
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      ...this.userProperties,
    };

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: enrichedProperties.category || 'general',
        event_label: enrichedProperties.label,
        value: enrichedProperties.value,
        ...enrichedProperties,
      });
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track(eventName, enrichedProperties);
    }

    // Amplitude
    if (window.amplitude) {
      window.amplitude.track(eventName, enrichedProperties);
    }

    // Posthog
    if (window.posthog) {
      window.posthog.capture(eventName, enrichedProperties);
    }

    this.log('Event tracked', { eventName, properties: enrichedProperties });
  }

  /**
   * Track page view
   */
  page(pageName?: string, properties?: EventProperties): void {
    const pageProperties = {
      page_title: pageName || document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...properties,
    };

    // Google Analytics
    if (window.gtag && this.config.googleAnalyticsId) {
      window.gtag('event', 'page_view', pageProperties);
    }

    // Mixpanel
    if (window.mixpanel) {
      window.mixpanel.track('Page View', pageProperties);
    }

    // Amplitude
    if (window.amplitude) {
      window.amplitude.track('Page View', pageProperties);
    }

    // Posthog
    if (window.posthog) {
      window.posthog.capture('$pageview', pageProperties);
    }

    this.log('Page view tracked', pageProperties);
  }

  /**
   * Track emotion scan event
   */
  trackEmotionScan(scanData: {
    source: 'camera' | 'manual' | 'voice';
    emotions: string[];
    valence: number;
    arousal: number;
    duration?: number;
  }): void {
    this.track('emotion_scan_completed', {
      category: 'emotion',
      ...scanData,
    });
  }

  /**
   * Track music session
   */
  trackMusicSession(sessionData: {
    action: 'play' | 'pause' | 'skip' | 'complete';
    trackId?: string;
    trackName?: string;
    duration?: number;
    emotionContext?: string;
  }): void {
    this.track(`music_${sessionData.action}`, {
      category: 'music',
      ...sessionData,
    });
  }

  /**
   * Track coach interaction
   */
  trackCoachInteraction(interactionData: {
    type: 'message' | 'suggestion_accepted' | 'suggestion_rejected' | 'session_start' | 'session_end';
    topic?: string;
    duration?: number;
    rating?: number;
  }): void {
    this.track(`coach_${interactionData.type}`, {
      category: 'coach',
      ...interactionData,
    });
  }

  /**
   * Track journal entry
   */
  trackJournalEntry(entryData: {
    action: 'create' | 'edit' | 'delete' | 'view';
    entryId?: string;
    emotionTags?: string[];
    wordCount?: number;
  }): void {
    this.track(`journal_${entryData.action}`, {
      category: 'journal',
      ...entryData,
    });
  }

  /**
   * Track breathing exercise
   */
  trackBreathingExercise(exerciseData: {
    action: 'start' | 'pause' | 'complete' | 'cancel';
    exerciseType: string;
    duration?: number;
    cycles?: number;
  }): void {
    this.track(`breathing_${exerciseData.action}`, {
      category: 'breathing',
      ...exerciseData,
    });
  }

  /**
   * Track VR session
   */
  trackVRSession(sessionData: {
    action: 'start' | 'pause' | 'complete' | 'exit';
    environmentType: string;
    duration?: number;
    interactions?: number;
  }): void {
    this.track(`vr_${sessionData.action}`, {
      category: 'vr',
      ...sessionData,
    });
  }

  /**
   * Track challenge progress
   */
  trackChallenge(challengeData: {
    action: 'join' | 'step_complete' | 'complete' | 'abandon';
    challengeId: string;
    challengeName?: string;
    stepNumber?: number;
    totalSteps?: number;
    pointsEarned?: number;
  }): void {
    this.track(`challenge_${challengeData.action}`, {
      category: 'challenge',
      ...challengeData,
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature: string, action: string, properties?: EventProperties): void {
    this.track(`feature_${action}`, {
      category: 'feature_usage',
      feature,
      ...properties,
    });
  }

  /**
   * Track conversion event
   */
  trackConversion(conversionType: string, value?: number, properties?: EventProperties): void {
    this.track('conversion', {
      category: 'conversion',
      conversion_type: conversionType,
      value,
      ...properties,
    });
  }

  /**
   * Track error
   */
  trackError(errorData: {
    message: string;
    stack?: string;
    component?: string;
    action?: string;
  }): void {
    this.track('error', {
      category: 'error',
      ...errorData,
    });
  }

  /**
   * Reset user identity (on logout)
   */
  reset(): void {
    this.userProperties = {};

    if (window.mixpanel) {
      window.mixpanel.reset();
    }

    if (window.amplitude) {
      window.amplitude.reset();
    }

    if (window.posthog) {
      window.posthog.reset();
    }

    this.log('Analytics reset');
  }

  /**
   * Process queued events
   */
  private processQueue(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.track(event.name, event.properties);
      }
    }
  }

  /**
   * Internal logging
   */
  private log(message: string, data?: any): void {
    if (this.config.debug) {
      logger.debug(`[Analytics] ${message}`, data, 'ANALYTICS');
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsIntegration();

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    page: analytics.page.bind(analytics),
    identify: analytics.identify.bind(analytics),
    trackEmotionScan: analytics.trackEmotionScan.bind(analytics),
    trackMusicSession: analytics.trackMusicSession.bind(analytics),
    trackCoachInteraction: analytics.trackCoachInteraction.bind(analytics),
    trackJournalEntry: analytics.trackJournalEntry.bind(analytics),
    trackBreathingExercise: analytics.trackBreathingExercise.bind(analytics),
    trackVRSession: analytics.trackVRSession.bind(analytics),
    trackChallenge: analytics.trackChallenge.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
};

export default analytics;
