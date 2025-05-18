
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SegmentContextType {
  segments: string[];
  selectedSegment: string | null;
  setSelectedSegment: (segment: string | null) => void;
}

const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

export const useSegment = () => {
  const context = useContext(SegmentContext);
  if (context === undefined) {
    throw new Error('useSegment must be used within a SegmentProvider');
  }
  return context;
};

interface SegmentProviderProps {
  children: ReactNode;
}

export const SegmentProvider: React.FC<SegmentProviderProps> = ({ children }) => {
  const [segments] = useState<string[]>(['Marketing', 'Design', 'Technique', 'Support', 'RH', 'Finance']);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  return (
    <SegmentContext.Provider value={{ segments, selectedSegment, setSelectedSegment }}>
      {children}
    </SegmentContext.Provider>
  );
};
