// @ts-nocheck
import { logger } from '@/lib/logger';
import { redact } from '@/lib/obs/redact';

type BreadcrumbOptions = {
  message?: string;
  data?: Record<string, unknown> | undefined;
  level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal' | 'log';
  type?: string;
};

export function addBreadcrumb(category: string, options: BreadcrumbOptions = {}): void {
  const { data, level = 'info', message } = options;
  const sanitizedData = data ? (redact(data) as Record<string, unknown>) : undefined;
  
  const logLevel = level === 'warning' ? 'warn' : level === 'fatal' ? 'error' : level;
  if (logLevel === 'info' || logLevel === 'warn' || logLevel === 'error') {
    logger[logLevel](message || '', sanitizedData, category.toUpperCase());
  }
}
