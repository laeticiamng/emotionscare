// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface UXEvent {
  type: 'click' | 'scroll' | 'navigation' | 'error' | 'engagement';
  element?: string;
  page: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  events: UXEvent[];
  device: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
}

interface UXMetrics {
  timeOnPage: number;
  scrollDepth: number;
  clickHeatmap: Record<string, number>;
  navigationPath: string[];
  errorsEncountered: string[];
  engagementScore: number;
}

export const useUXAnalytics = () => {
  let location, navigate;
  
  try {
    location = useLocation();
    navigate = useNavigate();
  } catch (error) {
    // Fallback si pas dans un contexte Router
    location = { pathname: '/' };
    navigate = () => {};
  }
  
  const [session, setSession] = useState<UserSession>(() => ({
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now(),
    events: [],
    device: getDeviceType(),
    userAgent: navigator.userAgent
  }));
  
  const [metrics, setMetrics] = useState<UXMetrics>({
    timeOnPage: 0,
    scrollDepth: 0,
    clickHeatmap: {},
    navigationPath: [location.pathname],
    errorsEncountered: [],
    engagementScore: 0
  });

  // Détection du type d'appareil
  function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Enregistrement des événements UX
  const trackEvent = useCallback((event: Omit<UXEvent, 'timestamp' | 'page'>) => {
    const fullEvent: UXEvent = {
      ...event,
      page: location.pathname,
      timestamp: Date.now()
    };

    setSession(prev => ({
      ...prev,
      events: [...prev.events, fullEvent]
    }));

    // Mise à jour des métriques en temps réel
    updateMetrics(fullEvent);
  }, []); // Remove location.pathname from dependencies

  // Mise à jour des métriques
  const updateMetrics = useCallback((event: UXEvent) => {
    setMetrics(prev => {
      const newMetrics = { ...prev };
      
      switch (event.type) {
        case 'click':
          const element = event.element || 'unknown';
          newMetrics.clickHeatmap[element] = (newMetrics.clickHeatmap[element] || 0) + 1;
          newMetrics.engagementScore += 1;
          break;
          
        case 'scroll':
          const scrollDepth = event.metadata?.scrollDepth || 0;
          newMetrics.scrollDepth = Math.max(newMetrics.scrollDepth, scrollDepth);
          newMetrics.engagementScore += scrollDepth > 75 ? 2 : 0.5;
          break;
          
        case 'navigation':
          const newPath = event.metadata?.to || event.page;
          if (!newMetrics.navigationPath.includes(newPath)) {
            newMetrics.navigationPath.push(newPath);
          }
          break;
          
        case 'error':
          const error = event.metadata?.error || 'Unknown error';
          newMetrics.errorsEncountered.push(error);
          newMetrics.engagementScore = Math.max(0, newMetrics.engagementScore - 5);
          break;
          
        case 'engagement':
          newMetrics.engagementScore += event.metadata?.score || 1;
          break;
      }
      
      return newMetrics;
    });
  }, []); // Remove location.pathname from dependencies

  // Tracking automatique des clics
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementInfo = getElementInfo(target);
      
      trackEvent({
        type: 'click',
        element: elementInfo,
        metadata: {
          x: e.clientX,
          y: e.clientY,
          targetTag: target.tagName,
          targetClass: target.className,
          targetId: target.id
        }
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []); // Empty dependencies

  // Tracking automatique du scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      trackEvent({
        type: 'scroll',
        metadata: { scrollDepth }
      });
    };

    const throttledScroll = throttle(handleScroll, 1000);
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []); // Empty dependencies

  // Tracking des erreurs
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      trackEvent({
        type: 'error',
        metadata: {
          error: e.message,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno
        }
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []); // Empty dependencies

  // Tracking de la navigation
  useEffect(() => {
    trackEvent({
      type: 'navigation',
      metadata: { to: location.pathname, from: metrics.navigationPath[metrics.navigationPath.length - 1] }
    });
  }, [location.pathname]); // Only depend on location.pathname

  // Calcul du temps sur la page
  useEffect(() => {
    const interval = setInterval(() => {
      const timeOnPage = Date.now() - session.startTime;
      setMetrics(prev => ({ ...prev, timeOnPage }));
    }, 1000);

    return () => clearInterval(interval);
  }, [session.startTime]);

  // Fonctions utilitaires
  function getElementInfo(element: HTMLElement): string {
    const id = element.id ? `#${element.id}` : '';
    const classes = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const tag = element.tagName.toLowerCase();
    const text = element.textContent?.slice(0, 20) || '';
    
    return `${tag}${id}${classes}${text ? ` (${text})` : ''}`;
  }

  function throttle(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // API publique
  const exportSessionData = useCallback(() => {
    return {
      ...session,
      metrics,
      duration: Date.now() - session.startTime,
      exportedAt: new Date().toISOString()
    };
  }, [session, metrics]);

  const getConversionFunnel = useCallback(() => {
    const funnel = {
      landingPage: metrics.navigationPath[0],
      currentPage: location.pathname,
      stepCount: metrics.navigationPath.length,
      conversionPath: metrics.navigationPath,
      dropOffStep: null as string | null
    };

    // Détection des points d'abandon potentiels
    const timePerPage = session.events
      .filter(e => e.type === 'navigation')
      .map((e, i, arr) => ({
        page: e.metadata?.to || '',
        timeSpent: i < arr.length - 1 ? arr[i + 1].timestamp - e.timestamp : 0
      }));

    const avgTime = timePerPage.reduce((sum, p) => sum + p.timeSpent, 0) / timePerPage.length;
    funnel.dropOffStep = timePerPage.find(p => p.timeSpent < avgTime * 0.3)?.page || null;

    return funnel;
  }, [session.events, metrics.navigationPath, location.pathname]);

  const getUserPersona = useCallback(() => {
    const persona = {
      device: session.device,
      engagementLevel: metrics.engagementScore > 50 ? 'high' : metrics.engagementScore > 20 ? 'medium' : 'low',
      navigationStyle: metrics.navigationPath.length > 5 ? 'explorer' : 'focused',
      primaryPages: Object.entries(
        metrics.navigationPath.reduce((acc, page) => {
          acc[page] = (acc[page] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).sort(([,a], [,b]) => b - a).slice(0, 3).map(([page]) => page),
      errorProne: metrics.errorsEncountered.length > 2,
      sessionDuration: Date.now() - session.startTime
    };

    return persona;
  }, [session, metrics]);

  return {
    session,
    metrics,
    trackEvent,
    exportSessionData,
    getConversionFunnel,
    getUserPersona
  };
};