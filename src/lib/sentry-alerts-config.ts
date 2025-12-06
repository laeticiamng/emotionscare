/**
 * Sentry Alerting Configuration
 * Defines alert rules, thresholds, and integrations for production monitoring
 */

import * as Sentry from '@sentry/react';
import { logger } from '@/lib/logger';

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Alert rule definitions
 */
export interface AlertRule {
  name: string;
  severity: AlertSeverity;
  description: string;
  condition: string;
  threshold: string | number;
  notificationChannels: string[];
  enabled: boolean;
}

/**
 * Sentry Alert Rules for Production Monitoring
 */
export const SENTRY_ALERT_RULES: AlertRule[] = [
  // Error Rate Alerts
  {
    name: 'High Error Rate (5%)',
    severity: AlertSeverity.CRITICAL,
    description: 'Alert when error rate exceeds 5% in 5 minutes',
    condition: 'error_rate',
    threshold: '5%',
    notificationChannels: ['slack', 'pagerduty', 'email'],
    enabled: true,
  },
  {
    name: 'Medium Error Rate (2%)',
    severity: AlertSeverity.WARNING,
    description: 'Alert when error rate exceeds 2% in 5 minutes',
    condition: 'error_rate',
    threshold: '2%',
    notificationChannels: ['slack', 'email'],
    enabled: true,
  },

  // Performance Alerts
  {
    name: 'P95 Response Time > 3s',
    severity: AlertSeverity.WARNING,
    description: 'Alert when 95th percentile response time exceeds 3 seconds',
    condition: 'p95_response_time',
    threshold: '3000ms',
    notificationChannels: ['slack', 'email'],
    enabled: true,
  },
  {
    name: 'P99 Response Time > 5s',
    severity: AlertSeverity.ERROR,
    description: 'Alert when 99th percentile response time exceeds 5 seconds',
    condition: 'p99_response_time',
    threshold: '5000ms',
    notificationChannels: ['slack', 'pagerduty', 'email'],
    enabled: true,
  },

  // Web Vitals Alerts
  {
    name: 'LCP Degradation',
    severity: AlertSeverity.WARNING,
    description: 'Alert when Largest Contentful Paint exceeds 2.5 seconds',
    condition: 'lcp',
    threshold: '2500ms',
    notificationChannels: ['slack', 'email'],
    enabled: true,
  },
  {
    name: 'CLS Degradation',
    severity: AlertSeverity.WARNING,
    description: 'Alert when Cumulative Layout Shift exceeds 0.1',
    condition: 'cls',
    threshold: '0.1',
    notificationChannels: ['slack', 'email'],
    enabled: true,
  },

  // Transaction/Request Alerts
  {
    name: 'High Request Volume',
    severity: AlertSeverity.INFO,
    description: 'Alert when requests exceed 1000 per minute',
    condition: 'request_volume',
    threshold: '1000/min',
    notificationChannels: ['slack'],
    enabled: true,
  },
  {
    name: 'Transaction Failure Rate > 10%',
    severity: AlertSeverity.ERROR,
    description: 'Alert when transaction failure rate exceeds 10%',
    condition: 'transaction_failure_rate',
    threshold: '10%',
    notificationChannels: ['slack', 'pagerduty'],
    enabled: true,
  },

  // Custom Exception Alerts
  {
    name: 'Unhandled Authentication Errors',
    severity: AlertSeverity.ERROR,
    description: 'Alert on authentication/authorization failures',
    condition: 'error_message',
    threshold: 'contains "auth" OR contains "unauthorized"',
    notificationChannels: ['slack', 'pagerduty'],
    enabled: true,
  },
  {
    name: 'Database Connection Errors',
    severity: AlertSeverity.CRITICAL,
    description: 'Alert on database connectivity issues',
    condition: 'error_message',
    threshold: 'contains "database" OR contains "connection" OR contains "postgres"',
    notificationChannels: ['slack', 'pagerduty', 'email'],
    enabled: true,
  },
  {
    name: 'Critical API Integration Failures',
    severity: AlertSeverity.CRITICAL,
    description: 'Alert on failures in critical external APIs (Supabase, OpenAI, etc.)',
    condition: 'error_message',
    threshold: 'contains "supabase" OR contains "openai" OR contains "hume" OR contains "spotify"',
    notificationChannels: ['slack', 'pagerduty', 'email'],
    enabled: true,
  },

  // Uptime/Availability Alerts
  {
    name: 'Service Availability < 99.5%',
    severity: AlertSeverity.CRITICAL,
    description: 'Alert when service availability drops below 99.5%',
    condition: 'uptime',
    threshold: '99.5%',
    notificationChannels: ['slack', 'pagerduty', 'email'],
    enabled: true,
  },
];

