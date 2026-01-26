// @ts-nocheck
/**
 * Production monitoring and alerting utilities
 */

import { aiMonitoring } from '@/lib/ai-monitoring';
import { logger } from '@/lib/logger';
import { initializeSentryAlerts, trackErrorRateAlert, trackPerformanceAlert } from '@/lib/sentry-alerts-config';

type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';

interface Alert {
  severity: AlertSeverity;
  message: string;
  context?: Record<string, any>;
  timestamp: string;
}

interface MetricData {
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
}

/**
 * Send alert to monitoring system
 */
export function sendAlert(alert: Alert): void {
  // Log to console in development
  if (import.meta.env.DEV) {
    console[alert.severity === 'critical' ? 'error' : alert.severity](
      `[Alert] ${alert.severity.toUpperCase()}: ${alert.message}`,
      alert.context
    );
  }

  // Send to AI Monitoring and Sentry
  if (alert.severity === 'error' || alert.severity === 'critical') {
    aiMonitoring.captureMessage(
      alert.message,
      alert.severity,
      alert.context
    );

    // Also send to Sentry alerts system for configured integrations
    if (alert.severity === 'critical') {
      const { captureAlertEvent, AlertSeverity } = require('@/lib/sentry-alerts-config');
      captureAlertEvent(
        alert.message,
        AlertSeverity.CRITICAL,
        alert.context
      );
    }
  }

  // Send to monitoring-alerts edge function for production alerting
  if (alert.severity === 'error' || alert.severity === 'critical') {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.functions.invoke('monitoring-alerts', {
        body: {
          severity: alert.severity,
          message: alert.message,
          context: alert.context,
          timestamp: new Date().toISOString()
        }
      });
    } catch (edgeFnError) {
      // Fail silently - don't break the app if monitoring fails
      console.error('[Monitoring] Edge function call failed:', edgeFnError);
    }
  }
}

/**
 * Track custom metric
 */
export function trackMetric(metric: MetricData): void {
  // Send to AI Monitoring as performance metric
  aiMonitoring.capturePerformance(metric.name, metric.value, {
    unit: metric.unit,
    ...metric.tags,
  });

  // Log in development
  if (import.meta.env.DEV) {
    logger.debug(`[Metric] ${metric.name}: ${metric.value}${metric.unit || ''}`, metric.tags, 'ANALYTICS');
  }
}

/**
 * Monitor critical business metrics
 */
export function initBusinessMetrics(): void {
  // Track active users
  const trackActiveUser = () => {
    trackMetric({
      name: 'active_users',
      value: 1,
      tags: { page: window.location.pathname },
    });
  };

  trackActiveUser();
  setInterval(trackActiveUser, 60000); // Every minute

  // Track errors rate
  let errorCount = 0;
  const errorHandler = () => {
    errorCount++;
    trackMetric({
      name: 'error_rate',
      value: errorCount,
      unit: 'count',
    });
  };

  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', errorHandler);
}

/**
 * Check system health
 */
export async function checkSystemHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'down';
  checks: Record<string, boolean>;
}> {
  const checks: Record<string, boolean> = {};

  // Check Supabase connection
  try {
    const response = await fetch('https://yaincoxihiqdksxgrsrk.supabase.co/rest/v1/', {
      method: 'HEAD',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU',
      },
    });
    checks.supabase = response.ok;
  } catch {
    checks.supabase = false;
  }

  // Check localStorage
  try {
    localStorage.setItem('health-check', 'ok');
    localStorage.removeItem('health-check');
    checks.localStorage = true;
  } catch {
    checks.localStorage = false;
  }

  // Determine overall status
  const allHealthy = Object.values(checks).every((v) => v);
  const someHealthy = Object.values(checks).some((v) => v);

  return {
    status: allHealthy ? 'healthy' : someHealthy ? 'degraded' : 'down',
    checks,
  };
}

/**
 * Initialize monitoring system
 */
export function initMonitoring(): void {
  // Initialize AI Monitoring
  if (!import.meta.env.DEV) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],
    });
  }

  // Initialize Sentry alerts
  initializeSentryAlerts();

  // Initialize business metrics
  initBusinessMetrics();

  // Track error rate for alerting
  let errorCount = 0;
  let totalCount = 0;
  const trackErrorRate = () => {
    if (totalCount > 0 && totalCount % 50 === 0) {
      // Check error rate every 50 requests
      trackErrorRateAlert(errorCount, totalCount, 0.05); // Alert if > 5%
      errorCount = 0;
      totalCount = 0;
    }
  };

  // Track all API calls for error rate
  if (typeof window !== 'undefined') {
    // Intercept fetch calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      totalCount++;
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          errorCount++;
        }
        trackErrorRate();
        return response;
      } catch (error) {
        errorCount++;
        trackErrorRate();
        throw error;
      }
    };
  }

  // Periodic health checks
  setInterval(async () => {
    const health = await checkSystemHealth();

    if (health.status === 'degraded') {
      sendAlert({
        severity: 'warning',
        message: 'System health degraded',
        context: { checks: health.checks },
        timestamp: new Date().toISOString(),
      });
    } else if (health.status === 'down') {
      sendAlert({
        severity: 'critical',
        message: 'System health critical',
        context: { checks: health.checks },
        timestamp: new Date().toISOString(),
      });
    }
  }, 300000); // Every 5 minutes

  // Performance monitoring with alerts
  if (typeof PerformanceObserver !== 'undefined') {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.duration > 1000) {
          // Alert on operations taking > 1s
          trackPerformanceAlert(
            entry.name,
            entry.duration,
            1000,
            'ms'
          );
        }
      }
    });
    try {
      perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }

  logger.info('[Monitoring] System initialized with Sentry alerting', {}, 'SYSTEM');
}
