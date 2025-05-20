
/**
 * Analytics utility module.
 * Provides a pluggable provider system so different analytics backends
 * can be used (Amplitude, Segment, Matomo, ...).
 */

export interface AnalyticsProvider {
  trackPageView(path: string): void;
  trackEvent(category: string, action: string, label?: string): void;
}

/**
 * Default analytics provider that simply logs to the console.
 * This keeps analytics fully anonymous while no provider is configured.
 */
class ConsoleAnalyticsProvider implements AnalyticsProvider {
  trackPageView(path: string) {
    console.log(`[analytics] page: ${path}`);
  }

  trackEvent(category: string, action: string, label?: string) {
    console.log(`[analytics] event: ${category}/${action}${label ? ' - ' + label : ''}`);
  }
}

// Current provider instance. Starts with the console provider.
let provider: AnalyticsProvider = new ConsoleAnalyticsProvider();

export const Analytics = {
  /**
   * Replace the analytics provider. This enables plug & play integrations
   * with any analytics API.
   */
  setProvider(newProvider: AnalyticsProvider) {
    provider = newProvider;
  },

  /** Track a page view. */
  trackPageView(path: string) {
    provider.trackPageView(path);
  },

  /** Track a user event. */
  trackEvent(category: string, action: string, label?: string) {
    provider.trackEvent(category, action, label);
  },
};

export type { AnalyticsProvider };
