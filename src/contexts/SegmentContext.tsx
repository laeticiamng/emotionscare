
import React, { createContext, useContext, useState } from 'react';

interface SegmentContextType {
  selectedSegment: string;
  setSelectedSegment: (segment: string) => void;
  segments: string[];
}

const SegmentContext = createContext<SegmentContextType>({
  selectedSegment: 'all',
  setSelectedSegment: () => {},
  segments: ['all', 'hr', 'management', 'employees'],
});

export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const segments = ['all', 'hr', 'management', 'employees'];

  return (
    <SegmentContext.Provider value={{ selectedSegment, setSelectedSegment, segments }}>
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => useContext(SegmentContext);
