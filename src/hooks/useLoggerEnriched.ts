import { useState, useCallback, useMemo } from 'react';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  component?: string;
  userId?: string;
  sessionId?: string;
  tags?: string[];
}

export interface LogFilter {
  levels?: LogLevel[];
  startDate?: Date;
  endDate?: Date;
  component?: string;
  searchTerm?: string;
  tags?: string[];
}

export interface LogStats {
  totalLogs: number;
  byLevel: Record<LogLevel, number>;
  byComponent: Record<string, number>;
  errorsLast24h: number;
  criticalAlerts: number;
  mostActiveComponent: string | null;
  averageLogsPerHour: number;
}

export interface LogAlert {
  id: string;
  level: LogLevel;
  threshold: number;
  timeWindowMinutes: number;
  enabled: boolean;
  lastTriggered?: Date;
  notificationSent: boolean;
}

const STORAGE_KEY = 'emotionscare_logs';
const ALERTS_KEY = 'emotionscare_log_alerts';
const MAX_LOGS = 10000;

const generateId = () => `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('log_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}`;
    sessionStorage.setItem('log_session_id', sessionId);
  }
  return sessionId;
};

export function useLoggerEnriched(component?: string) {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).map((l: LogEntry) => ({
        ...l,
        timestamp: new Date(l.timestamp)
      })) : [];
    } catch {
      return [];
    }
  });

  const [alerts, setAlerts] = useState<LogAlert[]>(() => {
    try {
      const stored = localStorage.getItem(ALERTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const persistLogs = useCallback((newLogs: LogEntry[]) => {
    const trimmed = newLogs.slice(-MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    setLogs(trimmed);
  }, []);

  const persistAlerts = useCallback((newAlerts: LogAlert[]) => {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(newAlerts));
    setAlerts(newAlerts);
  }, []);

  const log = useCallback((level: LogLevel, message: string, context?: Record<string, unknown>, tags?: string[]) => {
    const entry: LogEntry = {
      id: generateId(),
      timestamp: new Date(),
      level,
      message,
      context,
      component,
      sessionId: getSessionId(),
      tags
    };

    setLogs(prev => {
      const updated = [...prev, entry];
      persistLogs(updated);
      return updated;
    });

    // Console output
    const consoleMethod = level === 'critical' ? 'error' : level;
    console[consoleMethod]?.(`[${level.toUpperCase()}] ${component ? `[${component}] ` : ''}${message}`, context || '');

    return entry;
  }, [component, persistLogs]);

  const debug = useCallback((message: string, context?: Record<string, unknown>) => log('debug', message, context), [log]);
  const info = useCallback((message: string, context?: Record<string, unknown>) => log('info', message, context), [log]);
  const warn = useCallback((message: string, context?: Record<string, unknown>) => log('warn', message, context), [log]);
  const error = useCallback((message: string, context?: Record<string, unknown>) => log('error', message, context), [log]);
  const critical = useCallback((message: string, context?: Record<string, unknown>) => log('critical', message, context, ['critical']), [log]);

  const filterLogs = useCallback((filter: LogFilter): LogEntry[] => {
    return logs.filter(entry => {
      if (filter.levels && !filter.levels.includes(entry.level)) return false;
      if (filter.startDate && entry.timestamp < filter.startDate) return false;
      if (filter.endDate && entry.timestamp > filter.endDate) return false;
      if (filter.component && entry.component !== filter.component) return false;
      if (filter.searchTerm && !entry.message.toLowerCase().includes(filter.searchTerm.toLowerCase())) return false;
      if (filter.tags && !filter.tags.some(t => entry.tags?.includes(t))) return false;
      return true;
    });
  }, [logs]);

  const stats = useMemo((): LogStats => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const byLevel: Record<LogLevel, number> = { debug: 0, info: 0, warn: 0, error: 0, critical: 0 };
    const byComponent: Record<string, number> = {};
    
    logs.forEach(entry => {
      byLevel[entry.level]++;
      if (entry.component) {
        byComponent[entry.component] = (byComponent[entry.component] || 0) + 1;
      }
    });

    const errorsLast24h = logs.filter(l => 
      (l.level === 'error' || l.level === 'critical') && l.timestamp >= last24h
    ).length;

    const criticalAlerts = logs.filter(l => l.level === 'critical').length;

    const mostActiveComponent = Object.entries(byComponent)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    const hoursSpan = logs.length > 0 
      ? Math.max(1, (now.getTime() - logs[0].timestamp.getTime()) / (1000 * 60 * 60))
      : 1;

    return {
      totalLogs: logs.length,
      byLevel,
      byComponent,
      errorsLast24h,
      criticalAlerts,
      mostActiveComponent,
      averageLogsPerHour: logs.length / hoursSpan
    };
  }, [logs]);

  const addAlert = useCallback((level: LogLevel, threshold: number, timeWindowMinutes: number) => {
    const alert: LogAlert = {
      id: generateId(),
      level,
      threshold,
      timeWindowMinutes,
      enabled: true,
      notificationSent: false
    };
    persistAlerts([...alerts, alert]);
    return alert;
  }, [alerts, persistAlerts]);

  const removeAlert = useCallback((alertId: string) => {
    persistAlerts(alerts.filter(a => a.id !== alertId));
  }, [alerts, persistAlerts]);

  const toggleAlert = useCallback((alertId: string) => {
    persistAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, enabled: !a.enabled } : a
    ));
  }, [alerts, persistAlerts]);

  const exportLogs = useCallback((filter?: LogFilter, format: 'json' | 'csv' = 'json'): string => {
    const data = filter ? filterLogs(filter) : logs;
    
    if (format === 'csv') {
      const headers = ['id', 'timestamp', 'level', 'message', 'component', 'sessionId', 'tags'];
      const rows = data.map(entry => [
        entry.id,
        entry.timestamp.toISOString(),
        entry.level,
        `"${entry.message.replace(/"/g, '""')}"`,
        entry.component || '',
        entry.sessionId || '',
        entry.tags?.join(';') || ''
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }
    
    return JSON.stringify(data, null, 2);
  }, [logs, filterLogs]);

  const downloadLogs = useCallback((filter?: LogFilter, format: 'json' | 'csv' = 'json') => {
    const content = exportLogs(filter, format);
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportLogs]);

  const clearLogs = useCallback((filter?: LogFilter) => {
    if (filter) {
      const toRemove = filterLogs(filter);
      const toRemoveIds = new Set(toRemove.map(l => l.id));
      persistLogs(logs.filter(l => !toRemoveIds.has(l.id)));
    } else {
      persistLogs([]);
    }
  }, [logs, filterLogs, persistLogs]);

  const getRecentErrors = useCallback((minutes: number = 60): LogEntry[] => {
    const since = new Date(Date.now() - minutes * 60 * 1000);
    return logs.filter(l => 
      (l.level === 'error' || l.level === 'critical') && l.timestamp >= since
    );
  }, [logs]);

  return {
    // Logging methods
    log,
    debug,
    info,
    warn,
    error,
    critical,
    
    // Query & filter
    logs,
    filterLogs,
    getRecentErrors,
    
    // Statistics
    stats,
    
    // Alerts
    alerts,
    addAlert,
    removeAlert,
    toggleAlert,
    
    // Export & management
    exportLogs,
    downloadLogs,
    clearLogs
  };
}
