/**
 * useHomePageAnalytics - Hook pour analytics et tracking de la HomePage
 * Suit les interactions utilisateur et génère des insights
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PageView {
  path: string;
  timestamp: Date;
  referrer: string;
  duration: number;
}

interface UserInteraction {
  type: 'click' | 'scroll' | 'hover' | 'cta_view';
  target: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

interface ConversionMetrics {
  ctaViews: number;
  ctaClicks: number;
  signupAttempts: number;
  sessionStarts: number;
  conversionRate: number;
}

interface ScrollMetrics {
  maxScrollDepth: number;
  timeOnPage: number;
  scrollSpeed: number;
  pausePoints: string[];
}

interface UseHomePageAnalyticsReturn {
  pageView: PageView | null;
  interactions: UserInteraction[];
  conversionMetrics: ConversionMetrics;
  scrollMetrics: ScrollMetrics;
  trackInteraction: (type: UserInteraction['type'], target: string, metadata?: Record<string, unknown>) => void;
  trackCTAView: (ctaId: string) => void;
  trackCTAClick: (ctaId: string) => void;
  getEngagementScore: () => number;
}

export function useHomePageAnalytics(): UseHomePageAnalyticsReturn {
  const { isAuthenticated } = useAuth();
  const [pageView, setPageView] = useState<PageView | null>(null);
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [startTime] = useState(Date.now());
  
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics>({
    ctaViews: 0,
    ctaClicks: 0,
    signupAttempts: 0,
    sessionStarts: 0,
    conversionRate: 0,
  });

  const [scrollMetrics, setScrollMetrics] = useState<ScrollMetrics>({
    maxScrollDepth: 0,
    timeOnPage: 0,
    scrollSpeed: 0,
    pausePoints: [],
  });

  // Initialiser la page view
  useEffect(() => {
    const pv: PageView = {
      path: window.location.pathname,
      timestamp: new Date(),
      referrer: document.referrer,
      duration: 0,
    };
    setPageView(pv);

    // Tracker le temps sur la page
    const interval = setInterval(() => {
      setScrollMetrics(prev => ({
        ...prev,
        timeOnPage: (Date.now() - startTime) / 1000,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Tracker le scroll
  useEffect(() => {
    let lastScrollY = 0;
    let lastScrollTime = Date.now();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = documentHeight > 0 ? (scrollY / documentHeight) * 100 : 0;
      const now = Date.now();
      const speed = Math.abs(scrollY - lastScrollY) / ((now - lastScrollTime) / 1000);

      setScrollMetrics(prev => ({
        ...prev,
        maxScrollDepth: Math.max(prev.maxScrollDepth, scrollDepth),
        scrollSpeed: speed,
      }));

      lastScrollY = scrollY;
      lastScrollTime = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tracker les interactions
  const trackInteraction = useCallback((
    type: UserInteraction['type'],
    target: string,
    metadata?: Record<string, unknown>
  ) => {
    const interaction: UserInteraction = {
      type,
      target,
      timestamp: new Date(),
      metadata,
    };

    setInteractions(prev => [...prev, interaction].slice(-100));

    // Log pour debug
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Interaction:', interaction);
    }
  }, []);

  // Tracker les vues de CTA
  const trackCTAView = useCallback((ctaId: string) => {
    trackInteraction('cta_view', ctaId);
    setConversionMetrics(prev => ({
      ...prev,
      ctaViews: prev.ctaViews + 1,
      conversionRate: prev.ctaViews > 0 
        ? (prev.ctaClicks / (prev.ctaViews + 1)) * 100 
        : 0,
    }));
  }, [trackInteraction]);

  // Tracker les clics sur CTA
  const trackCTAClick = useCallback((ctaId: string) => {
    trackInteraction('click', ctaId, { isConversion: true });
    setConversionMetrics(prev => {
      const newClicks = prev.ctaClicks + 1;
      return {
        ...prev,
        ctaClicks: newClicks,
        sessionStarts: ctaId.includes('session') ? prev.sessionStarts + 1 : prev.sessionStarts,
        signupAttempts: ctaId.includes('signup') ? prev.signupAttempts + 1 : prev.signupAttempts,
        conversionRate: prev.ctaViews > 0 ? (newClicks / prev.ctaViews) * 100 : 0,
      };
    });
  }, [trackInteraction]);

  // Calculer le score d'engagement
  const getEngagementScore = useCallback(() => {
    const timeScore = Math.min(scrollMetrics.timeOnPage / 120, 1) * 25; // Max 25 pts pour 2 min
    const scrollScore = (scrollMetrics.maxScrollDepth / 100) * 25; // Max 25 pts pour 100% scroll
    const interactionScore = Math.min(interactions.length / 10, 1) * 25; // Max 25 pts pour 10 interactions
    const ctaScore = conversionMetrics.ctaClicks > 0 ? 25 : 0; // 25 pts si clic CTA

    return Math.round(timeScore + scrollScore + interactionScore + ctaScore);
  }, [scrollMetrics, interactions, conversionMetrics]);

  return {
    pageView,
    interactions,
    conversionMetrics,
    scrollMetrics,
    trackInteraction,
    trackCTAView,
    trackCTAClick,
    getEngagementScore,
  };
}

export default useHomePageAnalytics;
