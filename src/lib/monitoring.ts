// @ts-nocheck
/**
 * Production monitoring and alerting utilities
 */

import * as Sentry from '@sentry/react';
import { logger } from '@/lib/logger';

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

  // Send to Sentry
  if (alert.severity === 'error' || alert.severity === 'critical') {
    Sentry.captureMessage(alert.message, {
      level: alert.severity === 'critical' ? 'fatal' : 'error',
      contexts: {
        alert: alert.context || {},
      },
    });
  }

  // Edge function désactivée temporairement (fonction inexistante)
  // TODO: Créer l'edge function monitoring-alerts si nécessaire
  // Pour l'instant, les alertes sont loggées localement et envoyées à Sentry uniquement
}

/**
 * Track custom metric
 */
export function trackMetric(metric: MetricData): void {
  // Send to Sentry
  Sentry.metrics.distribution(metric.name, metric.value, {
    unit: metric.unit,
    tags: metric.tags,
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
  // Initialize Sentry
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

  // Initialize business metrics
  initBusinessMetrics();

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

  logger.info('[Monitoring] System initialized', {}, 'SYSTEM');
}
