
import { SECURITY_CONFIG } from './securityConfig';
import { logger } from '@/lib/logger';

interface AuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  success: boolean;
  details?: Record<string, any>;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityAuditService {
  private logs: AuditLog[] = [];
  private readonly maxLogs = 10000;

  /**
   * Enregistre un événement de sécurité
   */
  log(event: Omit<AuditLog, 'id' | 'timestamp' | 'ip' | 'userAgent'>) {
    const auditLog: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      ...event
    };

    this.logs.unshift(auditLog);
    
    // Limiter la taille des logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Envoyer les logs critiques immédiatement
    if (auditLog.risk_level === 'critical') {
      this.sendCriticalAlert(auditLog);
    }

    // Persister en localStorage (en mode dev)
    if (import.meta.env.DEV) {
      localStorage.setItem('security_logs', JSON.stringify(this.logs.slice(0, 100)));
    }

    logger.debug('🔒 Security Event', auditLog, 'SYSTEM');
  }

  /**
   * Enregistre une tentative de connexion
   */
  logLoginAttempt(userId: string | undefined, email: string, success: boolean, details?: any) {
    this.log({
      userId,
      action: 'LOGIN_ATTEMPT',
      resource: 'auth',
      success,
      risk_level: success ? 'low' : 'medium',
      details: {
        email,
        ...details
      }
    });
  }

  /**
   * Enregistre un accès à une ressource protégée
   */
  logResourceAccess(userId: string, resource: string, action: string, success: boolean) {
    this.log({
      userId,
      action: `RESOURCE_${action.toUpperCase()}`,
      resource,
      success,
      risk_level: success ? 'low' : 'high'
    });
  }

  /**
   * Enregistre une violation de sécurité
   */
  logSecurityViolation(userId: string | undefined, violation: string, details?: any) {
    this.log({
      userId,
      action: 'SECURITY_VIOLATION',
      resource: 'security',
      success: false,
      risk_level: 'critical',
      details: {
        violation,
        ...details
      }
    });
  }

  /**
   * Enregistre une modification de données sensibles
   */
  logDataModification(userId: string, dataType: string, operation: string, recordId?: string) {
    this.log({
      userId,
      action: `DATA_${operation.toUpperCase()}`,
      resource: dataType,
      success: true,
      risk_level: 'medium',
      details: {
        recordId,
        operation
      }
    });
  }

  /**
   * Détecte les tentatives d'attaque
   */
  detectSuspiciousActivity(userId: string | undefined): boolean {
    const recentLogs = this.logs.filter(
      log => log.timestamp.getTime() > Date.now() - 60 * 60 * 1000 // Dernière heure
    );

    // Trop de tentatives de connexion échouées
    const failedLogins = recentLogs.filter(
      log => log.action === 'LOGIN_ATTEMPT' && !log.success
    );
    if (failedLogins.length > securityConfig.limits.maxLoginAttempts) {
      this.logSecurityViolation(userId, 'EXCESSIVE_FAILED_LOGINS', {
        count: failedLogins.length
      });
      return true;
    }

    // Trop de requêtes
    const requestCount = recentLogs.filter(log => log.userId === userId).length;
    if (requestCount > securityConfig.limits.maxRequestsPerMinute) {
      this.logSecurityViolation(userId, 'RATE_LIMIT_EXCEEDED', {
        count: requestCount
      });
      return true;
    }

    return false;
  }

  /**
   * Récupère les logs de sécurité
   */
  getLogs(filters?: {
    userId?: string;
    action?: string;
    risk_level?: string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  }): AuditLog[] {
    let filteredLogs = [...this.logs];

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters?.action) {
      filteredLogs = filteredLogs.filter(log => log.action.includes(filters.action!));
    }

    if (filters?.risk_level) {
      filteredLogs = filteredLogs.filter(log => log.risk_level === filters.risk_level);
    }

    if (filters?.fromDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.fromDate!);
    }

    if (filters?.toDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.toDate!);
    }

    return filteredLogs.slice(0, filters?.limit || 100);
  }

  /**
   * Exporte les logs de sécurité
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    const logs = this.getLogs({ limit: 1000 });
    
    if (format === 'csv') {
      const headers = ['Timestamp', 'User ID', 'Action', 'Resource', 'Success', 'Risk Level', 'IP', 'Details'];
      const rows = logs.map(log => [
        log.timestamp.toISOString(),
        log.userId || '',
        log.action,
        log.resource,
        log.success.toString(),
        log.risk_level,
        log.ip,
        JSON.stringify(log.details || {})
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    return JSON.stringify(logs, null, 2);
  }

  private getClientIP(): string {
    // En production, l'IP serait récupérée côté serveur
    return 'unknown';
  }

  private async sendCriticalAlert(log: AuditLog) {
    // En production, envoyer une alerte (email, Slack, etc.)
    logger.critical('🚨 CRITICAL SECURITY ALERT', new Error(log.action), 'SYSTEM');
  }
}

export const securityAudit = new SecurityAuditService();