
import { useEffect, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SecurityEvent {
  type: 'suspicious_activity' | 'multiple_failed_logins' | 'unusual_access_pattern';
  timestamp: number;
  details: Record<string, any>;
}

export const useSecurityMonitor = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const { toast } = useToast();

  const logSecurityEvent = useCallback((event: Omit<SecurityEvent, 'timestamp'>) => {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    };

    setEvents(prev => [...prev.slice(-99), securityEvent]);

    // Alert sur événements critiques
    if (event.type === 'multiple_failed_logins') {
      toast({
        title: "Activité suspecte détectée",
        description: "Plusieurs tentatives de connexion échouées. Votre compte a été temporairement verrouillé.",
        variant: "destructive"
      });
    }

    // Log en développement
    if (import.meta.env.DEV) {
      console.warn('🔒 Security event:', securityEvent);
    }
  }, [toast]);

  const detectSuspiciousActivity = useCallback(() => {
    const now = Date.now();
    const recentEvents = events.filter(e => now - e.timestamp < 5 * 60 * 1000); // 5 minutes

    // Détection de patterns suspects
    const failedLogins = recentEvents.filter(e => e.type === 'multiple_failed_logins');
    if (failedLogins.length >= 3) {
      logSecurityEvent({
        type: 'suspicious_activity',
        details: { pattern: 'repeated_login_failures', count: failedLogins.length }
      });
    }
  }, [events, logSecurityEvent]);

  // Monitor des tentatives de manipulation du DOM
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          const suspiciousNodes = addedNodes.filter(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return false;
            const element = node as Element;
            
            // Détecter les scripts injectés
            if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-vite-dev-id')) {
              return true;
            }
            
            // Détecter les iframes suspects
            if (element.tagName === 'IFRAME' && 
                !element.getAttribute('src')?.startsWith(window.location.origin)) {
              return true;
            }
            
            return false;
          });

          if (suspiciousNodes.length > 0) {
            logSecurityEvent({
              type: 'suspicious_activity',
              details: { type: 'dom_manipulation', nodes: suspiciousNodes.length }
            });
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, [logSecurityEvent]);

  // Monitor des accès console
  useEffect(() => {
    if (import.meta.env.PROD) {
      const originalConsole = { ...console };
      
      let consoleAccess = 0;
      const monitorConsole = () => {
        consoleAccess++;
        if (consoleAccess > 10) {
          logSecurityEvent({
            type: 'suspicious_activity',
            details: { type: 'console_access_detected' }
          });
        }
      };

      // Override console methods
      console.log = (...args) => {
        monitorConsole();
        originalConsole.log(...args);
      };

      console.warn = (...args) => {
        monitorConsole();
        originalConsole.warn(...args);
      };

      console.error = (...args) => {
        monitorConsole();
        originalConsole.error(...args);
      };

      return () => {
        Object.assign(console, originalConsole);
      };
    }
  }, [logSecurityEvent]);

  useEffect(() => {
    detectSuspiciousActivity();
  }, [events, detectSuspiciousActivity]);

  return {
    events,
    logSecurityEvent,
    clearEvents: () => setEvents([])
  };
};

// Hook pour la détection d'injection XSS
export const useXSSProtection = () => {
  useEffect(() => {
    const checkForXSS = (input: string): boolean => {
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe[^>]*>/gi,
        /eval\s*\(/gi,
        /document\.write/gi
      ];

      return xssPatterns.some(pattern => pattern.test(input));
    };

    // Monitor les inputs de formulaires
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target && checkForXSS(target.value)) {
        console.warn('🚨 Potential XSS attempt detected:', target.value);
        target.value = target.value.replace(/[<>]/g, '');
      }
    };

    document.addEventListener('input', handleInput);
    return () => document.removeEventListener('input', handleInput);
  }, []);
};
