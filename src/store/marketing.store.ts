import { create } from 'zustand';
import { logger } from '@/lib/logger';
import { persist } from './utils/createImmutableStore';
import { createSelectors } from './utils/createSelectors';

export type Segment = 'b2c' | 'b2b';

export type UTMParams = {
  source?: string;
  campaign?: string;
};

type MarketingState = {
  segment: Segment;
  utm: UTMParams;
  cookieConsent: boolean | null; // null = not decided yet
  
  setSegment: (segment: Segment) => void;
  setUTM: (utm: UTMParams) => void;
  setCookieConsent: (consent: boolean) => void;
  reset: () => void;
};

const useMarketingStoreBase = create<MarketingState>()(
  persist(
    (set) => ({
      segment: 'b2c', // Default to B2C
      utm: {},
      cookieConsent: null,
      
      setSegment: (segment) => {
        set({ segment });
        // Analytics would be tracked here
        logger.info('Segment switched', { segment }, 'ANALYTICS');
      },
      
      setUTM: (utm) => set({ utm }),
      setCookieConsent: (cookieConsent) => set({ cookieConsent }),
      
      reset: () => set({
        segment: 'b2c',
        utm: {},
        cookieConsent: null
      })
    }),
    {
      name: 'marketing-store'
    }
  )
);

export const useMarketingStore = createSelectors(useMarketingStoreBase);
