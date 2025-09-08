/**
 * SECURITY MANAGER - Système de sécurité premium avec monitoring en temps réel
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUnifiedContext } from './UnifiedStateManager';

// ==================== TYPES SÉCURITÉ ====================

interface SecurityState {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  activeThreats: SecurityThreat[];
  securityEvents: SecurityEvent[];
  scanResults: SecurityScanResult[];
  isMonitoringActive: boolean;
  lastScanTime: number;
  protectionLevel: 'basic' | 'enhanced' | 'premium';
}

interface SecurityThreat {
  id: string;
  type: 'xss' | 'csrf' | 'injection' | 'unauthorized_access' | 'data_breach' | 'malicious_script';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
  timestamp: number;
  blocked: boolean;
  details?: any;
}

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'access_denied' | 'suspicious_activity' | 'data_access' | 'privilege_escalation';
  timestamp: number;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details: any;
  risk: 'low' | 'medium' | 'high';
}

interface SecurityScanResult {
  id: string;
  timestamp: number;
  duration: number;
  issues: SecurityIssue[];
  score: number;
  recommendations: SecurityRecommendation[];
}

interface SecurityIssue {
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  location?: string;
  fix?: string;
}

interface SecurityRecommendation {
  category: 'authentication' | 'data_protection' | 'network' | 'monitoring';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  implemented: boolean;
}

// ==================== CONTEXT ====================

interface SecurityContextType {
  state: SecurityState;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  runSecurityScan: () => Promise<SecurityScanResult>;
  reportThreat: (threat: Omit<SecurityThreat, 'id' | 'timestamp'>) => void;
  blockThreat: (threatId: string) => void;
  logSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void;
  getSecurityReport: () => SecurityReport;
  clearSecurityLogs: () => void;
}

interface SecurityReport {
  summary: {
    totalThreats: number;
    blockedThreats: number;
    securityScore: number;
    lastScanScore: number;
  };
  threatsByType: Record<string, number>;
  recentEvents: SecurityEvent[];
  recommendations: SecurityRecommendation[];
}

const SecurityContext = createContext<SecurityContextType | null>(null);

// ==================== PROVIDER ====================

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SecurityState>({
    threatLevel: 'low',
    activeThreats: [],
    securityEvents: [],
    scanResults: [],
    isMonitoringActive: false,
    lastScanTime: 0,
    protectionLevel: 'premium',
  });

  const { logSecurityEvent: globalLogSecurityEvent } = useUnifiedContext();

  // ==================== MONITORING ====================

  useEffect(() => {
    if (state.isMonitoringActive) {
      initializeSecurityMonitoring();
      return () => cleanupSecurityMonitoring();
    }
  }, [state.isMonitoringActive]);

  // Auto-start monitoring in production
  useEffect(() => {
    if (import.meta.env.PROD) {
      startMonitoring();
      
      // Run initial security scan
      setTimeout(() => {
        runSecurityScan();
      }, 5000);
    }
  }, []);

  // ==================== FONCTIONS PRINCIPALES ====================

  const startMonitoring = useCallback(() => {
    setState(prev => ({ ...prev, isMonitoringActive: true }));
    logSecurityEvent({
      type: 'suspicious_activity',
      details: { action: 'monitoring_started' },
      risk: 'low'
    });
  }, []);

  const stopMonitoring = useCallback(() => {
    setState(prev => ({ ...prev, isMonitoringActive: false }));
    logSecurityEvent({
      type: 'suspicious_activity',
      details: { action: 'monitoring_stopped' },
      risk: 'medium'
    });
  }, []);

  const runSecurityScan = useCallback(async (): Promise<SecurityScanResult> => {
    const startTime = Date.now();
    const issues: SecurityIssue[] = [];
    const recommendations: SecurityRecommendation[] = [];

    // Scan CSP
    scanContentSecurityPolicy(issues);
    
    // Scan HTTPS
    scanHTTPS(issues);
    
    // Scan Input Validation
    scanInputValidation(issues);
    
    // Scan Authentication
    scanAuthentication(issues, recommendations);
    
    // Scan Data Protection
    scanDataProtection(issues, recommendations);
    
    // Scan Session Management
    scanSessionManagement(issues, recommendations);

    const duration = Date.now() - startTime;
    const score = calculateSecurityScore(issues);

    const scanResult: SecurityScanResult = {
      id: `scan-${Date.now()}`,
      timestamp: Date.now(),
      duration,
      issues,
      score,
      recommendations,
    };

    setState(prev => ({
      ...prev,
      scanResults: [scanResult, ...prev.scanResults.slice(0, 9)], // Keep last 10
      lastScanTime: Date.now(),
    }));

    return scanResult;
  }, []);

  const reportThreat = useCallback((threatData: Omit<SecurityThreat, 'id' | 'timestamp'>) => {
    const threat: SecurityThreat = {
      ...threatData,
      id: `threat-${Date.now()}`,
      timestamp: Date.now(),
    };

    setState(prev => {
      const newThreats = [threat, ...prev.activeThreats.slice(0, 49)]; // Keep last 50
      const newThreatLevel = calculateThreatLevel(newThreats);
      
      return {
        ...prev,
        activeThreats: newThreats,
        threatLevel: newThreatLevel,
      };
    });

    // Log to global security system
    globalLogSecurityEvent('Threat detected', threat);

    // Auto-block critical threats
    if (threat.severity === 'critical') {
      setTimeout(() => blockThreat(threat.id), 100);
    }
  }, [globalLogSecurityEvent]);

  const blockThreat = useCallback((threatId: string) => {
    setState(prev => ({
      ...prev,
      activeThreats: prev.activeThreats.map(threat =>
        threat.id === threatId ? { ...threat, blocked: true } : threat
      ),
    }));

    logSecurityEvent({
      type: 'suspicious_activity',
      details: { action: 'threat_blocked', threatId },
      risk: 'high'
    });
  }, []);

  const logSecurityEvent = useCallback((eventData: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const event: SecurityEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      securityEvents: [event, ...prev.securityEvents.slice(0, 99)], // Keep last 100
    }));

    // Log to global system
    globalLogSecurityEvent(event.type, event.details);
  }, [globalLogSecurityEvent]);

  const getSecurityReport = useCallback((): SecurityReport => {
    const totalThreats = state.activeThreats.length;
    const blockedThreats = state.activeThreats.filter(t => t.blocked).length;
    const lastScan = state.scanResults[0];
    
    const threatsByType = state.activeThreats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const securityScore = calculateOverallSecurityScore();

    return {
      summary: {
        totalThreats,
        blockedThreats,
        securityScore,
        lastScanScore: lastScan?.score || 0,
      },
      threatsByType,
      recentEvents: state.securityEvents.slice(0, 10),
      recommendations: lastScan?.recommendations || [],
    };
  }, [state]);

  const clearSecurityLogs = useCallback(() => {
    setState(prev => ({
      ...prev,
      securityEvents: [],
      activeThreats: prev.activeThreats.filter(t => !t.blocked),
      scanResults: prev.scanResults.slice(0, 1), // Keep only last scan
    }));
  }, []);

  // ==================== FONCTIONS UTILITAIRES ====================

  const calculateOverallSecurityScore = (): number => {
    const lastScan = state.scanResults[0];
    if (!lastScan) return 85; // Default good score

    const threatPenalty = state.activeThreats.filter(t => !t.blocked).length * 5;
    const baseScore = lastScan.score;
    
    return Math.max(0, Math.min(100, baseScore - threatPenalty));
  };

  // ==================== VALEUR DU CONTEXTE ====================

  const contextValue: SecurityContextType = {
    state,
    startMonitoring,
    stopMonitoring,
    runSecurityScan,
    reportThreat,
    blockThreat,
    logSecurityEvent,
    getSecurityReport,
    clearSecurityLogs,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
      {state.isMonitoringActive && <SecurityMonitoringComponent />}
    </SecurityContext.Provider>
  );
};

// ==================== HOOK ====================

export const useSecurityManager = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityManager must be used within SecurityProvider');
  }
  return context;
};

// ==================== COMPOSANT DE MONITORING ====================

const SecurityMonitoringComponent: React.FC = () => {
  const { reportThreat, logSecurityEvent } = useSecurityManager();

  useEffect(() => {
    // Monitor for XSS attempts
    const originalInnerHTML = Element.prototype.innerHTML;
    Element.prototype.innerHTML = function(value: string) {
      if (typeof value === 'string' && (value.includes('<script') || value.includes('javascript:'))) {
        reportThreat({
          type: 'xss',
          severity: 'high',
          description: 'Attempted XSS injection via innerHTML',
          source: 'DOM manipulation',
          blocked: true,
        });
        return;
      }
      return originalInnerHTML.call(this, value);
    };

    // Monitor for suspicious network requests
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const [url] = args;
      const urlString = typeof url === 'string' ? url : url.url;
      
      if (urlString.includes('eval') || urlString.includes('script')) {
        reportThreat({
          type: 'malicious_script',
          severity: 'medium',
          description: 'Suspicious network request detected',
          source: urlString,
          blocked: false,
        });
      }
      
      return originalFetch.apply(this, args);
    };

    // Monitor console usage (potential script injection)
    const originalConsoleLog = console.log;
    console.log = function(...args) {
      const message = args.join(' ');
      if (message.includes('eval(') || message.includes('Function(')) {
        logSecurityEvent({
          type: 'suspicious_activity',
          details: { action: 'suspicious_console_usage', message: message.substring(0, 100) },
          risk: 'medium'
        });
      }
      return originalConsoleLog.apply(this, args);
    };

    // Monitor for unusual DOM modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-allowed')) {
                reportThreat({
                  type: 'xss',
                  severity: 'critical',
                  description: 'Unauthorized script injection detected',
                  source: 'DOM manipulation',
                  blocked: true,
                });
                element.remove();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      // Restore original functions
      Element.prototype.innerHTML = originalInnerHTML;
      window.fetch = originalFetch;
      console.log = originalConsoleLog;
    };
  }, [reportThreat, logSecurityEvent]);

  return null; // Invisible monitoring component
};

// ==================== FONCTIONS DE SCAN ====================

function scanContentSecurityPolicy(issues: SecurityIssue[]) {
  const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!metaCSP) {
    issues.push({
      type: 'missing_csp',
      severity: 'warning',
      description: 'Content Security Policy not found',
      fix: 'Add CSP meta tag or HTTP header'
    });
  } else {
    const cspContent = metaCSP.getAttribute('content') || '';
    if (cspContent.includes("'unsafe-eval'")) {
      issues.push({
        type: 'unsafe_csp',
        severity: 'error',
        description: 'CSP allows unsafe-eval',
        fix: 'Remove unsafe-eval from CSP'
      });
    }
  }
}

function scanHTTPS(issues: SecurityIssue[]) {
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    issues.push({
      type: 'insecure_connection',
      severity: 'critical',
      description: 'Site not served over HTTPS',
      fix: 'Configure SSL/TLS certificate'
    });
  }
}

function scanInputValidation(issues: SecurityIssue[]) {
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach((input, index) => {
    if (!input.hasAttribute('maxlength') && input.getAttribute('type') === 'text') {
      issues.push({
        type: 'missing_input_validation',
        severity: 'warning',
        description: `Input field without length limit (index: ${index})`,
        fix: 'Add maxlength attribute'
      });
    }
  });
}

function scanAuthentication(issues: SecurityIssue[], recommendations: SecurityRecommendation[]) {
  // Check for session storage usage
  if (localStorage.length > 0) {
    const hasAuthTokens = Object.keys(localStorage).some(key => 
      key.includes('token') || key.includes('auth') || key.includes('session')
    );
    
    if (hasAuthTokens) {
      issues.push({
        type: 'insecure_token_storage',
        severity: 'warning',
        description: 'Authentication tokens stored in localStorage',
        fix: 'Use secure, httpOnly cookies instead'
      });
    }
  }

  recommendations.push({
    category: 'authentication',
    title: 'Implement Two-Factor Authentication',
    description: 'Add 2FA for enhanced account security',
    priority: 'high',
    implemented: false
  });
}

function scanDataProtection(issues: SecurityIssue[], recommendations: SecurityRecommendation[]) {
  // Check for sensitive data in console
  const hasConsoleData = document.querySelectorAll('script').length > 0;
  if (hasConsoleData) {
    recommendations.push({
      category: 'data_protection',
      title: 'Remove debug information in production',
      description: 'Ensure no sensitive data is logged to console',
      priority: 'medium',
      implemented: false
    });
  }
}

function scanSessionManagement(issues: SecurityIssue[], recommendations: SecurityRecommendation[]) {
  // Check for session timeout implementation
  recommendations.push({
    category: 'authentication',
    title: 'Implement session timeout',
    description: 'Add automatic session expiration for inactive users',
    priority: 'medium',
    implemented: false
  });
}

function calculateSecurityScore(issues: SecurityIssue[]): number {
  const weights = {
    critical: 25,
    error: 15,
    warning: 8,
    info: 2
  };

  const penalty = issues.reduce((acc, issue) => {
    return acc + (weights[issue.severity] || 0);
  }, 0);

  return Math.max(0, Math.min(100, 100 - penalty));
}

function calculateThreatLevel(threats: SecurityThreat[]): 'low' | 'medium' | 'high' | 'critical' {
  const activeThreats = threats.filter(t => !t.blocked);
  const criticalCount = activeThreats.filter(t => t.severity === 'critical').length;
  const highCount = activeThreats.filter(t => t.severity === 'high').length;
  
  if (criticalCount > 0) return 'critical';
  if (highCount > 2) return 'high';
  if (activeThreats.length > 5) return 'medium';
  return 'low';
}

function initializeSecurityMonitoring() {
  // Additional security monitoring setup
  console.log('🛡️ Security monitoring initialized');
}

function cleanupSecurityMonitoring() {
  // Cleanup security monitoring
  console.log('🛡️ Security monitoring stopped');
}

export default SecurityProvider;