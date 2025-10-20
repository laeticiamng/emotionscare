// @ts-nocheck

import React, { createContext, useContext, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface SegmentContextType {
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

interface SegmentProviderProps {
  children: ReactNode;
}

export const SegmentProvider: React.FC<SegmentProviderProps> = ({ children }) => {
  const track = (event: string, properties?: Record<string, any>) => {
    logger.info('Segment track', { event, properties }, 'ANALYTICS');
  };

  const identify = (userId: string, traits?: Record<string, any>) => {
    logger.info('Segment identify', { userId, traits }, 'ANALYTICS');
  };

  return (
    <SegmentContext.Provider value={{ track, identify }}>
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider');
  }
  return context;
};
