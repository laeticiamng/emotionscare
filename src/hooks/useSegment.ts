import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMarketingStore, Segment, UTMParams } from '@/store/marketing.store';

export const useSegment = () => {
  const [searchParams] = useSearchParams();
  const { 
    segment, 
    utm, 
    setSegment, 
    setUTM 
  } = useMarketingStore();

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
      setUTM(utmParams);
    }

    // Check for segment parameter
    const segmentParam = searchParams.get('segment') as Segment;
    if (segmentParam && (segmentParam === 'b2c' || segmentParam === 'b2b')) {
      setSegment(segmentParam);
    }
  }, [searchParams, setUTM, setSegment]);

  return {
    segment,
    utm,
    setSegment
  };
};