import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Segment = 'b2c' | 'b2b';

export type UTMParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
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

export const useMarketingStore = create<MarketingState>()(
  persist(
    (set) => ({
      segment: 'b2c', // Default to B2C
      utm: {},
      cookieConsent: null,
      
      setSegment: (segment) => {
        set({ segment });
        // Analytics would be tracked here
        console.log('Segment switched to:', segment);
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