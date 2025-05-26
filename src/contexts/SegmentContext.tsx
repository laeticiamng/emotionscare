
import React, { createContext, useContext } from 'react';

interface SegmentContextType {
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const track = (event: string, properties?: Record<string, any>) => {
    console.log('Track event:', event, properties);
  };

  const identify = (userId: string, traits?: Record<string, any>) => {
    console.log('Identify user:', userId, traits);
  };

  const value: SegmentContextType = {
    track,
    identify
  };

  return (
    <SegmentContext.Provider value={value}>
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => {
  const context = useContext(SegmentContext);
  if (!context) {
    throw new Error('useSegment must be used within a SegmentProvider');
  }
  return context;
};
