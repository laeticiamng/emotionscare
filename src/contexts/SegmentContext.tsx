
import React, { createContext, useContext, useState } from 'react';

export type Segment = {
  dimensionKey: string;
  optionKey: string;
} | string;

interface SegmentContextType {
  segment: Segment | null;
  setSegment: (segment: Segment | null) => void;
  dimensions: Array<{
    key: string;
    name: string;
    options: Array<{ key: string; name: string }>
  }>;
  isLoading: boolean;
}

const defaultDimensions = [
  {
    key: 'department',
    name: 'Département',
    options: [
      { key: 'marketing', name: 'Marketing' },
      { key: 'sales', name: 'Ventes' },
      { key: 'engineering', name: 'Ingénierie' },
      { key: 'hr', name: 'Ressources Humaines' }
    ]
  },
  {
    key: 'location',
    name: 'Localisation',
    options: [
      { key: 'paris', name: 'Paris' },
      { key: 'lyon', name: 'Lyon' },
      { key: 'marseille', name: 'Marseille' },
      { key: 'remote', name: 'Télétravail' }
    ]
  }
];

const SegmentContext = createContext<SegmentContextType>({
  segment: null,
  setSegment: () => {},
  dimensions: [],
  isLoading: false
});

export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [segment, setSegment] = useState<Segment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SegmentContext.Provider 
      value={{ 
        segment, 
        setSegment, 
        dimensions: defaultDimensions,
        isLoading 
      }}
    >
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => useContext(SegmentContext);
