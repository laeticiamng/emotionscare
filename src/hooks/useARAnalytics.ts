// @ts-nocheck
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePrivacyPrefs } from './usePrivacyPrefs';
import { logger } from '@/lib/logger';

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
}

export const useARAnalytics = () => {
  const { prefs } = usePrivacyPrefs();

  const track = useCallback(async (eventType: string, eventData?: Record<string, any>) => {
    // Respect privacy preferences
    if (!prefs.analytics) {
      logger.info('Analytics disabled by user preference', {}, 'ANALYTICS');
      return;
    }

    try {
      // Send to metrics edge function
      await supabase.functions.invoke('metrics/general', {
        body: {
          event_type: eventType,
          event_data: eventData || {}
        }
      });
    } catch (error) {
      // Analytics errors should not affect UX
      logger.warn('Analytics tracking failed', error, 'ANALYTICS');
    }
  }, [prefs.analytics]);

  // Specific tracking methods for AR and HR features
  const trackFaceFilter = useCallback((data: {
    emotion?: string;
    confidence?: number;
    source: 'camera' | 'fallback';
  }) => {
    try {
      supabase.functions.invoke('metrics/face_filter', {
        body: {
          emotion: data.emotion,
          confidence: data.confidence,
          source: data.source,
          ts: Date.now()
        }
      });
    } catch (error) {
      logger.warn('Face filter tracking failed', error, 'ANALYTICS');
    }
  }, []);

  const trackHRSession = useCallback((data: {
    source: 'ble' | 'sim';
    duration_sec?: number;
    bmp_avg?: number;
  }) => {
    try {
      supabase.functions.invoke('metrics/hr_ping', {
        body: {
          source: data.source,
          bpm_avg: data.bmp_avg,
          duration_sec: data.duration_sec
        }
      });
    } catch (error) {
      logger.warn('HR tracking failed', error, 'ANALYTICS');
    }
  }, []);

  return {
    track,
    trackFaceFilter,
    trackHRSession,
  };
};