
import React, { createContext, useContext, useState } from 'react';

export type Segment = {
  dimensionKey: string | null;
  optionKey: string | null;
};

export interface SegmentDimension {
  key: string;
  name: string;
  label: string;
  options: Array<{ 
    key: string;
    name: string;
    label: string;
  }>;
}

interface SegmentContextType {
  segment: Segment;
  setSegment: (segment: Segment) => void;
  dimensions: SegmentDimension[];
  isLoading: boolean;
  activeDimension: SegmentDimension | null;
  activeOption: { key: string; name: string; label: string } | null;
}

const defaultDimensions: SegmentDimension[] = [
  {
    key: 'department',
    name: 'Département',
    label: 'Département',
    options: [
      { key: 'marketing', name: 'Marketing', label: 'Marketing' },
      { key: 'sales', name: 'Ventes', label: 'Ventes' },
      { key: 'engineering', name: 'Ingénierie', label: 'Ingénierie' },
      { key: 'hr', name: 'Ressources Humaines', label: 'Ressources Humaines' }
    ]
  },
  {
    key: 'location',
    name: 'Localisation',
    label: 'Localisation',
    options: [
      { key: 'paris', name: 'Paris', label: 'Paris' },
      { key: 'lyon', name: 'Lyon', label: 'Lyon' },
      { key: 'marseille', name: 'Marseille', label: 'Marseille' },
      { key: 'remote', name: 'Télétravail', label: 'Télétravail' }
    ]
  }
];

const SegmentContext = createContext<SegmentContextType>({
  segment: { dimensionKey: null, optionKey: null },
  setSegment: () => {},
  dimensions: [],
  isLoading: false,
  activeDimension: null,
  activeOption: null
});

export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [segment, setSegment] = useState<Segment>({ dimensionKey: null, optionKey: null });
  const [isLoading, setIsLoading] = useState(false);
  
  // Compute active dimension and option based on segment state
  const activeDimension = segment.dimensionKey 
    ? defaultDimensions.find(d => d.key === segment.dimensionKey) || null 
    : null;
    
  const activeOption = activeDimension && segment.optionKey
    ? activeDimension.options.find(o => o.key === segment.optionKey) || null
    : null;

  return (
    <SegmentContext.Provider 
      value={{ 
        segment, 
        setSegment, 
        dimensions: defaultDimensions,
        isLoading,
        activeDimension,
        activeOption
      }}
    >
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => useContext(SegmentContext);
