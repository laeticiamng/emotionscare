// @ts-nocheck
import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useMarketingStore, Segment, UTMParams } from '@/store/marketing.store';
import { LANDING_UTM_CAMPAIGN, LANDING_UTM_SOURCE, sanitizeLandingUtm } from '@/lib/utm';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Type de segment étendu */
export type ExtendedSegment = Segment | 'enterprise' | 'education' | 'healthcare' | 'nonprofit';

/** Source de trafic */
export type TrafficSource = 'organic' | 'paid' | 'social' | 'email' | 'referral' | 'direct' | 'unknown';

/** Paramètres UTM étendus */
export interface ExtendedUTMParams extends UTMParams {
  medium?: string;
  content?: string;
  term?: string;
}

/** Données de session marketing */
export interface MarketingSession {
  id: string;
  startedAt: Date;
  segment: Segment;
  utm: ExtendedUTMParams;
  trafficSource: TrafficSource;
  landingPage: string;
  referrer: string | null;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  country?: string;
  region?: string;
}

/** Événement de conversion */
export interface ConversionEvent {
  id: string;
  type: string;
  timestamp: Date;
  value?: number;
  metadata?: Record<string, unknown>;
}

/** A/B Test assignation */
export interface ABTestAssignment {
  testId: string;
  variant: string;
  assignedAt: Date;
}

/** Préférences de segment */
export interface SegmentPreferences {
  features: string[];
  pricing: 'standard' | 'premium' | 'enterprise';
  communications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  language: string;
}

/** Configuration du hook */
export interface UseSegmentConfig {
  persistSession?: boolean;
  trackConversions?: boolean;
  enableABTesting?: boolean;
  syncWithBackend?: boolean;
  onSegmentChange?: (segment: Segment) => void;
  onConversion?: (event: ConversionEvent) => void;
}

const DEFAULT_CONFIG: UseSegmentConfig = {
  persistSession: true,
  trackConversions: true,
  enableABTesting: true,
  syncWithBackend: true
};

const STORAGE_KEY = 'emotionscare-marketing-session';

