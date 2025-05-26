
import React, { createContext, useContext, useState } from 'react';

interface SegmentContextType {
  currentSegment: string;
  setCurrentSegment: (segment: string) => void;
  segments: string[];
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSegment, setCurrentSegment] = useState('all');
  const segments = ['all', 'active', 'inactive', 'new'];

  const value: SegmentContextType = {
    currentSegment,
    setCurrentSegment,
    segments,
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