/**
 * Initialize Sentry alert integrations
 * Call this in your app initialization
 */
export function initializeSentryAlerts(): void {
  if (!Sentry.getCurrentHub().getClient()) {
    logger.warn('[Sentry Alerts] Sentry client not initialized, skipping alert setup', 'LIB');
    return;
  }

  // Set up alert metadata in scope
  Sentry.configureScope(scope => {
    scope.setTag('monitoring', 'enabled');
    scope.setTag('alerts_version', '1.0.0');

    // Add alert rules context
    scope.setContext('alert_rules', {
      total_rules: SENTRY_ALERT_RULES.length,
      enabled_rules: SENTRY_ALERT_RULES.filter(r => r.enabled).length,
      severities: {
        critical: SENTRY_ALERT_RULES.filter(r => r.severity === AlertSeverity.CRITICAL && r.enabled).length,
        error: SENTRY_ALERT_RULES.filter(r => r.severity === AlertSeverity.ERROR && r.enabled).length,
        warning: SENTRY_ALERT_RULES.filter(r => r.severity === AlertSeverity.WARNING && r.enabled).length,
      },
    });
  });

  if (import.meta.env.DEV) {
    logger.debug('[Sentry Alerts] Configuration loaded', 'LIB');
    logger.debug(`[Sentry Alerts] ${SENTRY_ALERT_RULES.filter(r => r.enabled).length} alert rules enabled`, 'LIB');
  }
}

/**
 * Capture critical alert event
 * Use this for events that should immediately trigger alerts
 */
export function captureAlertEvent(
  message: string,
  severity: AlertSeverity,
  context?: Record<string, unknown>
): void {
  Sentry.withScope(scope => {
    scope.setLevel(severity === AlertSeverity.CRITICAL ? 'fatal' : severity === AlertSeverity.ERROR ? 'error' : 'warning');
    scope.setTag('alert_event', 'true');
    scope.setTag('alert_severity', severity);

    if (context) {
      scope.setContext('alert_context', context);
    }

    Sentry.captureMessage(message, severity === AlertSeverity.CRITICAL ? 'fatal' : severity === AlertSeverity.ERROR ? 'error' : 'warning');
  });
}

/**
 * Track performance threshold violations
 */
export function trackPerformanceAlert(
  metricName: string,
  value: number,
  threshold: number,
  unit: string = 'ms'
): void {
  if (value > threshold) {
    Sentry.withScope(scope => {
      scope.setLevel('warning');
      scope.setTag('performance_alert', 'true');
      scope.setTag('metric', metricName);
      scope.setContext('performance_violation', {
        metric: metricName,
        value,
        threshold,
        unit,
        exceeded_by: value - threshold,
        exceeded_by_percent: ((value - threshold) / threshold * 100).toFixed(2),
      });

      Sentry.captureMessage(`Performance alert: ${metricName} (${value}${unit}) exceeded threshold (${threshold}${unit})`, 'warning');
    });
  }
}

/**
 * Alert on error rate
 */
export function trackErrorRateAlert(errorCount: number, totalCount: number, threshold: number = 0.05): void {
  const errorRate = errorCount / totalCount;

  if (errorRate > threshold) {
    captureAlertEvent(
      `Error rate alert: ${(errorRate * 100).toFixed(2)}% (${errorCount}/${totalCount} requests)`,
      errorRate > 0.1 ? AlertSeverity.CRITICAL : AlertSeverity.WARNING,
      {
        error_count: errorCount,
        total_count: totalCount,
        error_rate: errorRate,
        threshold,
      }
    );
  }
}

