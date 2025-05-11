
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface SegmentOption {
  key: string;
  label: string;
}

export interface SegmentDimension {
  key: string;
  label: string;
  options: SegmentOption[];
}

export interface SegmentValue {
  dimensionKey: string | null;
  optionKey: string | null;
}

interface SegmentContextType {
  segment: SegmentValue;
  setSegment: (segment: SegmentValue) => void;
  activeDimension: SegmentDimension | null;
  setActiveDimension: (dimension: SegmentDimension | null) => void;
  activeOption: SegmentOption | null;
  setActiveOption: (option: SegmentOption | null) => void;
  dimensions: SegmentDimension[];
  isLoading: boolean;
}

const SegmentContext = createContext<SegmentContextType>({
  segment: { dimensionKey: null, optionKey: null },
  setSegment: () => {},
  activeDimension: null,
  setActiveDimension: () => {},
  activeOption: null,
  setActiveOption: () => {},
  dimensions: [],
  isLoading: false
});

interface SegmentProviderProps {
  children: ReactNode;
}

export const SegmentProvider: React.FC<SegmentProviderProps> = ({ children }) => {
  const [segment, setSegmentState] = useState<SegmentValue>({ dimensionKey: null, optionKey: null });
  const [activeDimension, setActiveDimension] = useState<SegmentDimension | null>(null);
  const [activeOption, setActiveOption] = useState<SegmentOption | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Mock dimensions data
  const dimensions: SegmentDimension[] = [
    {
      key: 'department',
      label: 'Département',
      options: [
        { key: 'marketing', label: 'Marketing' },
        { key: 'sales', label: 'Ventes' },
        { key: 'engineering', label: 'Ingénierie' },
        { key: 'hr', label: 'Ressources Humaines' }
      ]
    },
    {
      key: 'location',
      label: 'Localisation',
      options: [
        { key: 'paris', label: 'Paris' },
        { key: 'lyon', label: 'Lyon' },
        { key: 'marseille', label: 'Marseille' }
      ]
    },
    {
      key: 'team',
      label: 'Équipe',
      options: [
        { key: 'alpha', label: 'Alpha' },
        { key: 'beta', label: 'Beta' },
        { key: 'gamma', label: 'Gamma' }
      ]
    }
  ];

  // Update activeDimension and activeOption when segment changes
  useEffect(() => {
    if (segment.dimensionKey) {
      const dimension = dimensions.find(d => d.key === segment.dimensionKey) || null;
      setActiveDimension(dimension);
      
      if (dimension && segment.optionKey) {
        const option = dimension.options.find(o => o.key === segment.optionKey) || null;
        setActiveOption(option);
      } else {
        setActiveOption(null);
      }
    } else {
      setActiveDimension(null);
      setActiveOption(null);
    }
  }, [segment]);

  const setSegment = (newSegment: SegmentValue) => {
    setSegmentState(newSegment);
  };

  return (
    <SegmentContext.Provider
      value={{
        segment,
        setSegment,
        activeDimension,
        setActiveDimension,
        activeOption,
        setActiveOption,
        dimensions,
        isLoading
      }}
    >
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => useContext(SegmentContext);
