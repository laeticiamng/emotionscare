
import React, { createContext, useContext, useState } from 'react';

export interface SegmentDimension {
  key: string;
  label: string;
  options: Array<{
    key: string;
    label: string;
  }>;
}

export interface SegmentOption {
  key: string;
  label: string;
}

export interface SegmentData {
  dimensionKey: string | null;
  optionKey: string | null;
}

export interface SegmentContextType {
  segment: SegmentData;
  setSegment: (segment: SegmentData) => void;
  dimensions: SegmentDimension[];
  isLoading: boolean;
  activeDimension: SegmentDimension | null;
  activeOption: SegmentOption | null;
}

const defaultSegment: SegmentData = {
  dimensionKey: null,
  optionKey: null
};

const SegmentContext = createContext<SegmentContextType>({
  segment: defaultSegment,
  setSegment: () => {},
  dimensions: [],
  isLoading: false,
  activeDimension: null,
  activeOption: null
});

export const SegmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [segment, setSegment] = useState<SegmentData>(defaultSegment);
  const [isLoading, setIsLoading] = useState(false);
  
  const dimensions: SegmentDimension[] = [
    {
      key: 'department',
      label: 'Département',
      options: [
        { key: 'marketing', label: 'Marketing' },
        { key: 'engineering', label: 'Ingénierie' },
        { key: 'sales', label: 'Ventes' },
        { key: 'hr', label: 'Ressources Humaines' }
      ]
    },
    {
      key: 'role',
      label: 'Fonction',
      options: [
        { key: 'manager', label: 'Manager' },
        { key: 'individual', label: 'Collaborateur' },
        { key: 'executive', label: 'Dirigeant' }
      ]
    },
    {
      key: 'location',
      label: 'Localisation',
      options: [
        { key: 'paris', label: 'Paris' },
        { key: 'lyon', label: 'Lyon' },
        { key: 'marseille', label: 'Marseille' },
        { key: 'remote', label: 'Télétravail' }
      ]
    }
  ];
  
  // Find the active dimension and option
  const activeDimension = segment.dimensionKey 
    ? dimensions.find(dim => dim.key === segment.dimensionKey) || null 
    : null;
    
  const activeOption = segment.optionKey && activeDimension
    ? activeDimension.options.find(opt => opt.key === segment.optionKey) || null
    : null;

  return (
    <SegmentContext.Provider value={{
      segment,
      setSegment,
      dimensions,
      isLoading,
      activeDimension,
      activeOption
    }}>
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegment = () => useContext(SegmentContext);
