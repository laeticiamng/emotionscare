// @ts-nocheck
import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMarketingStore, Segment, UTMParams } from '@/store/marketing.store';
import { LANDING_UTM_CAMPAIGN, LANDING_UTM_SOURCE, sanitizeLandingUtm } from '@/lib/utm';

export const useSegment = () => {
  const [searchParams] = useSearchParams();
  const store = useMarketingStore();

  // Capture UTM parameters from URL
  useEffect(() => {
    const utmParams: UTMParams = {
      source: sanitizeLandingUtm(searchParams.get('utm_source'), LANDING_UTM_SOURCE),
      campaign: sanitizeLandingUtm(searchParams.get('utm_campaign'), LANDING_UTM_CAMPAIGN),
    };

    // Only update if we have UTM params
    if (Object.values(utmParams).some(value => value)) {
      store.setUTM(utmParams);
    }

    // Check for segment parameter
    const segmentParam = searchParams.get('segment') as Segment;
    if (segmentParam && (segmentParam === 'b2c' || segmentParam === 'b2b')) {
      store.setSegment(segmentParam);
    }
  }, [searchParams]); // Remove functions from dependencies

  return {
    segment: store.segment,
    utm: store.utm,
    setSegment: store.setSegment
  };
};