/**
 * Alert on critical exceptions
 */
export function alertOnCriticalException(error: Error, context?: Record<string, unknown>): void {
  const criticalPatterns = ['database', 'connection', 'auth', 'supabase', 'openai', 'hume', 'spotify', 'zoom', 'google'];
  const isCritical = criticalPatterns.some(pattern => error.message.toLowerCase().includes(pattern));

  if (isCritical) {
    captureAlertEvent(
      `Critical exception detected: ${error.message}`,
      AlertSeverity.CRITICAL,
      { error_stack: error.stack, ...context }
    );
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Alert configuration for Slack integration
 * Copy these rules to your Sentry project settings
 */
export const SLACK_ALERT_CONFIG = {
  workspace: 'emotionscare',
  channels: {
    critical: '#alerts-critical',
    errors: '#alerts-errors',
    performance: '#alerts-performance',
    general: '#alerts-general',
  },
  rules: [
    {
      name: 'Critical Errors to #alerts-critical',
      condition: 'event.level == "fatal" OR event.level == "error" AND tags.alert_severity == "critical"',
      channels: ['#alerts-critical'],
    },
    {
      name: 'Performance Issues to #alerts-performance',
      condition: 'tags.performance_alert == "true"',
      channels: ['#alerts-performance'],
    },
    {
      name: 'All Errors to #alerts-errors',
      condition: 'event.level == "error"',
      channels: ['#alerts-errors'],
    },
    {
      name: 'Warnings to #alerts-general',
      condition: 'event.level == "warning"',
      channels: ['#alerts-general'],
    },
  ],
};

/**
 * PagerDuty alert configuration
 * For critical on-call incidents
 */
export const PAGERDUTY_ALERT_CONFIG = {
  service_id: process.env.VITE_PAGERDUTY_SERVICE_ID,
  urgency: 'high',
  rules: [
    {
      name: 'Critical Errors',
      condition: 'event.level == "fatal"',
      escalation_policy: 'on-call',
    },
    {
      name: 'Database Failures',
      condition: 'tags.error_type == "database"',
      escalation_policy: 'on-call',
    },
    {
      name: 'Service Down',
      condition: 'event.message CONTAINS "unavailable" OR event.message CONTAINS "down"',
      escalation_policy: 'immediate',
    },
  ],
};

/**
 * Daily/Weekly email digest configuration
 */
export const EMAIL_DIGEST_CONFIG = {
  recipients: [process.env.VITE_ALERT_EMAIL_RECIPIENTS || 'ops@emotionscare.com'],
  frequency: 'daily', // or 'weekly'
  include_metrics: ['error_rate', 'response_time_p95', 'request_volume', 'affected_users'],
  include_top_issues: 10,
  include_top_transactions: 10,
  threshold_summary_only: false, // Include all issues or only threshold violations
};

/**
 * Metric alert thresholds
 * Used for automated performance monitoring
 */
export const METRIC_THRESHOLDS = {
  // Response time (milliseconds)
  response_time_p95: 1000,
  response_time_p99: 3000,

  // Error rates (percentage)
  error_rate_warning: 2,
  error_rate_critical: 5,

  // Web vitals (milliseconds)
  lcp_good: 2500,
  fid_good: 100,
  cls_good: 0.1,

  // Custom metrics
  api_timeout_threshold: 5000,
  database_query_timeout: 2000,

  // Request volume (per minute)
  request_volume_warning: 1000,
  request_volume_critical: 5000,
};

/**
 * Export alert configuration for external tools
 */
export function exportAlertConfiguration(): {
  rules: AlertRule[];
  slack: typeof SLACK_ALERT_CONFIG;
  pagerduty: typeof PAGERDUTY_ALERT_CONFIG;
  email: typeof EMAIL_DIGEST_CONFIG;
  thresholds: typeof METRIC_THRESHOLDS;
} {
  return {
    rules: SENTRY_ALERT_RULES,
    slack: SLACK_ALERT_CONFIG,
    pagerduty: PAGERDUTY_ALERT_CONFIG,
    email: EMAIL_DIGEST_CONFIG,
    thresholds: METRIC_THRESHOLDS,
  };
}
