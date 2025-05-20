/**
 * Analytics utility for tracking user activities and events
 * This supports both anonymous and identified tracking depending on authentication state
 */

import { User } from '@/types/user';

interface TrackEventOptions {
  properties?: Record<string, any>;
  anonymous?: boolean;
}

interface PageViewOptions {
  title?: string;
  path?: string;
  properties?: Record<string, any>;
}

/**
 * Initializes analytics with user data when they log in
 * @param user The authenticated user
 */
export const identifyUser = (user: User | null): void => {
  if (!user) return;
  
  try {
    // If using a third-party analytics service
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.identify(user.id, {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      });
      
      console.log(`[Analytics] User identified: ${user.id}`);
    }
    
    // Store basic analytics status in localStorage
    localStorage.setItem('analytics_identified', 'true');
    localStorage.setItem('analytics_user_id', user.id);
  } catch (error) {
    console.error('[Analytics] Error identifying user:', error);
  }
};

/**
 * Tracks a custom event
 * @param eventName The name of the event to track
 * @param options Additional options and properties
 */
export const trackEvent = (eventName: string, options: TrackEventOptions = {}): void => {
  try {
    const { properties = {}, anonymous = false } = options;
    
    // If using a third-party analytics service
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track(eventName, {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        anonymous,
      });
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Event: ${eventName}`, properties);
    }
    
    // Store recent events in localStorage for debugging
    try {
      const recentEvents = JSON.parse(localStorage.getItem('analytics_recent_events') || '[]');
      recentEvents.unshift({
        name: eventName,
        properties,
        timestamp: new Date().toISOString(),
      });
      
      // Keep only the last 10 events
      localStorage.setItem('analytics_recent_events', JSON.stringify(recentEvents.slice(0, 10)));
    } catch (error) {
      console.error('[Analytics] Error storing event in localStorage:', error);
    }
  } catch (error) {
    console.error(`[Analytics] Error tracking event ${eventName}:`, error);
  }
};

/**
 * Tracks a page view
 * @param options Page view options
 */
export const trackPageView = (options: PageViewOptions = {}): void => {
  try {
    const { title, path, properties = {} } = options;
    const pagePath = path || (typeof window !== 'undefined' ? window.location.pathname : '');
    const pageTitle = title || (typeof document !== 'undefined' ? document.title : '');
    
    // If using a third-party analytics service
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.page(pageTitle, {
        path: pagePath,
        title: pageTitle,
        ...properties,
      });
    }
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Page View: ${pageTitle || pagePath}`, properties);
    }
  } catch (error) {
    console.error('[Analytics] Error tracking page view:', error);
  }
};

/**
 * Tracks an error event
 * @param errorInfo Error information
 * @param context Additional context
 */
export const trackError = (errorInfo: Error | string, context: Record<string, any> = {}): void => {
  try {
    const errorMessage = typeof errorInfo === 'string' ? errorInfo : errorInfo.message;
    const errorName = typeof errorInfo === 'string' ? 'Error' : errorInfo.name;
    const errorStack = typeof errorInfo === 'string' ? undefined : errorInfo.stack;
    
    trackEvent('Error Occurred', {
      properties: {
        errorName,
        errorMessage,
        errorStack,
        ...context,
      },
    });
  } catch (error) {
    console.error('[Analytics] Error tracking error event:', error);
  }
};

/**
 * Get analytics consent status
 * @returns Whether analytics consent has been given
 */
export const getAnalyticsConsent = (): boolean => {
  try {
    return localStorage.getItem('analytics_consent') === 'true';
  } catch (error) {
    return false;
  }
};

/**
 * Set analytics consent status
 * @param consent Whether to give consent for analytics
 */
export const setAnalyticsConsent = (consent: boolean): void => {
  try {
    localStorage.setItem('analytics_consent', consent ? 'true' : 'false');
    
    // If consent is given, track it
    if (consent) {
      trackEvent('Analytics Consent Given', { anonymous: true });
    }
  } catch (error) {
    console.error('[Analytics] Error setting analytics consent:', error);
  }
};

/**
 * Clear all analytics data (for user logout or privacy requests)
 */
export const clearAnalyticsData = (): void => {
  try {
    localStorage.removeItem('analytics_identified');
    localStorage.removeItem('analytics_user_id');
    localStorage.removeItem('analytics_recent_events');
    
    // If using a third-party analytics service, reset identification
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.identify(null);
    }
    
    console.log('[Analytics] Analytics data cleared');
  } catch (error) {
    console.error('[Analytics] Error clearing analytics data:', error);
  }
};

// Export a default object for easier imports
export default {
  identifyUser,
  trackEvent,
  trackPageView,
  trackError,
  getAnalyticsConsent,
  setAnalyticsConsent,
  clearAnalyticsData,
};