export const useSegment = (config?: UseSegmentConfig) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const store = useMarketingStore();

  const [session, setSession] = useState<MarketingSession | null>(null);
  const [conversions, setConversions] = useState<ConversionEvent[]>([]);
  const [abTests, setABTests] = useState<ABTestAssignment[]>([]);
  const [preferences, setPreferences] = useState<SegmentPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const initializedRef = useRef(false);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  // Détecter le type d'appareil
  const detectDeviceType = useCallback((): 'desktop' | 'mobile' | 'tablet' => {
    const ua = navigator.userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }, []);

  // Détecter la source de trafic
  const detectTrafficSource = useCallback((utm: ExtendedUTMParams, referrer: string | null): TrafficSource => {
    if (utm.source) {
      if (['google', 'bing', 'yahoo', 'duckduckgo'].some(s => utm.source?.includes(s))) {
        return utm.medium === 'cpc' ? 'paid' : 'organic';
      }
      if (['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok'].some(s => utm.source?.includes(s))) {
        return 'social';
      }
      if (utm.medium === 'email') {
        return 'email';
      }
    }

    if (referrer) {
      const referrerHost = new URL(referrer).hostname;
      if (referrerHost !== window.location.hostname) {
        if (['google', 'bing', 'yahoo'].some(s => referrerHost.includes(s))) {
          return 'organic';
        }
        if (['facebook', 'twitter', 'linkedin', 't.co'].some(s => referrerHost.includes(s))) {
          return 'social';
        }
        return 'referral';
      }
    }

    return 'direct';
  }, []);

  // Extraire les paramètres UTM
  const extractUTMParams = useCallback((): ExtendedUTMParams => {
    return {
      source: sanitizeLandingUtm(searchParams.get('utm_source'), LANDING_UTM_SOURCE),
      campaign: sanitizeLandingUtm(searchParams.get('utm_campaign'), LANDING_UTM_CAMPAIGN),
      medium: searchParams.get('utm_medium') || undefined,
      content: searchParams.get('utm_content') || undefined,
      term: searchParams.get('utm_term') || undefined
    };
  }, [searchParams]);

  // Charger la session depuis le storage
  const loadSession = useCallback((): MarketingSession | null => {
    if (!mergedConfig.persistSession) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Vérifier si la session est encore valide (24h)
        const sessionAge = Date.now() - new Date(parsed.startedAt).getTime();
        if (sessionAge < 24 * 60 * 60 * 1000) {
          return {
            ...parsed,
            startedAt: new Date(parsed.startedAt)
          };
        }
      }
    } catch (err) {
      logger.warn('Failed to load marketing session', err as Error, 'MARKETING');
    }
    return null;
  }, [mergedConfig.persistSession]);

  // Sauvegarder la session
  const saveSession = useCallback((sessionData: MarketingSession) => {
    if (!mergedConfig.persistSession) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    } catch (err) {
      logger.warn('Failed to save marketing session', err as Error, 'MARKETING');
    }
  }, [mergedConfig.persistSession]);

  // Initialiser la session
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const existingSession = loadSession();
    const utmParams = extractUTMParams();

    if (existingSession && !Object.values(utmParams).some(v => v)) {
      // Réutiliser la session existante si pas de nouveaux UTM
      setSession(existingSession);
      store.setUTM(existingSession.utm);
      if (existingSession.segment) {
        store.setSegment(existingSession.segment);
      }
    } else {
      // Créer une nouvelle session
      const referrer = document.referrer || null;
      const trafficSource = detectTrafficSource(utmParams, referrer);

      const newSession: MarketingSession = {
        id: sessionIdRef.current,
        startedAt: new Date(),
        segment: store.segment || 'b2c',
        utm: utmParams,
        trafficSource,
        landingPage: location.pathname,
        referrer,
        deviceType: detectDeviceType()
      };

      setSession(newSession);
      saveSession(newSession);

      if (Object.values(utmParams).some(v => v)) {
        store.setUTM(utmParams);
      }
    }

    // Vérifier le paramètre segment
    const segmentParam = searchParams.get('segment') as Segment;
    if (segmentParam && ['b2c', 'b2b'].includes(segmentParam)) {
      store.setSegment(segmentParam);
      mergedConfig.onSegmentChange?.(segmentParam);
    }

    setIsLoading(false);
  }, []);

  // Sync avec le backend
  useEffect(() => {
    if (!mergedConfig.syncWithBackend || !session) return;

    const syncSession = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user?.id) return;

        await supabase.from('marketing_sessions').upsert({
          id: session.id,
          user_id: userData.user.id,
          segment: session.segment,
          utm_source: session.utm.source,
          utm_campaign: session.utm.campaign,
          utm_medium: session.utm.medium,
          utm_content: session.utm.content,
          utm_term: session.utm.term,
          traffic_source: session.trafficSource,
          landing_page: session.landingPage,
          referrer: session.referrer,
          device_type: session.deviceType,
          started_at: session.startedAt.toISOString()
        }, { onConflict: 'id' });
      } catch (err) {
        logger.error('Failed to sync marketing session', err as Error, 'MARKETING');
      }
    };

    syncSession();
  }, [session, mergedConfig.syncWithBackend]);

  // Changer de segment
  const setSegment = useCallback((newSegment: Segment) => {
    store.setSegment(newSegment);

    if (session) {
      const updatedSession = { ...session, segment: newSegment };
      setSession(updatedSession);
      saveSession(updatedSession);
    }

    mergedConfig.onSegmentChange?.(newSegment);

    // Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'segment_change', {
        from_segment: session?.segment,
        to_segment: newSegment
      });
    }

    logger.info('Segment changed', { from: session?.segment, to: newSegment }, 'MARKETING');
  }, [store, session, saveSession, mergedConfig]);

  // Tracker une conversion
  const trackConversion = useCallback(async (
    type: string,
    value?: number,
    metadata?: Record<string, unknown>
  ) => {
    if (!mergedConfig.trackConversions) return;

    const event: ConversionEvent = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date(),
      value,
      metadata
    };

    setConversions(prev => [...prev, event]);
    mergedConfig.onConversion?.(event);

    // Sync avec le backend
    if (mergedConfig.syncWithBackend && session) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        await supabase.from('conversion_events').insert({
          id: event.id,
          session_id: session.id,
          user_id: userData.user?.id,
          type: event.type,
          value: event.value,
          metadata: event.metadata,
          segment: session.segment,
          utm_source: session.utm.source,
          utm_campaign: session.utm.campaign,
          created_at: event.timestamp.toISOString()
        });
      } catch (err) {
        logger.error('Failed to track conversion', err as Error, 'MARKETING');
      }
    }

    // Analytics externes
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          event_category: 'marketing',
          event_label: type,
          value
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('track', type, { value, currency: 'EUR' });
      }
    }

    logger.info('Conversion tracked', { type, value }, 'MARKETING');
  }, [mergedConfig, session]);

  // Assigner un A/B test
  const assignABTest = useCallback(async (testId: string, variants: string[]): Promise<string> => {
    if (!mergedConfig.enableABTesting) {
      return variants[0];
    }

    // Vérifier si déjà assigné
    const existing = abTests.find(t => t.testId === testId);
    if (existing) {
      return existing.variant;
    }

    // Assignation déterministe basée sur l'ID de session
    const hash = sessionIdRef.current.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    const variantIndex = hash % variants.length;
    const variant = variants[variantIndex];

    const assignment: ABTestAssignment = {
      testId,
      variant,
      assignedAt: new Date()
    };

    setABTests(prev => [...prev, assignment]);

    // Sync avec le backend
    if (mergedConfig.syncWithBackend && session) {
      try {
        const { data: userData } = await supabase.auth.getUser();
        await supabase.from('ab_test_assignments').insert({
          session_id: session.id,
          user_id: userData.user?.id,
          test_id: testId,
          variant,
          segment: session.segment,
          assigned_at: assignment.assignedAt.toISOString()
        });
      } catch (err) {
        logger.error('Failed to save AB test assignment', err as Error, 'MARKETING');
      }
    }

    logger.info('AB test assigned', { testId, variant }, 'MARKETING');
    return variant;
  }, [mergedConfig, abTests, session]);

  // Charger les préférences de segment
  const loadPreferences = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      const { data, error: fetchError } = await supabase
        .from('segment_preferences')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('segment', store.segment)
        .single();

      if (!fetchError && data) {
        setPreferences(data.preferences);
      }
    } catch (err) {
      logger.error('Failed to load segment preferences', err as Error, 'MARKETING');
    }
  }, [store.segment]);

  // Sauvegarder les préférences
  const savePreferences = useCallback(async (newPreferences: Partial<SegmentPreferences>) => {
    const updated = { ...preferences, ...newPreferences } as SegmentPreferences;
    setPreferences(updated);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      await supabase.from('segment_preferences').upsert({
        user_id: userData.user.id,
        segment: store.segment,
        preferences: updated,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,segment' });
    } catch (err) {
      logger.error('Failed to save segment preferences', err as Error, 'MARKETING');
    }
  }, [preferences, store.segment]);

  // Déterminer si c'est un utilisateur B2B
  const isB2B = useMemo(() => {
    return store.segment === 'b2b';
  }, [store.segment]);

  // Déterminer si c'est un nouveau visiteur
  const isNewVisitor = useMemo(() => {
    if (!session) return true;
    const sessionAge = Date.now() - session.startedAt.getTime();
    return sessionAge < 60000; // Moins d'une minute
  }, [session]);

  // Stats de conversion
  const conversionStats = useMemo(() => ({
    total: conversions.length,
    totalValue: conversions.reduce((sum, c) => sum + (c.value || 0), 0),
    byType: conversions.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  }), [conversions]);

  // Réinitialiser la session
  const resetSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionIdRef.current = crypto.randomUUID();
    setSession(null);
    setConversions([]);
    setABTests([]);
    initializedRef.current = false;
  }, []);

  return {
    // Segment
    segment: store.segment,
    setSegment,
    isB2B,

    // UTM
    utm: store.utm,

    // Session
    session,
    isNewVisitor,
    isLoading,
    error,

    // Conversions
    trackConversion,
    conversions,
    conversionStats,

    // A/B Testing
    assignABTest,
    abTests,
    getABTestVariant: (testId: string) => abTests.find(t => t.testId === testId)?.variant,

    // Préférences
    preferences,
    loadPreferences,
    savePreferences,

    // Utilitaires
    resetSession,
    trafficSource: session?.trafficSource,
    deviceType: session?.deviceType
  };
};

/** Hook pour tracker automatiquement les pages vues */
export function usePageViewTracking() {
  const location = useLocation();
  const { session, trackConversion } = useSegment({ trackConversions: true });

  useEffect(() => {
    if (session) {
      trackConversion('page_view', undefined, {
        path: location.pathname,
        search: location.search
      });
    }
  }, [location.pathname, session]);
}

/** Hook simplifié pour le segment uniquement */
export function useSimpleSegment() {
  const { segment, setSegment, isB2B } = useSegment({
    trackConversions: false,
    enableABTesting: false,
    syncWithBackend: false
  });

  return { segment, setSegment, isB2B };
}

export default useSegment;