
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SegmentContextType {
  selectedSegment: string;
  setSelectedSegment: (segment: string) => void;
  segments: string[];
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

interface SegmentProviderProps {
  children: ReactNode;
}

export const SegmentProvider: React.FC<SegmentProviderProps> = ({ children }) => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const segments = ['all', 'hr', 'management', 'employees'];

  const value: SegmentContextType = {
    selectedSegment,
    setSelectedSegment,
    segments
  };

  return (
    <SegmentContext.Provider value={value}>
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
