import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMarketingStore, Segment, UTMParams } from '@/store/marketing.store';

export const useSegment = () => {
  const [searchParams] = useSearchParams();
  const store = useMarketingStore();

  // Capture UTM parameters from URL
  useEffect(() => {
    const utmParams: UTMParams = {
      source: searchParams.get('utm_source') || undefined,
      medium: searchParams.get('utm_medium') || undefined, 
      campaign: searchParams.get('utm_campaign') || undefined,
      term: searchParams.get('utm_term') || undefined,
      content: searchParams.get('utm_content') || undefined
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